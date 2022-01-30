import mqtt from 'mqtt/dist/mqtt';
import { useEffect, useState } from 'react';

const useMqttClient = () => {
    const [client, setClient] = useState(null);

    useEffect(() => {
        setClient(mqtt.connect(process.env.REACT_APP_MQTT_URL));
    }, []);

    useEffect(() => {
        if (client) {
            if (process.env.NODE_ENV === 'development') {
                client.on('connect', () => {
                    console.log('%cMQTT client connected', 'color: red');
                });
            }
            client.on('close', () => {
                setClient(null);
            });
            client.on('error', () => {
                setClient(null);
            });
        }
    }, [client]);

    return { client };
};

export default useMqttClient;
