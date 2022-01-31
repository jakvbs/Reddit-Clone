import types from './types';

const defaultState = {
	loading: false,
	errors: {},
};

export const subReducer = (state = defaultState, action) => {
	switch (action.type) {
		case types.GET_SUB_REQUEST:
		case types.CREATE_SUB_REQUEST:
			return {
				loading: true,
				errors: {},
			};
		case types.GET_SUB_SUCCESS:
		case types.CREATE_SUB_SUCCESS:
			return {
				loading: false,
				errors: {},
			};
		case types.GET_SUB_FAILURE:
		case types.CREATE_SUB_FAILURE:
			return {
				loading: false,
				errors: action.payload.response,
			};
		default:
			return state;
	}
};
