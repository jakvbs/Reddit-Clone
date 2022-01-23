import { Router } from 'express';
import votesController from '../controllers/votesController';
import auth from '../middlewares/auth';
import { catchAsync } from '../middlewares/errors';
import extractUserInfo from '../middlewares/extractUser';
import { voteValidator } from '../middlewares/validators';

export default () => {
    const api = Router();

    // GET /votes
    api.get('/', catchAsync(votesController.findAll));

    // POST /votes
    api.post('/', auth, extractUserInfo, voteValidator, catchAsync(votesController.create));

    // PUT /votes
    // api.put('/', auth, extractUserInfo, catchAsync(votesController.update));

    // DELETE /votes
    // api.delete('/', auth, extractUserInfo, catchAsync(votesController.remove));

    return api;
};
