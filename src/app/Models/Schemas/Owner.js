import mongoose from 'mongoose';

const OwnerSchema = new mongoose.Schema({
  profile_image: String,
  display_name: String,
  reputation: Number,
});

export default OwnerSchema;
