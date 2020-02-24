import * as actionType from './actionTypes';
import axinstance from '../../axios-auth';

export const loginStart = (username) => {
    return { type: actionType.LOGIN_START, username: username }
}

export const loginSuccessful = (data, username) => {
    return { type: actionType.LOGIN_SUCESSFUL, data: data, username: username }
}

export const loginFailed = (error) => {
    return { type: actionType.LOGIN_FAILED, error: error }
}

export const checkAuthState = () => {
    return dispatch => {
        const token = localStorage.getItem('fema-app-token');
        if (!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('fema-app-token-expiry'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const username = localStorage.getItem('fema-app-user');
                const userid = localStorage.getItem('fema-app-userid');
                const sendData = {
                    idToken: token,
                    refreshToken: null,
                    loading: false,
                    localId: userid,
                    error: null
                };
                dispatch(loginSuccessful(sendData, username))
                dispatch(checkTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
            }
        }
    }
}

export const logout = () => {
    localStorage.removeItem('fema-app-token');
    localStorage.removeItem('fema-app-token-expiry');
    localStorage.removeItem('fema-app-user');
    localStorage.removeItem('fema-app-userid');
    return { type: actionType.LOGOUT }
}

export const checkTimeout = (expiryTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expiryTime * 1000);
    }
}

export const login = (username, password, isSignIn) => {

    return dispatch => {
        dispatch(loginStart(username));
        let url = '/accounts:signUp?key=xxxxxxxxx';
        if (isSignIn) {
            url = '/accounts:signInWithPassword?key=XXXXXXXXXXXXXXX';
        }

        const payload = { email: username, password: password, returnSecureToken: true };
        axinstance.post(url, payload).then(response => {

            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);

            localStorage.setItem('fema-app-token', response.data.idToken);
            localStorage.setItem('fema-app-token-expiry', expirationDate);
            localStorage.setItem('fema-app-user', username);
            localStorage.setItem('fema-app-userid', response.data.localId);

            dispatch(loginSuccessful(response.data, username));
            dispatch(checkTimeout(response.data.expiresIn));
        }).catch(error => {
            dispatch(loginFailed(error.response.data.error.message));
        });


    }
}