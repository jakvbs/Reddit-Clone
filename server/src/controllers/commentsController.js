import Comment from '../models/Comment';
import Post from '../models/Post';
import Vote from '../models/Vote';

export default {
    async findOne(req, res, next) {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if (!comment) return next();
        return res.status(200).send({ data: comment });
    },

    async findAll(req, res) {
        const comments = await Comment.find();
        return res.status(200).send(comments);
    },

    async vote(req, res) {
        const { id } = req.params;
        const { value, postId } = req.body;
        const { user } = res.locals;

        const [comment, post] = await Promise.all([Comment.findById(id), Post.findById(postId)]);

        if (!comment || !post) return next();

        const vote = await Vote.findOne({ user: user._id, post: post._id });

        if ((!vote && value === 0) || value === vote?.value) {
            res.sendStatus(400);
        }

        if (!vote) {
            const newVote = new Vote({
                user,
                value,
                post: post._id,
            });

            comment.votes.push(newVote);
            comment.setUserVote(user);
            await Promise.all([newVote.save(), comment.save()]);

            req.body = comment;
            return res.status(200).send(comment);
        }

        if (value === 0) {
            comment.votes.pull(vote);
            comment.setUserVote(user);
            await Promise.all([comment.save(), vote.remove()]);

            req.body = comment;
            return res.status(200).send(comment);
        }

        vote.value = value;
        comment.votes.pull(vote);
        comment.votes.push(vote);
        comment.setUserVote(user);
        await Promise.all([vote.save(), comment.save()]);

        req.body = comment;
        return res.status(200).send(comment);
    },

    async create(req, res) {
        const { body, postId } = req.body;

        const { user } = res.locals;

        const findPost = await Post.findById(postId);

        if (!findPost) return next();

        const comment = new Comment({
            body,
            user,
            post: findPost,
        });

        findPost.comments.push(comment._id);

        await Promise.all([comment.save(), findPost.save()]);

        req.body = comment;
        return res.status(201).send(comment);
    },

    async update(req, res, next) {},

    async remove(req, res) {
        const { id } = req.params;
        const comment = await Comment.findById(id).populate('votes');

        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        if (!res.locals.user.isAdmin && res.locals.user.username !== comment.user.username) {
            return res.status(401).send({ message: 'Operation not permitted' });
        }

        const post = await Post.findById(comment.post);

        post.comments.pull(comment);

        await Promise.all([post.save(), ...comment.votes.map((v) => v.remove()), comment.remove()]);

        req.body = comment;
        return res.status(200).send(comment);
    },
};
