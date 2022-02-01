import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import config from './config/config';
import logger from './config/logger';
import passportConfig from './config/passport';
import connectDB from './connectDB';
import { catchErrors, notFound } from './middlewares/errors';
import auth from './routes/auth';
import comments from './routes/comments';
import posts from './routes/posts';
import subs from './routes/subs';
import users from './routes/users';
import MqttHandler from './utils/MqttHandler';

connectDB();

passportConfig();

const mqttClient = new MqttHandler();
mqttClient.connect();

const app = express();
app.use(helmet());
app.use(
	cors({
		// origin: 'http://localhost:3000',
		origin: true,
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: logger.stream }));

app.use(
	cookieSession({
		name: 'session',
		keys: [config.cookie_name],
		maxAge: 24 * 60 * 60 * 1000,
	})
);
app.use(passport.initialize(undefined));
app.use(passport.session(undefined));

app.use((req, res, next) => {
	res.mqttClient = mqttClient;
	next();
});

// routes config
app.get('/api', (req, res) => res.send(`API is running on port ${config.port}`));
app.use('/api/auth', auth());
app.use('/api/users', users());
app.use('/api/subs', subs());
app.use('/api/posts', posts());
app.use('/api/comments', comments());

// errors handling
app.use(notFound);
app.use(catchErrors);

// if (config.env === 'production') {
//     app.use(express.static('../../client/build'));
// }

app.listen(config.port || 8080, () => {
	console.log(`Server is running on port ${config.port}`);
});
