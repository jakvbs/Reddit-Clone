import _ from 'lodash';
import Post from '../models/Post';
import Sub from '../models/Sub';
import Vote from '../models/Vote';

export default {
	async findOne(req, res, next) {
		const { id } = req.params;
		const { user } = res.locals;
		const post = await Post.findById(id);
		if (!post) return next();
		if (user) post.setUserVote(user);

		return res.status(200).send(post);
	},

	async findPostComments(req, res, next) {
		const { id } = req.params;
		const { user } = res.locals;

		const post = await Post.findById(id).populate({
			path: 'comments',
			options: { sort: 'createdAt' },
		});

		if (!post) return next();

		const { comments } = post;

		if (user) {
			comments.forEach((comment) => comment.setUserVote(user));
		}

		return res.status(200).send(comments);
	},

	async findAll(req, res, next) {
		const posts = await Post.paginate({ req });

		if (!posts) return next();

		const { user } = res.locals;

		if (user) {
			posts.forEach((post) => post.setUserVote(user));
		}

		return res.status(200).send(posts);
	},

	async vote(req, res, next) {
		const { id } = req.params;
		const { value } = req.body;
		const { user } = res.locals;

		const post = await Post.findById(id);

		if (!post) return next();

		const vote = await Vote.findOne({ user: user._id, post: post._id });

		if (!vote) {
			const newVote = new Vote({
				user,
				value,
				post: post._id,
			});

			post.votes.push(newVote);
			await Promise.all([newVote.save(), post.save()]);

			post.setUserVote(user);
			req.body = _.omit(post.toJSON(), ['userVote']);
			try {
				res.mqttClient.sendMessage(`private/${post.user.username}`, 'Your post has been voted');
			} catch (error) {
				console.log(error);
			}
			return res.status(200).send(post);
		}

		if (value === 0) {
			post.votes.pull(vote);
			post.setUserVote(user);
			await Promise.all([post.save(), vote.remove()]);

			post.setUserVote(user);
			req.body = _.omit(post.toJSON(), ['userVote']);
			try {
				res.mqttClient.sendMessage(`private/${post.user.username}`, 'Your post has been voted');
			} catch (error) {
				console.log(error);
			}
			return res.status(200).send(post);
		}

		vote.value = value;
		post.votes.pull(vote);
		post.votes.push(vote);
		post.setUserVote(user);
		await Promise.all([vote.save(), post.save()]);

		post.setUserVote(user);
		req.body = _.omit(post.toJSON(), ['userVote']);
		try {
			res.mqttClient.sendMessage(`private/${post.user.username}`, 'Your post has been voted');
		} catch (error) {
			console.log(error);
		}
		return res.status(200).send(post);
	},

	async create(req, res) {
		const { title, body, subname } = req.body;

		const { user } = res.locals;

		const findSub = await Sub.findOne({ name: subname });

		if (!findSub) {
			return res.status(404).send({ message: 'Sub not found' });
		}

		const post = new Post({
			title,
			body,
			user,
			sub: findSub,
		});

		findSub.posts.push(post._id);

		await Promise.all([post.save(), findSub.save()]);

		req.body = post.toJSON();
		try {
			res.mqttClient.sendMessage(`private/${post.user.username}`, 'Your post has been created');
		} catch (error) {
			console.log(error);
		}

		return res.status(201).send(post);
	},

	async update(req, res, next) {
		const { id } = req.params;
		const post = await Post.findById(id);

		if (!post) return next();

		if (!res.locals.user.isAdmin && res.locals.user.username !== post.user.username) {
			return res.sendStatus(401);
		}

		const { title, body } = req.body;

		post.title = title;
		post.body = body;

		await post.save();

		req.body = post.toJSON();
		try {
			res.mqttClient.sendMessage(`private/${post.user.username}`, 'Your post has been updated');
		} catch (error) {
			console.log(error);
		}
		return res.status(200).send(post);
	},

	async remove(req, res, next) {
		const { id } = req.params;
		const post = await Post.findById(id).populate(['comments', 'votes']);

		if (!post) return next();

		if (!res.locals.user.isAdmin && res.locals.user.username !== post.user.username) {
			return res.sendStatus(401);
		}

		const sub = await Sub.findById(post.sub._id);
		sub.posts.pull(post);

		post.comments.forEach(async (comment) => {
			await Promise.all(comment.votes.map((voteId) => Vote.findByIdAndRemove(voteId)));
		});

		await Promise.all([
			...post.votes.map((vote) => vote.remove(), ...post.comments.map((comment) => comment.remove())),
			post.remove(),
			sub.save(),
		]);

		req.body = post.toJSON();
		try {
			res.mqttClient.sendMessage(`private/${post.user.username}`, 'Your post has been deleted');
		} catch (error) {
			console.log(error);
		}
		return res.status(200).send(post);
	},
};
