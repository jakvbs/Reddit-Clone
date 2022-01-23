import Sub from '../models/Sub';

export default {
    async findOne(req, res, next) {
        const sub = await Sub.findOne({ name: req.params.name }).populate(['posts', 'user']);
        if (!sub) return res.status(404).send({ message: 'Sub not found' });

        const { user } = res.locals;
        if (user) {
            sub.posts.forEach((post) => post.setUserVote(user));
        }
        return res.status(200).send(sub);
    },

    async findSubPosts(req, res) {
        const limit = parseInt(req.query.limit, 10) || 25;
        const page = parseInt(req.query.page, 10) || 1;
        const skip = (page - 1) * limit;

        const sub = await Sub.findOne({ name: req.params.name }).populate({
            path: 'posts',
            options: { sort: { createdAt: 1 }, skip, limit },
        });

        const { posts } = sub;

        if (!posts) {
            return res.status(404).send({ message: 'No post has been created yet' });
        }

        const { user } = res.locals;
        if (user) {
            posts.forEach((post) => post.setUserVote(user));
        }
        return res.status(200).send(posts);
    },

    async findAll(req, res) {
        const subs = await Sub.paginate({ req });

        if (!subs) return res.status(404).send({ message: 'No sub has been created yet' });

        return res.status(200).send(subs);
    },

    async create(req, res) {
        const { name, title, description } = req.body;

        const { user } = res.locals;

        const sub = await Sub.create({
            name,
            description,
            title,
            user,
        });
        return res.status(201).send(sub);
    },

    async update(req, res, next) {},

    async remove(req, res, next) {},
};
