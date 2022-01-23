import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
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

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.method('comparePassword', async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
});

export default mongoose.model('User', UserSchema);
