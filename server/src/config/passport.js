import passport from 'passport';
import passportGoogle from 'passport-google-oauth20';
import passportJWT from 'passport-jwt';
import User from '../models/User';
import config from './config';

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
    const jwtConfig = {
        jwtFromRequest: cookieExtractor,
        secretOrKey: config.jwt_secret,
    };
    passport.use(new JWTStrategy(jwtConfig, verifyCallback));

    passport.use(
        new GoogleStrategy(
            {
                clientID: config.google_client_id,
                clientSecret: config.google_client_secret,
                callbackURL: config.google_callback_url,
            },
            async (accessToken, refreshToken, profile, done) => {
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
