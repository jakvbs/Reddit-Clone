import { Router } from 'express';
import userController from '../controllers/usersController';
import { catchAsync } from '../middlewares/errors';
import extractUser from '../middlewares/extractUser';

export default () => {
    const api = Router();

    // GET /users/:id
    api.get('/:id', catchAsync(userController.findOne));

    // GET /users/:id/posts
    api.get('/:id/posts', extractUser, catchAsync(userController.findUserPosts));

    // GET /users/:id/comments
    api.get('/:id/comments', extractUser, catchAsync(userController.findUserComments));

    // GET /users
    api.get('/', catchAsync(userController.findAll));

    return api;
};
