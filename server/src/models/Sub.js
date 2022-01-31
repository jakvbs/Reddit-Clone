import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { paginate } from '../utils/methods';

const SubSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		imageUrl: {
			type: String,
			default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			autopopulate: true,
		},
		posts: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Post',
				},
			],
			default: [],
		},
		postsCount: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

SubSchema.index({ name: 1 });
SubSchema.plugin(autopopulate);

SubSchema.pre('save', function subPreSave(next) {
	if (this.isModified('posts')) {
		this.postsCount = this.posts.length;
	}

	next();
});

SubSchema.set('toJSON', {
	versionKey: false,
	transform: (_, ret) => {
		ret.id = ret.name;
		delete ret._id;
		delete ret.user;
		delete ret.posts;
	},
});

SubSchema.static('paginate', paginate);

export default mongoose.model('Sub', SubSchema);
