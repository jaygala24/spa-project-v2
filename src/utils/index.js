import bcrypt from 'bcrypt';

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
    error: [
      {
        message: message || 'Something went wrong. Please try again!',
      },
    ],
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
