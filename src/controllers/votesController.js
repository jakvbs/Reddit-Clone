import Comment from '../models/Comment';
import Post from '../models/Post';
import Vote from '../models/Vote';

export default {
    async findAll(req, res) {
        const votes = await Vote.find();
        return res.status(200).send({ data: votes });
    },

    async create(req, res) {
        const { postId, commentId, value } = req.body;

        const { user } = res.locals;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).send({ message: 'Post not found' });
        let vote;
        let comment;

        if (commentId) {
            comment = await Comment.findById(commentId);
            vote = await Vote.findOne({ user: user._id, comment: comment._id });
        } else {
            vote = await Vote.findOne({ user: user._id, post: post._id });
        }

        if (!vote && value === 0) {
            return res.status(400).send({ message: 'You have not voted' });
        }

        if (vote && vote.value === value) {
            return res.status(400).send({ message: 'You have already voted' });
        }

        if (value === 0) {
            if (comment) {
                comment.votes = comment.votes.filter((el) => !el.user.equals(user._id));
                await Promise.all([comment.save(), vote.remove()]);
                comment.setUserVote(user);
                return res.status(200).send(comment);
            }
            post.votes = post.votes.filter((el) => !el.user.equals(user._id));
            post.setUserVote(user);
            await Promise.all([post.save(), vote.remove()]);
            return res.status(200).send(post);
        }

        if (!vote) {
            vote = new Vote({
                user,
                value,
            });
            if (comment) {
                vote.comment = comment._id;
                comment.votes.push(vote);
            } else {
                vote.post = post._id;
                post.votes.push(vote);
            }
        }

        if (vote.value !== value) {
            vote.value = value;
        }

        if (comment) {
            comment.votes = comment.votes.filter((el) => !el.user.equals(user._id));
            comment.votes.push(vote);
            comment.setUserVote(user);
            await Promise.all([comment.save(), vote.save()]);
            return res.status(200).send(comment);
        }
        post.votes = post.votes.filter((el) => !el.user.equals(user._id));
        post.votes.push(vote);
        post.setUserVote(user);
        await Promise.all([post.save(), vote.save()]);
        return res.status(200).send(post);
    },

    // async update(req, res, next) {},

    // async remove(req, res, next) {},
};
