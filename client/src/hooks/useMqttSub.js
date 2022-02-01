import { normalize, schema } from 'normalizr';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useMqttClient from './useMqttClient';

const topics = {
	POST_VOTE: 'posts/vote',
	POST_ADD: 'posts/create',
	POST_EDIT: 'posts/update',
	POST_DELETE: 'posts/remove',
	COMMENT_VOTE: 'comments/vote',
	COMMENT_ADD: 'comments/create',
	COMMENT_EDIT: 'comments/update',
	COMMENTS_DELETE: 'comments/remove',
	EASTER_EGG: 'easter_egg',
};

const postSchema = new schema.Entity('posts');
const commentSchema = new schema.Entity('comments');

const useMqttSub = () => {
	const { client } = useMqttClient();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);

	useEffect(() => {
		if (user && client) {
			client.subscribe(`private/${user.username}`);
			client.on('message', (topic, message) => {
				if (topic === `private/${user.username}`) {
					toast(message.toString());
				}
			});
		}
	}, [user, client]);

	useEffect(() => {
		if (client) {
			Object.values(topics).forEach((topic) => {
				client.subscribe(topic);
			});
			client.on('message', (topic, message) => {
				if (topic === topics.POST_VOTE) {
					const data = JSON.parse(message);
					const { entities } = normalize(data, postSchema);
					dispatch({
						type: 'MQTT',
						payload: entities,
						meta: {
							actionType: 'POST_VOTE',
						},
					});
				}
				if (topic === topics.POST_ADD) {
					const data = JSON.parse(message);
					const { entities } = normalize(data, postSchema);
					dispatch({
						type: 'MQTT',
						payload: entities,
						meta: {
							actionType: 'POST_ADD',
						},
					});
				}
				if (topic === topics.POST_EDIT) {
					const data = JSON.parse(message);
					const { entities } = normalize(data, postSchema);
					dispatch({
						type: 'MQTT',
						payload: entities,
						meta: {
							actionType: 'POST_EDIT',
						},
					});
				}
				if (topic === topics.POST_DELETE) {
					const data = JSON.parse(message);
					const { entities } = normalize(data, postSchema);
					dispatch({
						type: 'MQTT',
						payload: entities,
						meta: {
							actionType: 'POST_DELETE',
						},
					});
				}
				if (topic === topics.COMMENT_VOTE) {
					const data = JSON.parse(message);
					const { entities } = normalize(data, commentSchema);
					dispatch({
						type: 'MQTT',
						payload: entities,
						meta: {
							actionType: 'COMMENT_VOTE',
						},
					});
				}
				if (topic === topics.COMMENT_ADD) {
					const data = JSON.parse(message);
					const { entities } = normalize(data, commentSchema);
					dispatch({
						type: 'MQTT',
						payload: entities,
						meta: {
							actionType: 'COMMENT_ADD',
						},
					});
				}
				if (topic === topics.COMMENT_EDIT) {
					const data = JSON.parse(message);
					const { entities } = normalize(data, commentSchema);
					dispatch({
						type: 'MQTT',
						payload: entities,
						meta: {
							actionType: 'COMMENT_EDIT',
						},
					});
				}
				if (topic === topics.COMMENTS_DELETE) {
					const data = JSON.parse(message);
					const { entities } = normalize(data, commentSchema);
					dispatch({
						type: 'MQTT',
						payload: entities,
						meta: {
							actionType: 'COMMENT_DELETE',
						},
					});
				}
				if (topic === topics.EASTER_EGG) {
					toast(message.toString());
				}
			});
		}
	}, [client]);
};

export default useMqttSub;
