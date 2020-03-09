import { User } from '../models';
import {
  handleError,
  cmpPassword,
  genHashPassword,
  newToken,
} from '../utils';
import ErrorHandler from '../utils/error';

/**
 * login controller for the teachers and students
 *
 * Returns the token if provided a valid sapId and valid password otherwise throws an error
 *
 * Access - Teachers and Students
 */
export const login = async (req, res, next) => {
  try {
    const { sapId, password } = req.body;
    let error;

    const user = await User.findOne({ sapId });

    // User not found in the db
    if (!user) {
      error = new ErrorHandler(403, 'Please provide a valid SapId');
      return handleError(error, res);
    }

    const match = await cmpPassword(password, user.password);

    // Password provided does not match the password in the db
    if (!match) {
      error = new ErrorHandler(
        403,
        'Please provide a valid password',
      );
      return handleError(error, res);
    }

    const token = newToken(user);

    // Successful token generation and returns the token as a response along with the user details
    res.status(200).json({
      success: true,
      data: {
        token: `Bearer ${token}`,
        user: { ...user._doc, password: undefined },
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Generates the random password consisting of lowercase alphabets and numbers for students
 *
 * Returns the new random generated password for the students
 *
 * Access - Teachers (Admin)
 */
export const generatePasswordForStudents = async (req, res, next) => {
  try {
    // Generates the random password consisting of lowercase alphabets and numbers
    const randomString = Math.random()
      .toString(36)
      .substr(2, 8);

    const hashPassword = await genHashPassword(randomString);

    // Updates the password for all the students
    await User.updateMany(
      { type: 'Student' },
      { $set: { password: hashPassword } },
      { upsert: false, multi: true },
    );

    // Successful password generation for starting new test
    return res.status(200).json({
      success: true,
      data: {
        password: randomString,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Updates the password for a teacher
 *
 * Returns the user object after updating the password
 *
 * Access - Teachers
 */
export const updateTeacherPassword = async (req, res, next) => {
  try {
    const { password: plainPassword } = req.body;
    const { sapId } = req.user;

    if (!plainPassword) {
      const error = new ErrorHandler(
        400,
        'Please provide a new password',
      );
      return handleError(error, res);
    }

    // Generate the hashed password from plain password
    const password = await genHashPassword(plainPassword);

    // Updating the user password
    const user = await User.findOneAndUpdate(
      { sapId },
      {
        password,
        modifyPassword: true,
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      data: {
        user: { ...user._doc, password: undefined },
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};
