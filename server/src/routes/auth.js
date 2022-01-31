import { Router } from 'express';
import passport from 'passport';
import AuthController from '../controllers/authController';
import auth from '../middlewares/auth';
import { catchAsync } from '../middlewares/errors';
import extractUser from '../middlewares/extractUser';
import { loginValidator, registerValidator } from '../middlewares/validators';

export default () => {
	const api = Router();

	// POST /auth/register
	api.post('/register', registerValidator, catchAsync(AuthController.register));

	// POST /auth/login
	api.post('/login', loginValidator, catchAsync(AuthController.login));

	// GET /auth/logout
	api.get('/logout', extractUser, catchAsync(AuthController.logout));

	// GET /auth/me
	api.get('/me', auth, extractUser, catchAsync(AuthController.me));

	api.get('/login/success', (req, res) => {
		if (req.user) {
			res.status(200).send({
				success: true,
				message: 'successfull',
				user: req.user,
				//   cookies: req.cookies
			});
		}
	});

	api.get('/login/failed', (req, res) => res.sendStatus(401));

	api.get('/google', passport.authenticate('google', { scope: ['profile'] }));

	api.get('/google/redirect', passport.authenticate('google'), (req, res) =>
		res.status(301).redirect('http://localhost:3000/')
	);

	return api;
};
