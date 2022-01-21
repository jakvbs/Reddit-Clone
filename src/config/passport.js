import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import passportJWT from 'passport-jwt';
import User from '../models/User';

const JWTStrategy = passportJWT.Strategy;
const GoogleStrategy = passportGoogle.Strategy;

function verifyCallback(payload, done) {
    return User.findById(payload.id)
        .then((user) => done(null, user))
        .catch((err) => done(err));
}

const cookieExtractor = (req) => {
    let jwt = null;

    if (req && req.cookies) {
        jwt = req.cookies.token;
    }

    return jwt;
};

export default () => {
    const config = {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET,
    };
    passport.use(new JWTStrategy(config, verifyCallback));

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/api/auth/google/redirect',
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log('xxxxxxxx');
                console.log(profile);
                console.log('xxxxxxxx');
                // check if user already exists in our own db
                const currentUser = await User.findOne({ googleId: profile.id });
                if (currentUser) {
                    // already have this user
                    console.log('user is: ', currentUser);
                    done(null, currentUser);
                    return;
                }
                // if not, create user in our db
                const newUser = new User({
                    username: profile.displayName,
                    // email = id because google doesn't provide email
                    email: profile.id,
                    googleId: profile.id,
                    thumbnail: profile._json.image?.url,
                });
                await newUser.save();
                console.log('created new user: ', newUser);
                done(null, newUser);
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            done(null, user);
        });
    });
};
