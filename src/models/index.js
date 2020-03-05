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
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'],
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

export const User = mongoose.model('User', UserSchema);
