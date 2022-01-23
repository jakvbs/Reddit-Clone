import crypto from 'crypto';
import dotenv from 'dotenv';
import { LoremIpsum } from 'lorem-ipsum';
import mongoose from 'mongoose';
import dbConfig from '../config/database';
import Comment from '../models/Comment';
import Post from '../models/Post';
import Sub from '../models/Sub';
import User from '../models/User';
import Vote from '../models/Vote';

dotenv.config();

function dateMinus(duration = 0) {
    const time = new Date().getTime();

    return new Date(time - duration).toISOString();
}

const lorem = new LoremIpsum({
    wordsPerSentence: {
        max: 32,
        min: 2,
    },
    sentencesPerParagraph: {
        max: 8,
        min: 2,
    },
});

const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;

const userCount = 50;
const postCount = 100;
const commentCount = 200;

(async () => {
    mongoose.connect(process.env.MONGODB_URI, dbConfig.settings);
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connection open');
    });
    mongoose.connection.on('error', (err) => {
        console.error(`MongoDB connection error: ${err}`);
        process.exit();
    });

    const [, , jack, brad] = await User.create([
        {
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin',
            isAdmin: true,
        },
        {
            username: 'kuba',
            email: 'kuba@example.com',
            password: 'password',
        },
        {
            username: 'jack',
            email: 'jack@example.com',
            password: crypto.randomBytes(16).toString('hex'),
            createdAt: dateMinus(day * 5),
        },
        {
            username: 'brad',
            email: 'brad@example.com',
            password: crypto.randomBytes(16).toString('hex'),
            createdAt: dateMinus(day * 10),
        },
    ]);

    const users = [];
    for (let i = 0; i < userCount; i++) {
        users.push(
            new User({
                username: `user${i}`,
                email: `user${i}@example.com`,
                password: crypto.randomBytes(16).toString('hex'),
                createdAt: dateMinus(day * (i + 1)),
            })
        );
    }

    await Promise.all(users.map((user) => user.save()));
    users.unshift(jack);
    users.unshift(brad);

    console.log('Users created');

    await Sub.create([
        {
            name: 'javascript',
            title: 'JavaScript Community',
            description: 'The JavaScript community forum. Discuss your favorite JavaScript topics here.',
            user: jack,
            createdAt: dateMinus(day * 5),
        },
        {
            name: 'running',
            title: 'Running Community',
            description: 'The running community for people who love running',
            user: brad,
            createdAt: dateMinus(day * 10),
        },
        {
            name: 'fitness',
            title: 'Fitness Community',
            description: 'The fitness community where you can find the best trainers',
            user: jack,
            createdAt: dateMinus(day * 15),
        },
        {
            name: 'cooking',
            title: 'Cooking Community',
            description: 'The cooking community, where you can find recipes and share your own',
            user: jack,
            createdAt: dateMinus(day * 20),
        },
        {
            name: 'fishing',
            title: 'Fishing Community',
            description: 'The fishing community, where you can find fishing spots',
            user: brad,
            createdAt: dateMinus(day * 25),
        },
        {
            name: 'the-simpsons',
            title: 'The Simpsons',
            description: 'The Simpsons is a great place to discuss all things The Simpsons',
            user: brad,
            createdAt: dateMinus(day * 30),
        },
    ]);

    console.log('Subs created');

    const javascript = await Sub.findOne({ name: 'javascript' });
    const running = await Sub.findOne({ name: 'running' });
    const fitness = await Sub.findOne({ name: 'fitness' });
    const cooking = await Sub.findOne({ name: 'cooking' });
    const fishing = await Sub.findOne({ name: 'fishing' });
    const simpsons = await Sub.findOne({ name: 'the-simpsons' });

    const subs = [javascript, running, fitness, cooking, fishing, simpsons];
    const posts = [];
    for (let i = 0; i < postCount; i++) {
        posts.push(
            new Post({
                title: lorem.generateWords(5),
                body: lorem.generateSentences(5),
                user: users[Math.floor(Math.random() * users.length)],
                sub: subs[Math.floor(Math.random() * subs.length)],
                createdAt: dateMinus(Math.floor(Math.random() * day * 30)),
            })
        );
    }

    posts.forEach((post) => post.sub.posts.push(post));

    await Promise.all(posts.map((post) => post.save()));
    await Promise.all(subs.map((sub) => sub.save()));

    console.log('Posts created');

    const comments = [];
    for (let i = 0; i < commentCount; i++) {
        comments.push(
            new Comment({
                body: lorem.generateSentences(5),
                post: posts[Math.floor(Math.random() * posts.length)],
                user: users[Math.floor(Math.random() * users.length)],
                createdAt: dateMinus(Math.floor(Math.random() * day * 30)),
            })
        );
    }

    comments.forEach((comment) => comment.post.comments.push(comment));

    await Promise.all(comments.map((comment) => comment.save()));
    await Promise.all(posts.map((post) => post.save()));

    console.log('Comments created');

    const votes = [];
    for (let i = 0; i < 50; i++) {
        for (let j = 0; j < users.length; j++) {
            votes.push(
                new Vote({
                    value: [-1, 1][Math.floor(Math.random() * 2)],
                    user: users[j],
                    post: posts[Math.floor(Math.random() * posts.length)],
                })
            );
        }
    }

    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < users.length; j++) {
            votes.push(
                new Vote({
                    value: [-1, 1][Math.floor(Math.random() * 2)],
                    user: users[j],
                    comment: comments[Math.floor(Math.random() * comments.length)],
                })
            );
        }
    }

    votes.forEach((vote) => {
        if (vote.post) {
            vote.post.votes.push(vote);
        } else {
            vote.comment.votes.push(vote);
        }
    });

    await Promise.all(votes.map((vote) => vote.save()));
    await Promise.all(posts.map((post) => post.save()));
    await Promise.all(comments.map((comment) => comment.save()));

    console.log('Votes created');

    mongoose.disconnect();
})();
