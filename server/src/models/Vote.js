import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
    value: {
        type: Number,
        required: [true, 'Please provide value'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide userId'],
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: false,
    },
});

VoteSchema.index({ user: 1, post: 1, comment: 1 });

VoteSchema.set('toJSON', {
    versionKey: false,
    transform: (_, ret) => {
        delete ret._id;
        delete ret.post;
        delete ret.comment;
    },
});

export default mongoose.model('Vote', VoteSchema);
