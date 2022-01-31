import jwt from 'jsonwebtoken';
import config from '../config/config';
import User from '../models/User';

export default async (req, res, next) => {
	if (req.user) {
		res.locals.user = req.user;
		return next();
	}

	try {
		const { token } = req.cookies;
		if (!token) return next();

		const { id } = jwt.verify(token, config.jwt_secret);
		const user = await User.findById(id);

		res.locals.user = user;
		next();
	} catch (err) {
		console.log(err);
		return res.status(401).send({ message: 'Invalid token' });
	}
};
