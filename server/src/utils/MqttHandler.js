import mqtt from 'async-mqtt';

class MqttHandler {
    constructor() {
        this.mqttClient = null;
        this.host = 'mqtt://localhost:1883';
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

        this.mqttClient.on('message', function (topic, message) {
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
