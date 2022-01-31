import types from './types';

const defaultState = {
	loading: false,
	error: null,
	pageNumber: 1,
	voteLoading: false,
};

export const postReducer = (state = defaultState, action) => {
	switch (action.type) {
		case types.POSTS_PAGE_REQUEST:
		case types.POSTS_SORT_REQUEST:
		case types.GET_POST_REQUEST:
		case types.POST_CREATE_REQUEST:
		case types.GET_SUB_POSTS_REQUEST:
			return {
				...state,
				loading: true,
				error: null,
			};
		case types.POST_VOTE_REQUEST:
			return {
				...state,
				voteLoading: true,
			};
		case types.POSTS_PAGE_SUCCESS:
			return {
				...state,
				loading: false,
				pageNumber: state.pageNumber + 1,
				error: null,
			};

		case types.POSTS_SORT_SUCCESS:
			return {
				...state,
				loading: false,
				pageNumber: 2,
				error: null,
			};
		case types.GET_SUB_POSTS_SUCCESS:
		case types.POST_CREATE_SUCCESS:
		case types.POST_VOTE_SUCCESS:
			return {
				...state,
				voteLoading: false,
				loading: false,
				error: null,
			};
		case types.POSTS_PAGE_FAILURE:
		case types.POSTS_SORT_FAILURE:
		case types.GET_POST_FAILURE:
		case types.POST_CREATE_FAILURE:
		case types.GET_SUB_POSTS_FAILURE:
		case types.POST_VOTE_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload,
			};
		default:
			return state;
	}
};
