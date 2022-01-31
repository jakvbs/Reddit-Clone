import commentReducer from './commentReducer';
import postReducer from './postReducer';
import subReducer from './subReducer';

const usersDefaultState = {
	byId: {},
	allIds: [],
};

const subsDefaultState = {
	byId: {},
	allIds: [],
};

const postsDefaultState = {
	byId: {},
	allIds: [],
	bySubName: {},
	byUserId: {},
};

const commentsDefaultState = {
	byId: {},
	byPostId: {},
	byUserId: {},
};

const defaultState = {
	users: usersDefaultState,
	subs: subsDefaultState,
	posts: postsDefaultState,
	comments: commentsDefaultState,
};

export const entities = (state = defaultState, action) => {
	if (!action.meta || !action.meta.actionType) return state;

	let reducer;
	switch (Object.keys(action.payload)[0]) {
		case 'subs':
			reducer = subReducer;
			break;
		case 'posts':
			reducer = postReducer;
			break;
		case 'comments':
			reducer = commentReducer;
			break;
		default:
			throw new Error(`Unknown entity: ${action.meta.entity}`);
	}

	return {
		...state,
		...Object.keys(action.payload).reduce(
			(acc, entity) => ({
				...acc,
				[entity]: reducer(entity, state[entity], action),
			}),
			{}
		),
	};
};
