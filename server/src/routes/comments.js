import { Router } from 'express';
import commentsController from '../controllers/commentsController';
import auth from '../middlewares/auth';
import { catchAsync } from '../middlewares/errors';
import extractUserInfo from '../middlewares/extractUser';
import mqttPublish from '../middlewares/mqttPublish';
import { commentValidator, validateId, voteValidator } from '../middlewares/validators';

export default () => {
	const api = Router();

	// GET /comments/:id
	api.get('/:id', validateId, catchAsync(commentsController.findOne));

	// GET /comments
	api.get('/', catchAsync(commentsController.findAll));

	// POST /comments/:id/vote
	api.post(
		'/:id/vote',
		validateId,
		auth,
		extractUserInfo,
		voteValidator,
		mqttPublish('comments/vote'),
		catchAsync(commentsController.vote)
	);

	// POST /comments
	api.post(
		'/',
		auth,
		extractUserInfo,
		commentValidator,
		mqttPublish('comments/create'),
		catchAsync(commentsController.create)
	);

	// PUT /comments/:id
	api.put(
		'/:id',
		validateId,
		auth,
		extractUserInfo,
		commentValidator,
		mqttPublish('comments/update'),
		catchAsync(commentsController.update)
	);

	// DELETE /comments/:id
	api.delete(
		'/:id',
		validateId,
		auth,
		extractUserInfo,
		mqttPublish('comments/remove'),
		catchAsync(commentsController.remove)
	);

	return api;
};
