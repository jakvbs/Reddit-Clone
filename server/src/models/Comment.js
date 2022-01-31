import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { setUserVote, setVoteScore } from '../utils/methods';

const CommentSchema = mongoose.Schema(
	{
		body: {
			type: String,
			required: true,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			autopopulate: true,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
			required: false,
			autopopulate: true,
		},
		votes: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Vote',
				},
			],
			default: [],
			autopopulate: true,
		},
		voteScore: {
			type: Number,
			default: 0,
		},
		userVote: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

CommentSchema.index({ user: 1, post: 1 });
CommentSchema.plugin(autopopulate);

CommentSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (_, ret) => {
		delete ret._id;
		delete ret.votes;
	},
});

CommentSchema.pre('save', function commentPreSave(next) {
	if (this.isModified('votes')) {
		this.setVoteScore();
	}
	this.userVote = 0;

	next();
});

CommentSchema.method('setVoteScore', setVoteScore);

CommentSchema.method('setUserVote', setUserVote);

export default mongoose.model('Comment', CommentSchema);
