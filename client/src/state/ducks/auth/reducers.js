import types from './types';

const initialState = {
    authenticated: false,
    loading: false,
    user: null,
    errors: {},
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.REGISTER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case types.REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                authenticated: true,
                user: action.payload,
                errors: {},
            };
        case types.REGISTER_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload.response,
            };
        case types.LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case types.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                authenticated: true,
                user: action.payload,
                errors: {},
            };
        case types.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload.response,
            };
        case types.LOGOUT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case types.LOGOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                authenticated: false,
                user: null,
                errors: {},
            };
        case types.LOGOUT_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload.response,
            };
        case types.VALIDATE_TOKEN_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case types.VALIDATE_TOKEN_SUCCESS:
            return {
                ...state,
                loading: false,
                authenticated: true,
                user: action.payload,
                errors: {},
            };
        case types.VALIDATE_TOKEN_FAILURE:
            return {
                ...state,
                loading: false,
                // errors: action.payload.response,
            };
        default:
            return state;
    }
};
