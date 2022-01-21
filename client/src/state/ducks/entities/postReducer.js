import _ from 'lodash';

const bySubNameReducer = (state, actionEntities) => ({
    ...Object.keys(actionEntities).reduce((acc, id) => {
        if (!acc[actionEntities[id].sub.name]) {
            acc[actionEntities[id].sub.name] = [id];
            return acc;
        }
        acc[actionEntities[id].sub.name].unshift(id);
        return acc;
    }, state.bySubName),
});

const postReducer = (
    entity,
    state = {
        byId: {},
        allIds: [],
        bySubName: {},
    },
    action
) => {
    const actionEntities = action.payload[entity];
    const { actionType } = action.meta;

    switch (actionType) {
        case 'POSTS_GET_PAGE':
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
                allIds: [...state.allIds, ...Object.keys(actionEntities).filter((id) => !state.allIds.includes(id))],
                bySubName: state.bySubName,
                byUserId: state.byUserId,
            };
        case 'POSTS_SORT':
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
                allIds: Object.keys(actionEntities),
                bySubName: state.bySubName,
                byUserId: state.byUserId,
            };
        case 'GET_POST':
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
                allIds: state.allIds,
                bySubName: state.bySubName,
                byUserId: state.byUserId,
            };
        case 'GET_SUB_POSTS':
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
                allIds: [...state.allIds],
                bySubName: bySubNameReducer(state, actionEntities),
                byUserId: state.byUserId,
            };
        case 'GET_USER_POSTS':
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
                allIds: state.allIds,
                bySubName: bySubNameReducer(state, actionEntities),
                byUserId: {
                    ...Object.keys(actionEntities).reduce((acc, id) => {
                        if (!acc[actionEntities[id].user.id]) {
                            acc[actionEntities[id].user.id] = [id];
                            return acc;
                        }
                        acc[actionEntities[id].user.id].unshift(id);
                        return acc;
                    }, state.byUserId),
                },
            };
        case 'POST_ADD':
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
                allIds: [...Object.keys(actionEntities), ...state.allIds.slice(0, -1)],
                bySubName: bySubNameReducer(state, actionEntities),
                byUserId: state.byUserId[actionEntities[Object.keys(actionEntities)[0]].user.id]
                    ? {
                          ...state.byUserId,
                          [actionEntities[Object.keys(actionEntities)[0]].user.id]: [
                              ...Object.keys(actionEntities),
                              ...state.byUserId[actionEntities[Object.keys(actionEntities)[0]].user.id],
                          ],
                      }
                    : {
                          ...state.byUserId,
                          [actionEntities[Object.keys(actionEntities)[0]].user.id]: [...Object.keys(actionEntities)],
                      },
            };
        case 'POST_EDIT':
            return {
                byId: {
                    ...state.byId,
                    [Object.keys(actionEntities)[0]]: {
                        ...state.byId[Object.keys(actionEntities)[0]],
                        ...actionEntities[Object.keys(actionEntities)[0]],
                    },
                },
                allIds: state.allIds,
                bySubName: state.bySubName,
                byUserId: state.byUserId,
            };
        case 'POST_VOTE':
            return {
                byId: {
                    ...state.byId,
                    [Object.keys(actionEntities)[0]]: actionEntities[Object.keys(actionEntities)[0]],
                },
                allIds: state.allIds,
                bySubName: state.bySubName,
                byUserId: state.byUserId,
            };
        case 'POST_DELETE':
            return {
                // delete post from byId
                byId: _.omit(state.byId, actionEntities),
                allIds: state.allIds.filter((id) => id !== Object.keys(actionEntities)[0]),
                bySubName: state.bySubName[actionEntities[Object.keys(actionEntities)[0]].sub.name]
                    ? {
                          ...state.bySubName,
                          // filter an array of posts by the deleted comment id
                          [actionEntities[Object.keys(actionEntities)[0]].sub.name]: state.bySubName[
                              actionEntities[Object.keys(actionEntities)[0]].sub.name
                          ].filter((id) => id !== Object.keys(actionEntities)[0]),
                      }
                    : state.bySubName,
                // finish
                byUserId: state.byUserId[actionEntities[Object.keys(actionEntities)[0]].user.id]
                    ? {
                          ...state.byUserId,
                          // filter an array of posts by the deleted comment id
                          [actionEntities[Object.keys(actionEntities)[0]].user.id]: state.byUserId[
                              actionEntities[Object.keys(actionEntities)[0]].user.id
                          ].filter((id) => id !== Object.keys(actionEntities)[0]),
                      }
                    : state.bySubName,
            };
        default:
            return state;
    }
};

export default postReducer;
