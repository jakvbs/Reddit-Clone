import { Router } from 'express';
import userController from '../controllers/usersController';
import auth from '../middlewares/auth';
import { catchAsync } from '../middlewares/errors';
import extractUser from '../middlewares/extractUser';
import { userValidator, validateId } from '../middlewares/validators';

export default () => {
    const api = Router();

    // GET /users/:id
    api.get('/:id', catchAsync(userController.findOne));

    // GET /users/:id/posts
    api.get('/:id/posts', extractUser, catchAsync(userController.findUserPosts));

    // GET /users/:id/comments
    api.get('/:id/comments', extractUser, catchAsync(userController.findUserComments));

    // PUT /users/:id
    api.put('/:id', validateId, auth, extractUser, userValidator, catchAsync(userController.update));

    return api;
};
