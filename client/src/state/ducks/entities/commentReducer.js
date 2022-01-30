import _ from 'lodash';

const commentReducer = (
    entity,
    state = {
        byId: {},
        byPostId: {},
    },
    action
) => {
    const actionEntities = action.payload[entity];
    const { actionType } = action.meta;

    switch (actionType) {
        case 'GET_POST_COMMENTS':
        case 'COMMENT_ADD':
            if (state.byId[Object.keys(actionEntities)[0]]) return state;
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
                byPostId: {
                    ...Object.keys(actionEntities).reduce((acc, id) => {
                        // if the postId is not in the state, add an array with the comment id
                        if (!acc[actionEntities[id].post.id]) {
                            acc[actionEntities[id].post.id] = [id];
                            return acc;
                        }
                        // else add the comment id to the array
                        acc[actionEntities[id].post.id].unshift(id);
                        return acc;
                    }, state.byPostId),
                },
            };
        case 'COMMENT_VOTE':
            return {
                byId: {
                    ...state.byId,
                    [Object.keys(actionEntities)[0]]: actionEntities[Object.keys(actionEntities)[0]],
                },
                byPostId: state.byPostId,
            };
        case 'COMMENT_DELETE':
            if (!state.byId[Object.keys(actionEntities)[0]]) return state;
            return {
                // delete comment from byId
                byId: _.omit(state.byId, actionEntities),
                byPostId: {
                    ...state.byPostId,
                    // filter an array of comments by the deleted comment id
                    [state.byId[Object.keys(actionEntities)[0]].post.id]: state.byPostId[
                        state.byId[Object.keys(actionEntities)[0]].post.id
                    ].filter((id) => id !== Object.keys(actionEntities)[0]),
                },
            };
        default:
            return state;
    }
};

export default commentReducer;
