// Schema for models
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  type: {
    type: String,
    enum: ['Student', 'Teacher'],
  },
  sapId: {
    type: String,
    required: true,
  },
  div: {
    type: String,
    enum: [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'Others',
    ],
  },
  email: {
    type: String,
  },
  admin: {
    type: Boolean,
  },
  loggedIn: {
    type: Boolean,
  },
  password: {
    type: String,
  },
});

UserSchema.pre('save', function(next) {
  if (this.type !== 'Teacher') {
    this.loggedIn = false;
    return next();
  }
  return next();
});

const QuestionSchema = new Schema({
  type: {
    type: String,
    enum: ['Single', 'Multiple', 'Code'],
  },
  title: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
    },
  ],
  correctAnswers: [
    {
      type: String,
    },
  ],
  tag: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['E', 'M', 'H'],
    required: true,
  },
});

export const User = mongoose.model('User', UserSchema);
export const Question = mongoose.model('Question', QuestionSchema);
