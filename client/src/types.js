import PropTypes from 'prop-types';

export const Sub = PropTypes.shape({
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	imageUrl: PropTypes.string.isRequired,
	postCount: PropTypes.number,
	createdAt: PropTypes.string.isRequired,
	updatedAt: PropTypes.string.isRequired,
});

export const Post = PropTypes.shape({
	id: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	body: PropTypes.string,
	createdAt: PropTypes.string.isRequired,
	updatedAt: PropTypes.string.isRequired,
	sub: PropTypes.instanceOf(Object),
	user: PropTypes.instanceOf(Object),
	url: PropTypes.string.isRequired,
	commentCount: PropTypes.number.isRequired,
	voteScore: PropTypes.number,
	userVote: PropTypes.number,
});

export const User = PropTypes.shape({
	username: PropTypes.string.isRequired,
	email: PropTypes.string.isRequired,
	imageUrl: PropTypes.string.isRequired,
	createdAt: PropTypes.string.isRequired,
	updatedAt: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
});

export const Comment = PropTypes.shape({
	id: PropTypes.string.isRequired,
	body: PropTypes.string.isRequired,
	createdAt: PropTypes.string.isRequired,
	updatedAt: PropTypes.string.isRequired,
	post: PropTypes.instanceOf(Object),
	user: PropTypes.instanceOf(Object),
	voteScore: PropTypes.number.isRequired,
	userVote: PropTypes.number,
});
