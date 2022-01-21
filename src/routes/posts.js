import { Router } from 'express';
import postsController from '../controllers/postsController';
import jwtAuth from '../middlewares/auth';
import { catchAsync } from '../middlewares/errors';
import extractUserInfo from '../middlewares/extractUser';
import { getPostFilters } from '../middlewares/filters';
import { postValidator } from '../middlewares/validators';

export default () => {
    const api = Router();

    // GET /posts/:id
    api.get('/:id', extractUserInfo, catchAsync(postsController.findOne));

    // GET /posts/:id/comments
    api.get('/:id/comments', extractUserInfo, catchAsync(postsController.findPostComments));

    // GET /posts
    api.get('/', getPostFilters, extractUserInfo, catchAsync(postsController.findAll));

    // POST /posts
    api.post('/', jwtAuth, extractUserInfo, postValidator, catchAsync(postsController.create));

    // PUT /posts/:id
    api.put('/:id', jwtAuth, extractUserInfo, postValidator, catchAsync(postsController.update));

    // DELETE /posts/:id
    api.delete('/:id', jwtAuth, extractUserInfo, catchAsync(postsController.remove));

    return api;
};
