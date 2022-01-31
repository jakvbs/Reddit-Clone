import passport from 'passport';

export default (req, res, next) => {
	if (req.user) return next();
	passport.authenticate('jwt', { session: false })(req, res, next);
};
