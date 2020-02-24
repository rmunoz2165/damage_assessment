import * as actionType from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    error: null,
    applications: [],
    loading: false,
    purchased: false,
    appError: false,
    appLoading: false,
    processAppFailed: false,
    processAppDone: false,
    
}

const addNewApplication = (state, action) => {
    const newApplication = {
        ...action.appData,
        appID: action.appID 
    }
    let applications = state.applications.concat(newApplication)
    
    return updateObject(state, {loading: false, applications: applications, purchased: true}) 
}

const fetchApplications = (state, action) => {
    let applications = []
    for (let key in action.applications) {
        applications.push(action.applications[key]);
    }
    return updateObject(state, {appError: null, applications: applications, appLoading: false})
}

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionType.ADD_APPLICATION: return updateObject(state, {price: action.price})
        case actionType.ADD_APPLICATION_SUCCESS: return addNewApplication(state, action)
        case actionType.ADD_APPLICATION_FAILED: return updateObject(state, {loading: false, error: action.error})
        case actionType.ADD_APPLICATION_START: return updateObject(state, {loading: true, error: false})

        case actionType.FETCH_APPLICATIONS_START: return updateObject(state, {appError: null, appLoading: true})
        case actionType.FETCH_APPLICATIONS_SUCCESS: return fetchApplications(state, action)
        case actionType.FETCH_APPLICATIONS_FAILED: return updateObject(state, {appError: action.error, appLoading: false})
        
        case actionType.PROCESS_APPLICATION_START: return updateObject(state, {processAppFailed: false, processAppDone: false})
        case actionType.PROCESS_APPLICATION_SUCCESS: return updateObject(state, {processAppFailed: false, processAppDone: true})
        case actionType.PROCESS_APPLICATION_FAILED: return updateObject(state, {processAppFailed: true, processAppDone: true})


        default: return state;
    }

}

export default reducer;