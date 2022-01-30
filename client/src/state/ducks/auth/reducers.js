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
        case types.LOGIN_REQUEST:
        case types.LOGOUT_REQUEST:
        case types.VALIDATE_TOKEN_REQUEST:
            return {
                ...state,
                loading: true,
                errors: {},
            };
        case types.REGISTER_SUCCESS:
        case types.LOGIN_SUCCESS:
        case types.VALIDATE_TOKEN_SUCCESS:
            return {
                ...state,
                loading: false,
                authenticated: true,
                user: action.payload,
                errors: {},
            };
        case types.REGISTER_FAILURE:
        case types.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload.response,
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
        case types.VALIDATE_TOKEN_FAILURE:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
