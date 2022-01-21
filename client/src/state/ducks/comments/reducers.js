import types from './types';

const defaultState = {
    loading: false,
    errors: {},
};

export const commentReducer = (state = defaultState, action) => {
    switch (action.type) {
        case types.GET_POST_COMMENTS_REQUEST:
            return {
                ...state,
                loading: true,
                errors: {},
            };
        case types.GET_POST_COMMENTS_SUCCESS:
            return {
                loading: false,
                errors: {},
            };
        case types.GET_POST_COMMENTS_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload.response,
            };
        case types.GET_SUB_POSTS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case types.COMMENT_CREATE_REQUEST:
            return {
                ...state,
                loading: true,
                errors: {},
            };
        case types.COMMENT_CREATE_SUCCESS:
            return {
                loading: false,
                errors: {},
            };
        case types.COMMENT_CREATE_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload.response,
            };
        case types.COMMENT_VOTE_REQUEST:
            return {
                ...state,
                loading: true,
                errors: {},
            };
        case types.COMMENT_VOTE_SUCCESS:
            return {
                loading: false,
                errors: {},
            };
        case types.COMMENT_VOTE_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload.response,
            };
        default:
            return state;
    }
};
