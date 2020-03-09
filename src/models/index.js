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
  batch: {
    type: Number,
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

QuestionSchema.pre('save', function(next) {
  if (this.type === 'Code') {
    this.options = undefined;
    this.correctAnswers = undefined;
  }
  return next();
});

const PaperSchema = new Schema({
  set: {
    type: String,
    required: true,
    unique: [true, 'Set name must be unique'],
  },
  type: {
    type: String,
    enum: ['TT1', 'TT2', 'Sem'],
    required: true,
  },
  // time is in seconds
  time: {
    type: Number,
    required: true,
  },
  mcq: [
    {
      _id: false,
      questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
      marks: Number,
    },
  ],
  code: [
    {
      _id: false,
      questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
      },
      marks: Number,
    },
  ],
  year: {
    type: Number,
    required: true,
  },
});

export const User = mongoose.model('User', UserSchema);
export const Question = mongoose.model('Question', QuestionSchema);
export const Paper = mongoose.model('Paper', PaperSchema);
