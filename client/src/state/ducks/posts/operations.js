import { normalize, schema } from 'normalizr';
import { createAction } from 'redux-api-middleware';
import types from './types';

const postSchema = new schema.Entity('posts');
const postsSchema = [postSchema];

export const getPostsPage = (page, { sort, order }) => {
	return createAction({
		endpoint: `${process.env.REACT_APP_API_URL}/posts?page=${page}&sort=${sort || 'createdAt'}&order=${
			order || 'desc'
		}`,
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		types: [
			types.POSTS_PAGE_REQUEST,
			{
				type: types.POSTS_PAGE_SUCCESS,
				payload: async (_action, _state, res) => {
					const data = await res.json();
					const { entities } = normalize(data, postsSchema);
					return Object.keys(entities).length ? entities : { posts: [] };
				},
				meta: { actionType: 'POSTS_GET_PAGE' },
			},
			types.POSTS_PAGE_FAILURE,
		],
	});
};

export const changeSortOrder = ({ sort, order }) => {
	return createAction({
		endpoint: `${process.env.REACT_APP_API_URL}/posts?sort=${sort}&order=${order}`,
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		types: [
			types.POSTS_SORT_REQUEST,
			{
				type: types.POSTS_SORT_SUCCESS,
				payload: async (_action, _state, res) => {
					const data = await res.json();
					const { entities } = normalize(data, postsSchema);
					return Object.keys(entities).length ? entities : { posts: [] };
				},
				meta: { actionType: 'POSTS_SORT' },
			},
			types.POSTS_SORT_FAILURE,
		],
	});
};

export const getPost = (postId) => {
	return createAction({
		endpoint: `${process.env.REACT_APP_API_URL}/posts/${postId}`,
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		types: [
			types.GET_POST_REQUEST,
			{
				type: types.GET_POST_SUCCESS,
				payload: async (_action, _state, res) => {
					const data = await res.json();
					const { entities } = normalize(data, postSchema);
					return entities;
				},
				meta: { actionType: 'GET_POST' },
			},
			types.GET_POST_FAILURE,
		],
	});
};

export const addPost = (post) => {
	return createAction({
		endpoint: `${process.env.REACT_APP_API_URL}/posts`,
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(post),
		types: [
			types.POST_CREATE_REQUEST,
			{
				type: types.POST_CREATE_SUCCESS,
				payload: async (_action, _state, res) => {
					const data = await res.json();
					const { entities } = normalize(data, postSchema);
					return entities;
				},
				meta: { actionType: 'POST_ADD' },
			},
			types.POST_CREATE_FAILURE,
		],
	});
};

export const editPost = (post) => {
	return createAction({
		endpoint: `${process.env.REACT_APP_API_URL}/posts/${post.id}`,
		method: 'PUT',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(post),
		types: [
			types.POST_EDIT_REQUEST,
			{
				type: types.POST_EDIT_SUCCESS,
				payload: async (_action, _state, res) => {
					const data = await res.json();
					const { entities } = normalize(data, postSchema);
					return entities;
				},
				meta: { actionType: 'POST_EDIT' },
			},
			types.POST_EDIT_FAILURE,
		],
	});
};

export const getSubPosts = (subName) => {
	return createAction({
		endpoint: `${process.env.REACT_APP_API_URL}/subs/${subName}/posts`,
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		types: [
			types.GET_SUB_POSTS_REQUEST,
			{
				type: types.GET_SUB_POSTS_SUCCESS,
				payload: async (_action, _state, res) => {
					const data = await res.json();
					const { entities } = normalize(data, postsSchema);
					return Object.keys(entities).length ? entities : { posts: [] };
				},
				meta: { actionType: 'GET_SUB_POSTS' },
			},
			types.GET_SUB_POSTS_FAILURE,
		],
	});
};

export const getUserPosts = (userId) => {
	return createAction({
		endpoint: `${process.env.REACT_APP_API_URL}/users/${userId}/posts`,
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		types: [
			types.GET_USER_POSTS_REQUEST,
			{
				type: types.GET_USER_POSTS_SUCCESS,
				payload: async (_action, _state, res) => {
					const data = await res.json();
					const { entities } = normalize(data, postsSchema);
					return Object.keys(entities).length ? entities : { posts: [] };
				},
				meta: { actionType: 'GET_USER_POSTS' },
			},
			types.GET_USER_POSTS_FAILURE,
		],
	});
};

export const votePost = ({ postId, value }) => {
	return createAction({
		endpoint: `${process.env.REACT_APP_API_URL}/posts/${postId}/vote`,
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			value,
		}),
		types: [
			types.POST_VOTE_REQUEST,
			{
				type: types.POST_VOTE_SUCCESS,
				payload: async (_action, _state, res) => {
					const data = await res.json();
					const { entities } = normalize(data, postSchema);
					return entities;
				},
				meta: { actionType: 'POST_VOTE' },
			},
			types.POST_VOTE_FAILURE,
		],
	});
};

export const deletePost = (postId) => {
	return createAction({
		endpoint: `${process.env.REACT_APP_API_URL}/posts/${postId}`,
		method: 'DELETE',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		types: [
			types.POST_DELETE_REQUEST,
			{
				type: types.POST_DELETE_SUCCESS,
				payload: async (_action, _state, res) => {
					const data = await res.json();
					const { entities } = normalize(data, postSchema);
					return entities;
				},
				meta: { actionType: 'POST_DELETE' },
			},
			types.POST_DELETE_FAILURE,
		],
	});
};
