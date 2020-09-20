import 'dotenv/config';

import passport from 'passport';
import { Strategy as LinkedinStrategy } from 'passport-linkedin-oauth2';

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
  new LinkedinStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: '/auth/linkedin/redirect',
      scope: ['r_liteprofile'],
    },
    async (accessToken, refreshToken, profile, done) => {
      const currentUser = await User.findOne({
        linkedinId: profile.id,
      });

      if (!currentUser) {
        const newUser = await User.create({
          linkedinId: profile.id,
          username: profile.name,
          uri: profile.profile_image_url,
        });
        if (newUser) {
          done(null, newUser);
        }
      }
      done(null, currentUser);
    }
  )
);
