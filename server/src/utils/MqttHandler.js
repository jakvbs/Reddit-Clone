import mqtt from 'async-mqtt';
import config from '../config/config';

class MqttHandler {
	constructor() {
		this.mqttClient = null;
		this.host = config.mqttUrl;
	}

	connect() {
		this.mqttClient = mqtt.connect(this.host);

		this.mqttClient.on('connect', () => {
			console.log('Mqtt client connected');
		});

		this.mqttClient.on('error', (err) => {
			console.log(err);
			this.mqttClient.end();
		});

		this.mqttClient.on('message', function onMessage(topic, message) {
			console.log('Topic: ', topic, 'Message: ', message.toString());
		});

		this.mqttClient.on('close', () => {
			console.log('Mqtt client disconnected');
		});
	}

	sendMessage(topic, message) {
		return new Promise((resolve, reject) => {
			this.mqttClient
				.publish(topic, message)
				.then(() => {
					resolve();
				})
				.catch((err) => {
					reject(err);
				});
		});
	}

	subscribe(topic) {
		return new Promise((resolve, reject) => {
			this.mqttClient
				.subscribe(topic)
				.then(() => {
					resolve();
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
}

export default MqttHandler;
