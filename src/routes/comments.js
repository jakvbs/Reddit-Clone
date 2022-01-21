import { Router } from 'express';
import commentsController from '../controllers/commentsController';
import jwtAuth from '../middlewares/auth';
import { catchAsync } from '../middlewares/errors';
import extractUserInfo from '../middlewares/extractUser';
import { commentValidator } from '../middlewares/validators';

export default () => {
    const api = Router();

    // GET /comments/:id
    api.get('/:id', catchAsync(commentsController.findOne));

    // GET /comments
    api.get('/', catchAsync(commentsController.findAll));

    // POST /comments
    api.post('/', jwtAuth, extractUserInfo, commentValidator, catchAsync(commentsController.create));

    // PUT /comments/:id
    api.put('/:id', jwtAuth, extractUserInfo, commentValidator, catchAsync(commentsController.update));

    // DELETE /comments/:id
    api.delete('/:id', jwtAuth, extractUserInfo, catchAsync(commentsController.remove));

    return api;
};
