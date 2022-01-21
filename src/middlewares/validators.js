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

const validate = (schema) => async (req, res, next) => {
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
    commentId: Joi.string(),
});

export const registerValidator = validate(registerSchema);
export const loginValidator = validate(loginSchema);
export const subValidator = validate(subSchema);
export const postValidator = validate(postSchema);
export const commentValidator = validate(commentSchema);
export const voteValidator = validate(voteSchema);
