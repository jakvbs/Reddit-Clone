import { Router } from 'express';
import postsController from '../controllers/postsController';
import auth from '../middlewares/auth';
import { catchAsync } from '../middlewares/errors';
import extractUserInfo from '../middlewares/extractUser';
import { getPostFilters } from '../middlewares/filters';
import mqttPublish from '../middlewares/mqttPublish';
import { postValidator, validateId, voteValidator } from '../middlewares/validators';

export default () => {
	const api = Router();

	// GET /posts/:id
	api.get('/:id', validateId, extractUserInfo, catchAsync(postsController.findOne));

	// GET /posts/:id/comments
	api.get('/:id/comments', validateId, extractUserInfo, catchAsync(postsController.findPostComments));

	// GET /posts
	api.get('/', getPostFilters, extractUserInfo, catchAsync(postsController.findAll));

	// POST /posts/:id/vote
	api.post(
		'/:id/vote',
		validateId,
		auth,
		extractUserInfo,
		voteValidator,
		mqttPublish('posts/vote'),
		catchAsync(postsController.vote)
	);

	// POST /posts
	api.post(
		'/',
		auth,
		extractUserInfo,
		postValidator,
		mqttPublish('posts/create'),
		catchAsync(postsController.create)
	);

	// PUT /posts/:id
	api.put(
		'/:id',
		validateId,
		auth,
		extractUserInfo,
		postValidator,
		mqttPublish('posts/update'),
		catchAsync(postsController.update)
	);

	// DELETE /posts/:id
	api.delete(
		'/:id',
		validateId,
		auth,
		extractUserInfo,
		mqttPublish('posts/remove'),
		catchAsync(postsController.remove)
	);

	return api;
};
