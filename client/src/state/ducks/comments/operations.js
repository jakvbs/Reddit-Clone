import { normalize, schema } from 'normalizr';
import { createAction } from 'redux-api-middleware';
import types from './types';

const commentSchema = new schema.Entity('comments');
const commentsSchema = [commentSchema];

export const getPostComments = (postId) => {
    return createAction({
        endpoint: `${process.env.REACT_APP_API_URL}/posts/${postId}/comments`,
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        types: [
            types.GET_POST_COMMENTS_REQUEST,
            {
                type: types.GET_POST_COMMENTS_SUCCESS,
                payload: async (_action, _state, res) => {
                    const data = await res.json();
                    const { entities } = normalize(data, commentsSchema);
                    return Object.keys(entities).length ? entities : { comments: [] };
                },
                meta: { actionType: 'GET_POST_COMMENTS' },
            },
            types.GET_POST_COMMENTS_FAILURE,
        ],
    });
};

export const addComment = (comment) => {
    return createAction({
        endpoint: `${process.env.REACT_APP_API_URL}/comments`,
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(comment),
        types: [
            types.COMMENT_CREATE_REQUEST,
            {
                type: types.COMMENT_CREATE_SUCCESS,
                payload: async (_action, _state, res) => {
                    const data = await res.json();
                    const { entities } = normalize(data, commentSchema);
                    return entities;
                },
                meta: { actionType: 'COMMENT_ADD' },
            },
            types.COMMENT_CREATE_FAILURE,
        ],
    });
};

export const voteComment = ({ postId, commentId, value }) => {
    return createAction({
        endpoint: `${process.env.REACT_APP_API_URL}/votes`,
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            postId,
            commentId,
            value,
        }),
        types: [
            types.COMMENT_CREATE_REQUEST,
            {
                type: types.COMMENT_VOTE_SUCCESS,
                payload: async (_action, _state, res) => {
                    const data = await res.json();
                    const { entities } = normalize(data, commentSchema);
                    return entities;
                },
                meta: { actionType: 'COMMENT_VOTE' },
            },
            types.COMMENT_VOTE_FAILURE,
        ],
    });
};

export const deleteComment = (commentId) => {
    return createAction({
        endpoint: `${process.env.REACT_APP_API_URL}/comments/${commentId}`,
        method: 'DELETE',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        types: [
            types.COMMENT_DELETE_REQUEST,
            {
                type: types.COMMENT_DELETE_SUCCESS,
                payload: async (_action, _state, res) => {
                    const data = await res.json();
                    const { entities } = normalize(data, commentSchema);
                    return entities;
                },
                meta: { actionType: 'COMMENT_DELETE' },
            },
            types.COMMENT_DELETE_FAILURE,
        ],
    });
};
