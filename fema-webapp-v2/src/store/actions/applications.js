import * as actionType from './actionTypes';
import axinstance from '../../axios-orders';
import axprocess from '../../axios-process';
import storage, { database } from '../../Firebase/Firebase';


export const addApplicationSuccess = (appID, appData) => {
    return { type: actionType.ADD_APPLICATION_SUCCESS, appID: appID, appData: appData }
}

export const addApplicationFailed = (error) => {
    return { type: actionType.ADD_APPLICATION_FAILED, error: error }
}

export const addApplicationStart = () => {
    return { type: actionType.ADD_APPLICATION_START }
}

export const addApplication = (applicationData, token, googleKey) => {
    return dispatch => {
        dispatch(addApplicationStart());

        let image = applicationData['applicationData']['upload']
        let image_name = applicationData['applicationID'] + "_" + image.name
        applicationData['applicationData']['upload'] = image_name
        const uploadTask = storage.ref(`images/${image_name}`).put(image);
        let address = applicationData['applicationData']['street'] + " " + applicationData['applicationData']['city'] + " " + applicationData['applicationData']['state'] + " " + applicationData['applicationData']['zipCode']
        let location = encodeURI(address)
        address = applicationData['applicationData']['street'] + ", " + applicationData['applicationData']['city'] + ", " + applicationData['applicationData']['state'] + ", " + applicationData['applicationData']['zipCode']

        let streetviewURL = "https://maps.googleapis.com/maps/api/streetview?size=+640x640&location=" + location + "&key=" + googleKey

        // First upload image, then put the data
        uploadTask.on("state_changed", snapshot => { }, error => { console.log(error); },
            () => {
                storage
                    .ref("images")
                    .child(image_name)
                    .getDownloadURL()
                    .then(url => {
                        applicationData['applicationData']['image-url'] = url
                        applicationData['applicationData']['street-url'] = streetviewURL
                        applicationData['applicationData']['ukey'] = applicationData['applicationID']
                        applicationData['applicationData']['address'] = address
                        axinstance.post('/applications.json?auth=' + token, applicationData).then((response) => {
                            dispatch(addApplicationSuccess(applicationData['applicationID'], applicationData))
                        }).catch(error => {
                            dispatch(addApplicationFailed(error.message))
                        });

                    }).catch(error => {
                        dispatch(addApplicationFailed(error.message))
                    });
            }
        );

    }
}

export const fetchApplicationsStart = () => {
    return { type: actionType.FETCH_APPLICATIONS_START }
}

export const fetchApplicationsSucess = (applications) => {
    return { type: actionType.FETCH_APPLICATIONS_SUCCESS, applications: applications }
}

export const fetchApplicationsFailed = (applications) => {
    return { type: actionType.FETCH_APPLICATIONS_FAILED, applications: applications }
}

export const fetchApplications = (token, userId) => {
    return dispatch => {
        dispatch(fetchApplicationsStart());
        let querryParams = '?auth=' + token + '&orderBy="userId"'
        axinstance.get('/applications.json' + querryParams).then((response) => {
            dispatch(fetchApplicationsSucess(response.data))
        }).catch(error => {
            dispatch(fetchApplicationsFailed(error.message))
        });
    }
}

export const processApplicationStart = () => {
    return { type: actionType.PROCESS_APPLICATION_START, processAppFailed: false, processAppDone: false  }
}

export const processApplicationSucess = (appData) => {
    return { type: actionType.PROCESS_APPLICATION_SUCCESS, application: appData, processAppFailed: false, processAppDone: true }
}

export const processApplicationFailed = (appData) => {
    return { type: actionType.PROCESS_APPLICATION_FAILED, application: appData, processAppFailed: true, processAppDone: true }
}

export const resetProcessAppState = () => {
    return { type: actionType.PROCESS_APPLICATION_INIT, application: null, processAppFailed: false, processAppDone: false }

}
export const processApplication = (token, appData) => {
    return dispatch => {
        dispatch(processApplicationStart());
        console.log(appData)
        console.log("appid: " + appData.applicationID)
        let querryParams = '?auth=' + token + '&orderBy="applicationID"'
        axinstance.get('/applications.json' + querryParams).then((response) => {
            let finalkey = null;
            let finalEntry = null
            for (var key in response.data) {
                // check if the property/key is defined in the object itself, not in parent
                if (response.data[key].applicationID === appData.applicationID) {
                    finalkey = key;
                    finalEntry = response.data[key]
                    break
                }
            }
            if (finalkey !== null) {
                console.log(response.data[key].applicationData['image-url'])
                let location = encodeURIComponent(response.data[key].applicationData['image-url'])
                console.log(location)

                axprocess.post('/get_prediction/' + location)
                .then(response => {
                    console.log(response)
                    let updates = {};
                    finalEntry.applicationData['analysis'] = response.data.value
                    updates['/applications/' + finalkey] = finalEntry;
                    database.ref().update(updates).then(() => {
                        console.log("PASSES")
                        dispatch(processApplicationSucess(response.data))
                    }).catch(() => {
                        console.log("ERROR")
                        dispatch(processApplicationFailed(response.data))
                    })  
                }).catch(error => {
                    console.log(error)
                    let updates = {};
                    finalEntry.applicationData['analysis'] = response.data.value
                    updates['/applications/' + finalkey] = finalEntry;
                    database.ref().update(updates).then(() => {
                        console.log("PASSES")
                        dispatch(processApplicationSucess(response.data))
                    }).catch(() => {
                        console.log("ERROR")
                        dispatch(processApplicationFailed(response.data))
                    })
                    dispatch(processApplicationFailed(response.data))
                })

              
            } else {
                dispatch(processApplicationFailed(response.data))
            }

        }).catch(error => {
            dispatch(processApplicationFailed(error.message))
        });
    }
}

export const deleteApplicationStart = () => {
    return { type: actionType.DELETE_APPLICATION_START }
}

export const deleteApplicationSucess = (appData) => {
    return { type: actionType.DELETE_APPLICATION_SUCCESS, application: appData }
}

export const deleteApplicationFailed = (appData) => {
    return { type: actionType.DELETE_APPLICATION_FAILED, application: appData }
}

export const deleteApplication = (token, appData) => {
    return dispatch => {
        dispatch(deleteApplicationStart());
        let querryParams = '?auth=' + token + '&orderBy="applicationID&equalTo="' + appData['applicationID']
        axinstance.get('/applications.json' + querryParams).then((response) => {
            console.log(response)
            dispatch(deleteApplicationSucess(response.data))
        }).catch(error => {
            dispatch(deleteApplicationFailed(error.message))
        });
    }
}