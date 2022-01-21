import types from './types';

const defaultState = {
    loading: false,
    errors: {},
    pageNumber: 1,
    sortOption: { sort: 'createdAt', order: 'desc' },
};

export const postReducer = (state = defaultState, action) => {
    switch (action.type) {
        case types.POSTS_PAGE_REQUEST:
            return {
                ...state,
                loading: true,
                errors: {},
            };
        case types.POSTS_PAGE_SUCCESS:
            return {
                ...state,
                loading: false,
                pageNumber: state.pageNumber + 1,
                errors: {},
            };
        case types.POSTS_PAGE_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload.response,
            };
        case types.POSTS_SORT_REQUEST:
            return {
                ...state,
                loading: true,
                errors: {},
            };
        case types.POSTS_SORT_SUCCESS:
            return {
                ...state,
                loading: false,
                pageNumber: 2,
                errors: {},
            };
        case types.POSTS_SORT_FAILURE:
            return {
                ...state,
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
                ...state,
                loading: false,
                errors: {},
            };
        case types.GET_SUB_POSTS_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload.response,
            };
        case types.POST_CREATE_REQUEST:
            return {
                ...state,
                loading: true,
                errors: {},
            };
        case types.POST_CREATE_SUCCESS:
            return {
                ...state,
                loading: false,
                errors: {},
            };
        case types.POST_CREATE_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload.response,
            };
        case types.POST_VOTE_REQUEST:
            return {
                ...state,
                errors: {},
                error: {},
            };
        case types.POST_VOTE_SUCCESS:
            return {
                ...state,
                loading: false,
                errors: {},
            };
        case types.POST_VOTE_FAILURE:
            return {
                ...state,
                loading: false,
                errors: action.payload.response,
            };
        default:
            return state;
    }
};
