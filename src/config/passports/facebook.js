import 'dotenv/config';

import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

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
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/redirect',
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const currentUser = await User.findOne({
        facebookId: profile.id,
      });

      if (!currentUser) {
        const newUser = await User.create({
          facebookId: profile.id,
          username: profile.displayName,
          uri: profile.photos[0].value,
        });
        if (newUser) {
          done(null, newUser);
        }
      }
      done(null, currentUser);
    }
  )
);
