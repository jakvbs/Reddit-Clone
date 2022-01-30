import jwt from 'jsonwebtoken';
import config from '../config/config';
import User from '../models/User';

export default {
    async register(req, res) {
        const { email, username, password } = req.body;

        const errors = {};
        const [usernameAlreadyExists, emailAlreadyExists] = await Promise.all([
            User.findOne({ username }),
            User.findOne({ email }),
        ]);
        if (usernameAlreadyExists) errors.username = 'Username already exists';
        if (emailAlreadyExists) errors.email = 'Email already exists';
        if (Object.keys(errors).length) return res.status(400).send(errors);

        const user = await User.create({ username, email, password });

        const token = jwt.sign(
            {
                id: user._id,
            },
            config.jwt_secret,
            { expiresIn: '1d' }
        );

        return res
            .cookie('token', token, {
                httpOnly: true,
                secure: config.env === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/',
            })
            .send(user);
    },

    async login(req, res) {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).send({ username: 'User with this username does not exist' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).send({ password: 'Invalid password' });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            config.jwt_secret,
            { expiresIn: '1d' }
        );

        return res
            .cookie('token', token, {
                httpOnly: true,
                secure: config.env === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/',
            })
            .send(user);
    },

    async logout(req, res) {
        res.clearCookie('token');
        res.clearCookie('session');
        await req.logout();
        return res.sendStatus(200);
    },

    async me(req, res) {
        return res.send(res.locals.user);
    },
};
