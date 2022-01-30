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

    async update(req, res) {
        const { id } = req.params;
        const { user } = res.locals;
        if (!res.locals.user._id.equals(id)) {
            return res.sendStatus(403);
        }

        const { imageUrl, username, email, password } = req.body;
        const errors = {};
        const [usernameAlreadyExists, emailAlreadyExists] = await Promise.all([
            User.findOne({ username }),
            User.findOne({ email }),
        ]);
        if (usernameAlreadyExists && !usernameAlreadyExists._id.equals(id)) errors.username = 'Username already exists';
        if (emailAlreadyExists && !emailAlreadyExists._id.equals(id)) errors.email = 'Email already exists';
        if (Object.keys(errors).length) return res.status(400).send(errors);

        if (imageUrl) user.imageUrl = imageUrl;
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();
        return res.status(200).send(user);
    },
};
