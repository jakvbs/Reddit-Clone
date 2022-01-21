import { createAction } from 'redux-api-middleware';
import types from './types';

export const register = (userData) => {
    return createAction({
        endpoint: `${process.env.REACT_APP_API_URL}/auth/register`,
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        types: [types.REGISTER_REQUEST, types.REGISTER_SUCCESS, types.REGISTER_FAILURE],
    });
};

export const login = (userData) => {
    return createAction({
        endpoint: `${process.env.REACT_APP_API_URL}/auth/login`,
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        types: [types.LOGIN_REQUEST, types.LOGIN_SUCCESS, types.LOGIN_FAILURE],
    });
};

export const logout = () => {
    return createAction({
        endpoint: `${process.env.REACT_APP_API_URL}/auth/logout`,
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        types: [types.LOGOUT_REQUEST, types.LOGOUT_SUCCESS, types.LOGOUT_FAILURE],
    });
};

export const validateToken = () => {
    return createAction({
        endpoint: `${process.env.REACT_APP_API_URL}/auth/me`,
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        types: [types.VALIDATE_TOKEN_REQUEST, types.VALIDATE_TOKEN_SUCCESS, types.VALIDATE_TOKEN_FAILURE],
    });
};
