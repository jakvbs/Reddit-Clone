import Comment from '../models/Comment';
import Post from '../models/Post';
import Sub from '../models/Sub';
import Vote from '../models/Vote';

export default {
    async findOne(req, res, next) {
        const { id } = req.params;
        const { user } = res.locals;
        const post = await Post.findById(id).populate({
            path: 'sub',
            populate: {
                path: 'user',
                select: 'username',
            },
        });
        if (!post) return next();
        if (user) {
            post.setUserVote(user);
        }

        return res.status(200).send(post);
    },

    async findPostComments(req, res) {
        const { id } = req.params;
        const { user } = res.locals;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const comments = await Comment.find({ post: id }).sort({
            voteScore: 1,
        });

        if (!comments) {
            return res.status(404).send({ message: 'Post has no comments' });
        }

        if (user) {
            comments.forEach((comment) => comment.setUserVote(user));
        }

        return res.status(200).send(comments);
    },

    async findAll(req, res) {
        const posts = await Post.paginate({ req });

        if (!posts) {
            return res.status(404).send({ message: 'No post has been created yet' });
        }

        const { user } = res.locals;

        if (user) {
            posts.forEach((post) => post.setUserVote(user));
        }

        return res.status(200).send(posts);
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

        findSub.posts.push(post);

        await Promise.all([post.save(), findSub.save()]);

        return res.status(201).send(post);
    },

    async update(req, res) {
        const { id } = req.params;
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const { title, body } = req.body;

        post.title = title;
        post.body = body;

        return res.status(201).send(post);
    },

    async remove(req, res) {
        const { id } = req.params;
        const post = await Post.findById(id).populate(['comments', 'votes']);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        if (!res.locals.user.isAdmin && res.locals.user.username !== post.user.username) {
            return res.status(401).send({ message: 'Operation not permitted' });
        }

        const sub = await Sub.findById(post.sub._id);
        sub.posts = sub.posts.filter((postId) => !postId.equals(id));

        post.comments.forEach(async (comment) => {
            await Promise.all(comment.votes.map((voteId) => Vote.findByIdAndRemove(voteId)));
        });

        await Promise.all([
            ...post.votes.map((vote) => vote.remove(), ...post.comments.map((comment) => comment.remove())),
            post.remove(),
            sub.save(),
        ]);

        return res.status(200).send(post);
    },
};
