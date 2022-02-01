import dotenv from 'dotenv';

dotenv.config();

export default {
	env: process.env.NODE_ENV,
	port: process.env.PORT,
	mongoHost: process.env.MONGO_HOST,
	mongoPort: process.env.MONGO_PORT,
	mongoDb: process.env.MONGO_DB,
	mqttUrl: process.env.MQTT_URL,
	client_url: process.env.CLIENT_URL,
	jwt_secret: process.env.JWT_SECRET,
	google_client_id: process.env.GOOGLE_CLIENT_ID,
	google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
	google_callback_url: process.env.GOOGLE_CALLBACK_URL,
	cookie_name: process.env.COOKIE_NAME,
};
