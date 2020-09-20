import 'dotenv/config';

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';

import User from '../../app/Models/User';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((e) => {
      done(new Error(`Failed to deserialize an user. Error: ${e}`));
    });
});

export default passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/redirect',
    },
    async (accessToken, refreshToken, profile, done) => {
      const currentUser = await User.findOne({
        googleId: profile.id,
      });

      if (!currentUser) {
        const newUser = await User.create({
          googleId: profile.id,
          username: profile.displayName,
          uri: profile.picture,
        });
        if (newUser) {
          done(null, newUser);
        }
      }
      done(null, currentUser);
    }
  )
);
