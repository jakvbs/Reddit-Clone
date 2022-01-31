import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
	{
		username: String,
		email: String,
		password: String,
		imageUrl: {
			type: String,
			default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		googleId: String,
		thumbnail: String,
	},
	{
		timestamps: true,
	}
);

UserSchema.index({ googleId: 1 });

UserSchema.set('toJSON', {
	virtuals: true,
	versionKey: false,
	transform: (_, ret) => {
		delete ret._id;
		delete ret.password;
	},
});

UserSchema.pre('save', async function userPreSave(next) {
	if (this.isModified('password')) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}

	next();
});

UserSchema.method('comparePassword', async function comparePassword(candidatePassword) {
	const isMatch = await bcrypt.compare(candidatePassword, this.password);
	return isMatch;
});

export default mongoose.model('User', UserSchema);
