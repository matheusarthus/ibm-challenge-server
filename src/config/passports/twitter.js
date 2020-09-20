import 'dotenv/config';

import passport from 'passport';
import { Strategy as TwitterStrategy } from 'passport-twitter';

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
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: '/auth/twitter/redirect',
    },
    async (accessToken, refreshToken, profile, done) => {
      const currentUser = await User.findOne({
        twitterId: profile.id,
      });

      if (!currentUser) {
        const newUser = await User.create({
          twitterId: profile.id,
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
