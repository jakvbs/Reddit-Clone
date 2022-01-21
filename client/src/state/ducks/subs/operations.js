import { normalize, schema } from 'normalizr';
import { createAction } from 'redux-api-middleware';
import types from './types';

const subSchema = new schema.Entity('subs');

export const getSub = (name) => {
    return createAction({
        endpoint: `${process.env.REACT_APP_API_URL}/subs/${name}`,
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        types: [
            types.GET_SUB_REQUEST,
            {
                type: types.GET_SUB_SUCCESS,
                payload: async (_action, _state, res) => {
                    const data = await res.json();
                    const { entities } = normalize(data, subSchema);
                    return entities;
                },
                meta: { actionType: 'GET_SUB' },
            },
            types.GET_SUB_FAILURE,
        ],
    });
};

export const createSub = (post) => {
    return createAction({
        endpoint: `${process.env.REACT_APP_API_URL}/subs`,
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
        types: [
            types.CREATE_SUB_REQUEST,
            {
                type: types.CREATE_SUB_SUCCESS,
                payload: async (_action, _state, res) => {
                    const data = await res.json();
                    const { entities } = normalize(data, subSchema);
                    return entities;
                },
                meta: { actionType: 'CREATE_SUB' },
            },
            types.CREATE_SUB_FAILURE,
        ],
    });
};
