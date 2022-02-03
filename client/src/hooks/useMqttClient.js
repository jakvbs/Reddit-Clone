import mqtt from 'mqtt/dist/mqtt';
import { useEffect, useState } from 'react';

const useMqttClient = () => {
	const [client, setClient] = useState(null);

	useEffect(() => {
		setClient(mqtt.connect(process.env.REACT_APP_MQTT_URL));
	}, []);

	useEffect(() => {
		if (client) {
			client.on('connect', () => {
				if (process.env.NODE_ENV === 'development') {
					console.log('%cMQTT client connected', 'color: green');
				}
			});
			client.on('close', () => {
				if (process.env.NODE_ENV === 'development') {
					console.log('%cMQTT client disconnected', 'color: red');
				}
				setClient(null);
			});
			client.on('error', () => {
				if (process.env.NODE_ENV === 'development') {
					console.log('%cMQTT client error', 'color: red');
				}
				setClient(null);
			});
		}
	}, [client]);

	return { client };
};

export default useMqttClient;
