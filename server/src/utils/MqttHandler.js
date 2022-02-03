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

		this.mqttClient.on('close', () => {
			console.log('Mqtt client disconnected');
		});
	}

	sendMessage(topic, message) {
		this.mqttClient.publish(topic, message).catch((err) => {
			console.log(err);
		});
	}
}

export default MqttHandler;
