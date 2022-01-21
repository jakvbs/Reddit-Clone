import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';
import passport from 'passport';
import dbConfig from './config/database';
import logger from './config/logger';
import passportConfig from './config/passport';
import { catchErrors, notFound } from './middlewares/errors';
import auth from './routes/auth';
import comments from './routes/comments';
import posts from './routes/posts';
import subs from './routes/subs';
import users from './routes/users';
import votes from './routes/votes';

passportConfig();

mongoose.connect(dbConfig.mongoUrl, dbConfig.settings);

mongoose.connection.on('connected', () => {
    console.log('MongoDB connection open');
});

mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit();
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection closed');
});

const app = express();
app.use(helmet());
app.use(
    cors({
        // origin: 'http://localhost:3000',
        origin: true,
        methods: 'GET,POST,PUT,DELETE',
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
        keys: [process.env.COOKIE_NAME],
        maxAge: 24 * 60 * 60 * 1000,
    })
);
app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === 'production') {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
    });

    app.use(limiter);
}

// routes config
app.get('/api', (_, res) => res.send('API is running'));
app.use('/api/auth', auth());
app.use('/api/users', users());
app.use('/api/subs', subs());
app.use('/api/posts', posts());
app.use('/api/comments', comments());
app.use('/api/votes', votes());

// errors handling
app.use(notFound);
app.use(catchErrors);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('../../client/build'));
}

app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
