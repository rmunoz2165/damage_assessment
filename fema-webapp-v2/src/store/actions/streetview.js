import * as actionType from './actionTypes';
import axios from 'axios'
import storage from '../../Firebase/Firebase';

export const getStreetViewStart = () => {
    return { type: actionType.FETCH_APPLICATIONS_START }
}

export const getStreetViewSucess = (applications) => {
    return { type: actionType.FETCH_APPLICATIONS_SUCCESS, applications: applications }
}

export const getStreetViewFailed = (applications) => {
    return { type: actionType.FETCH_APPLICATIONS_FAILED, applications: applications }
}

export const getStreetView = (size, location, key) => {
    return dispatch => {
        dispatch(getStreetViewStart());
        let querryParams = 'metadata?size=+' + size + '&location=' + location + '&key=' + key
        console.log(querryParams)
        axios({
            method: 'get',
            url: 'https://maps.googleapis.com/maps/api/streetview/metadata?size=+640x640&location=175+W+St+James+St+San+Jose%2C+CA+95110&key=xxxxxxx',
            responseType: 'stream'
          }).then(function (response) {
              console.log(response)

              //response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
              var metadata = {
                contentType: 'image/jpeg',
              };
              const uploadTask = storage.ref(`images/sample1001.jpg`).put(response.data, metadata);
              // First upload image, then put the data
              uploadTask.on("state_changed", snapshot => {},error => {console.log(error);},
                  () => {
                      storage
                          .ref("images")
                          .child(`images/sample1001.jpg`)
                          .getDownloadURL()
                          .then(url => {
                              console.log(url);
                              dispatch(getStreetViewSucess(response.data))
                          }).catch(error => {
                            dispatch(getStreetViewFailed(error.message))
                          });
                  }
              );

            }).catch(error => {
                console.log(error)
                dispatch(getStreetViewFailed(error.message))
            });
    }
}
