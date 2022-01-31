import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { paginate, setUserVote, setVoteScore } from '../utils/methods';

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			default: null,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			autopopulate: true,
		},
		sub: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Sub',
			required: true,
			autopopulate: true,
		},
		subname: {
			type: String,
		},
		comments: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Comment',
				},
			],
			default: [],
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
		url: {
			type: String,
		},
		commentCount: {
			type: Number,
			default: 0,
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

PostSchema.index({ user: 1, sub: 1 });
PostSchema.plugin(autopopulate);

PostSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (_, ret) => {
		ret.subname = ret.sub.name;
		delete ret._id;
		delete ret.comments;
		delete ret.votes;
	},
});

PostSchema.pre('save', function postPreSave(next) {
	if (this.isModified('comments')) {
		this.commentCount = this.comments.length;
	}
	if (this.isModified('votes')) {
		this.setVoteScore();
	}
	if (!this.url) {
		this.url = `/r/${this.sub.name}/comments/${this.id}`;
	}
	if (!this.subname) {
		this.subname = this.sub.name;
	}
	this.userVote = 0;

	next();
});

PostSchema.method('setVoteScore', setVoteScore);

PostSchema.method('setUserVote', setUserVote);

PostSchema.static('paginate', paginate);

export default mongoose.model('Post', PostSchema);
