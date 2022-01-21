import dotenv from 'dotenv';

dotenv.config();

export default {
    mongoUrl: process.env.MONGODB_URI,
    settings: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};
