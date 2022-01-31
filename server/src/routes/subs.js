import { Router } from 'express';
import SubsController from '../controllers/subsController';
import auth from '../middlewares/auth';
import { catchAsync } from '../middlewares/errors';
import extractUser from '../middlewares/extractUser';
import { getSubFilters } from '../middlewares/filters';
import { subValidator } from '../middlewares/validators';

export default () => {
	const api = Router();

	// GET /subs/:name
	api.get('/:name', extractUser, catchAsync(SubsController.findOne));

	// GET /subs/:name/posts
	api.get('/:name/posts', extractUser, catchAsync(SubsController.findSubPosts));

	// GET /subs
	api.get('/', getSubFilters, catchAsync(SubsController.findAll));

	// POST /subs
	api.post('/', auth, extractUser, subValidator, catchAsync(SubsController.create));

	// PUT /subs/:name
	// api.put('/:name', auth, extractUser, subValidator, catchAsync(SubsController.update));

	// DELETE /subs/:name
	// api.delete('/:name', auth, extractUser, catchAsync(SubsController.delete));

	return api;
};
