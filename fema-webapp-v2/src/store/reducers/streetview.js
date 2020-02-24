import * as actionType from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';


const fetchStreetView = (state, address) => {
    return updateObject(state, {svError: null, address: address, svLoading: false})
}

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionType.GET_STREETVIEW_START: return updateObject(state, {appError: null, appLoading: true})
        case actionType.GET_STREETVIEW_SUCCESS: return fetchStreetView(state, action)
        case actionType.GET_STREETVIEW_FAILED: return updateObject(state, {appError: action.error, appLoading: false})
        
        default: return state;
    }

}

export default reducer;