import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  googleId: String,
  twitterId: String,
  facebookId: String,
  username: String,
  uri: String,
});

export default mongoose.model('User', UserSchema);
