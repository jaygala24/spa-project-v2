import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

// Reads the variables from the env file
config({ path: 'src/config/config.env' });

/**
 * Handles the error
 * @param {Object} err - ErrorHandler Object
 * @param {Object} res - Response Object
 * @return A response with status code and json data
 */
export const handleError = async (err, res) => {
  const { statusCode, message } = err;
  return res.status(statusCode || 500).json({
    success: false,
    data: {},
    error: {
      msg: message || 'Something went wrong. Please try again!',
    },
  });
};

/**
 * Generates the hash password from the plain password
 * @param {String} plainPassword - Plain password to be hash
 * @return A promise to be either resolved with the hash password or rejected with an error
 */
export const genHashPassword = plainPassword => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(plainPassword, 10, function(err, hash) {
      if (err) return reject(err);
      resolve(hash);
    });
  });
};

/**
 * Compares the plainPassword and the hashPassword
 * @param {String} plainPassword - Plain password
 * @param {String} hashPassword - Plain password to be hash
 * @return A promise to be either resolved with the match or rejected with an error
 */
export const cmpPassword = (plainPassword, hashPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, hashPassword, function(
      err,
      isMatch,
    ) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

/**
 * Generates the new token with user id as a signature
 * @param  {Object} user - User object for token generation
 * @param {String} user._id - The signature for generating new token
 * @return Returns the jwt token valid within the jwt expiry time
 */
export const newToken = user => {
  return jwt.sign({ id: user._id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXP,
  });
};

/**
 * Verifies the jwt token for authentication purpose
 * @param {String} token - Jwt token
 * @return A promise to be either resolved with the user object as payload or rejected with an error
 */
export const verifyToken = token => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
};
