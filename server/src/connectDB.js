import dotenv from 'dotenv';
import mongoose from 'mongoose';
import config from './config/config';

dotenv.config();

const settings = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

export default () => {
    mongoose.connect(config.mongodb_uri, settings);

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
};
