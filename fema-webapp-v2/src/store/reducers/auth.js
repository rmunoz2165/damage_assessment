import * as actionType from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
    token: null,
    refreshToken: null,
    username: null,
    loading: false,
    localId: null,
    googlekey: 'XXXXXXXXXXXXXXXX'
}

const loginStart = (state, action) => {
    return updateObject(state, {
        token: null,
        refreshToken: null,
        username: action.username,
        localId: null,
        loading: true,
        error: null});
}

const loginSucess = (state, action) => {
    return updateObject(state, {
        token: action.data.idToken, 
        username: action.username,
        refreshToken: action.data.refreshToken, 
        loading: false,
        localId: action.data.localId,
        error: null});
}

const loginFailed = (state, action) => {
    return updateObject(state, {
        token: null, 
        refreshToken: null, 
        loading: false,
        localId: null,
        error: action.error});
}

const logout = (state, action) => {
    return updateObject(state, {
        token: null,
        refreshToken: null,
        loading: false,
        error: null});
}

const reducer = (state = initialState, action) => {

    switch (action.type) {
        case actionType.LOGIN_START: return loginStart(state, action)
        case actionType.LOGIN_SUCESSFUL: return loginSucess(state, action)
        case actionType.LOGIN_FAILED: return loginFailed(state, action)
        case actionType.LOGOUT: return logout(state, action)
        default: return state;
    }

}

export default reducer;