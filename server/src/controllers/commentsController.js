import Comment from '../models/Comment';
import Post from '../models/Post';

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

    async create(req, res) {
        const { body, postId } = req.body;

        const { user } = res.locals;

        const findPost = await Post.findById(postId);

        if (!findPost) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const comment = new Comment({
            body,
            user,
            post: findPost,
        });

        findPost.comments.push(comment._id);

        await Promise.all([comment.save(), findPost.save()]);

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

        post.comments.pull(comment._id);

        await Promise.all([post.save(), ...comment.votes.map((v) => v.remove()), comment.remove()]);

        return res.status(200).send(comment);
    },
};
