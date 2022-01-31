const subReducer = (entity, state = { allIds: [], byId: {} }, action) => {
	const actionEntities = action.payload[entity];
	const { actionType } = action.meta;

	switch (actionType) {
		case 'GET_SUB':
			return {
				byId: {
					...state.byId,
					...Object.keys(actionEntities).reduce(
						(acc, id) => ({
							...acc,
							[id]: {
								...state.byId[id],
								...actionEntities[id],
							},
						}),
						{}
					),
				},
				allIds: [...state.allIds, ...Object.keys(actionEntities)],
			};
		case 'CREATE_SUB':
			return {
				byId: {
					...Object.keys(actionEntities).reduce(
						(acc, id) => ({
							...acc,
							[id]: {
								...state.byId[id],
								...actionEntities[id],
							},
						}),
						{}
					),
					...state.byId,
				},
				allIds: [...state.allIds, ...Object.keys(actionEntities)],
			};
		default:
			return state;
	}
};

export default subReducer;
