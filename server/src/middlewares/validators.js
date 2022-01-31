import Joi from 'joi';

const options = {
	abortEarly: false,
	allowUnknown: true,
	stripUnknown: true,
	errors: {
		wrap: {
			label: '',
		},
	},
};

const validateBody = (schema) => async (req, res, next) => {
	try {
		req.body = await schema.validateAsync(req.body, options);
		return next();
	} catch (err) {
		const errors = err.details.reduce((acc, curr) => {
			acc[curr.path] = curr.message;
			return acc;
		}, {});
		return res.status(400).send(errors);
	}
};

const registerSchema = Joi.object({
	email: Joi.string().email().required(),
	username: Joi.string().min(3).max(15).required(),
	password: Joi.string().min(8).max(64).required(),
});

const loginSchema = Joi.object({
	username: Joi.string().required(),
	password: Joi.string().required(),
});

const userSchema = Joi.object({
	imageUrl: Joi.string().uri().required(),
	username: Joi.string().min(3).max(15).required(),
	email: Joi.string().email().required(),
	password: Joi.string().allow(null, '').min(8).max(64),
});

const subSchema = Joi.object({
	name: Joi.string().min(3).max(25).required(),
	title: Joi.string().min(3).max(50).required(),
	description: Joi.string().min(3).max(100).required(),
});

const postSchema = Joi.object({
	title: Joi.string().min(2).max(100).required(),
	body: Joi.string(),
	subname: Joi.string().required(),
});

const commentSchema = Joi.object({
	body: Joi.string().min(1).max(1000).required(),
	postId: Joi.string().required(),
});

const voteSchema = Joi.object({
	value: Joi.number().min(-1).max(1).required(),
	postId: Joi.string(),
});

export const registerValidator = validateBody(registerSchema);
export const loginValidator = validateBody(loginSchema);
export const userValidator = validateBody(userSchema);
export const subValidator = validateBody(subSchema);
export const postValidator = validateBody(postSchema);
export const commentValidator = validateBody(commentSchema);
export const voteValidator = validateBody(voteSchema);

export const validateId = (req, res, next) => {
	const { id } = req.params;

	if (id.length !== 24) {
		return res.status(400).send({ message: 'Invalid id' });
	}

	return next();
};
