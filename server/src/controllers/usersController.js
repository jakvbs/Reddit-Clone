import Comment from '../models/Comment';
import Post from '../models/Post';
import User from '../models/User';

export default {
    async findOne(req, res) {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send({
                message: 'User not found',
            });
        }
        return res.status(200).send(user);
    },

    async findUserPosts(req, res) {
        const user = await User.findById(req.params.id);
        const posts = await Post.find({ user: user._id });

        if (res.locals.user) {
            posts.forEach((post) => post.setUserVote(res.locals.user));
        }

        return res.status(200).send(posts);
    },
    async findUserComments(req, res) {
        const user = await User.findById(req.params.id);
        const comments = await Comment.find({ user: user._id });

        if (res.locals.user) {
            comments.forEach((comment) => comment.setUserVote(res.locals.user));
        }

        return res.status(200).send(comments);
    },

    async findAll(req, res) {
        const users = await User.find();
        return res.status(200).send({ data: users });
    },
};
