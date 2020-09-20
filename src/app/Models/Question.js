import mongoose from 'mongoose';

import OwnerSchema from './Schemas/Owner';

const QuestionSchema = new mongoose.Schema({
  user_id: String,
  is_answered: Boolean,
  question_id: String,
  title: String,
  answer_count: Number,
  score: Number,
  view_count: Number,
  creation_date: Number,
  last_activity_date: Number,
  body: String,
  tags: [String],
  owner: OwnerSchema,
});

export default mongoose.model('Question', QuestionSchema);
