import types from './types';

const defaultState = {
    loading: false,
    errors: {},
};

export const subReducer = (state = defaultState, action) => {
    switch (action.type) {
        case types.GET_SUB_REQUEST:
            return {
                ...state,
                loading: true,
                errors: {},
            };
        case types.GET_SUB_SUCCESS:
            return {
                loading: false,
                errors: {},
            };
        case types.GET_SUB_FAILURE:
            return {
                loading: false,
                errors: action.payload.response,
            };
        case types.GET_SUB_POSTS_REQUEST:
            return {
                ...state,
                loading: true,
                errors: {},
            };
        case types.GET_SUB_POSTS_SUCCESS:
            return {
                loading: false,
                errors: {},
            };
        case types.GET_SUB_POSTS_FAILURE:
            return {
                loading: false,
                errors: action.payload.response,
            };
        default:
            return state;
    }
};
