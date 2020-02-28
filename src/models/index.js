// Schema for models
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Dummy model
const UserSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

export const User = mongoose.model('User', UserSchema);
