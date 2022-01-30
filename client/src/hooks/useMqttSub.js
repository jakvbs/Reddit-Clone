import { normalize, schema } from 'normalizr';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useMqttClient from './useMqttClient';

const topics = {
    POST_ADD: 'posts/add',
    POST_VOTE: 'posts/vote',
    POST_EDIT: 'posts/update',
    POST_DELETE: 'posts/delete',
    COMMENT_ADD: 'comments/add',
    COMMENT_VOTE: 'comments/vote',
    COMMENTS_DELETE: 'comments/delete',
};

const postSchema = new schema.Entity('posts');
const commentSchema = new schema.Entity('comments');

const useMqttSub = () => {
    const { client } = useMqttClient();
    const dispatch = useDispatch();

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
                        type: 'MQTT_POST_VOTE',
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
                        type: 'MQTT_POST_ADD',
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
                        type: 'MQTT_POST_EDIT',
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
                        type: 'MQTT_POST_DELETE',
                        payload: entities,
                        meta: {
                            actionType: 'POST_DELETE',
                        },
                    });
                }
                if (topic === topics.COMMENT_ADD) {
                    const data = JSON.parse(message);
                    const { entities } = normalize(data, commentSchema);
                    dispatch({
                        type: 'MQTT_COMMENT_ADD',
                        payload: entities,
                        meta: {
                            actionType: 'COMMENT_ADD',
                        },
                    });
                }
                if (topic === topics.COMMENTS_DELETE) {
                    const data = JSON.parse(message);
                    const { entities } = normalize(data, commentSchema);
                    dispatch({
                        type: 'MQTT_COMMENT_DELETE',
                        payload: entities,
                        meta: {
                            actionType: 'COMMENT_DELETE',
                        },
                    });
                }
                if (topic === topics.COMMENT_VOTE) {
                    const data = JSON.parse(message);
                    const { entities } = normalize(data, commentSchema);
                    dispatch({
                        type: 'MQTT_COMMENT_VOTE',
                        payload: entities,
                        meta: {
                            actionType: 'COMMENT_VOTE',
                        },
                    });
                }
            });
        }
    }, [client]);
};

export default useMqttSub;
