import { User, Question } from '../models';
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

    // Successfully returns the token as a response along with the user details
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

    // Successfully returns the password generation for starting new test
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
 * Returns the updated user object
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

    // Successfully returns the user object after updating password
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

/**
 * Creates the question in the db
 *
 * Returns the question object
 *
 * Access - Teachers
 */
export const createQuestion = async (req, res, next) => {
  try {
    const {
      type,
      title,
      options,
      correctAnswers,
      tag,
      category,
    } = req.body;

    // Checks if all the fields are provided otherwise throws an error
    if (
      !type ||
      !title ||
      !options ||
      !correctAnswers ||
      !tag ||
      !category
    ) {
      const error = new ErrorHandler(
        400,
        'Please provide all the details for creating questions',
      );
      return handleError(error, res);
    }

    const question = await Question.create({
      type,
      title,
      options,
      correctAnswers,
      tag,
      category,
    });

    // Successfully returns the question object
    return res.status(201).json({
      success: true,
      data: {
        question,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Fetches the questions from the db based on the filter
 *
 * Filter parameters are type and tag
 *
 * Returns the questions, count of questions and tag associated with the questions
 *
 * Access - Teachers
 */
export const getQuestions = async (req, res, next) => {
  try {
    let { type, tag } = req.query;
    console.log({ tag, type });

    // Get the distinct values of tag and type from the questions in the db
    const tags = await Question.distinct('tag');
    const types = await Question.distinct('type');

    // If type not provided then fetches all the types questions
    if (!type) {
      type = types;
    }

    // If tag not provided then fetches all the tags questions
    if (!tag) {
      tag = tags;
    }

    // Fetches all the questions from the db based on filter
    const questions = await Question.find({
      type,
      tag,
    }).exec();

    // Successfully returns the questions, count of questions and tags associated with the questions
    return res.status(200).json({
      success: true,
      data: {
        count: questions.length,
        questions,
        tags,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Fetches the single question from the db
 *
 * Returns the question object
 *
 * Access - Teachers
 */
export const getQuestion = async (req, res, next) => {
  try {
    // Extract the parameter id from the route
    const { id } = req.params;

    // Fetch the single question from db using question id
    const question = await Question.findById(id).exec();

    // Question not found in the db
    if (!question) {
      const error = new ErrorHandler(
        400,
        'Please provide a valid question id',
      );
      return handleError(error, res);
    }

    // Successfully returns the single question
    return res.status(200).json({
      success: true,
      data: {
        question,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Updates the single question in the db using question id as a parameter
 *
 * Returns the updated question object
 *
 * Access - Teachers
 */
export const updateQuestion = async (req, res, next) => {
  try {
    // Extract the parameter id from the route
    const { id } = req.params;

    const {
      type,
      title,
      options,
      correctAnswers,
      tag,
      category,
    } = req.body;

    // Checks if all the fields are provided otherwise throws an error
    if (
      !type ||
      !title ||
      !options ||
      !correctAnswers ||
      !tag ||
      !category
    ) {
      const error = new ErrorHandler(
        400,
        'Please provide all the details for creating questions',
      );
      return handleError(error, res);
    }

    // Fetch the single question from db using question id
    const _question = await Question.findById(id).exec();

    // Question not found in the db
    if (!_question) {
      const error = new ErrorHandler(
        400,
        'Please provide a valid question id',
      );
      return handleError(error, res);
    }

    // Updates the question in the db
    const question = await Question.findByIdAndUpdate(
      id,
      {
        type,
        title,
        options,
        correctAnswers,
        tag,
        category,
      },
      { new: true },
    );

    // Successfully returns the single question after updating the details
    return res.status(200).json({
      success: true,
      data: {
        question,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Delete the single question in the db using question id as a parameter
 *
 * Returns the object with success field
 *
 * Access - Teachers
 */
export const deleteQuestion = async (req, res, next) => {
  try {
    // Extract the parameter id from the route
    const { id } = req.params;

    // Fetch the single question from db using question id
    const _question = await Question.findById(id).exec();

    // Question not found in the db
    if (!_question) {
      const error = new ErrorHandler(
        400,
        'Please provide a valid question id',
      );
      return handleError(error, res);
    }

    // Removes the question from the db
    await Question.findByIdAndRemove(id);

    // Successfully returns the object with success fields
    return res.status(200).json({
      success: true,
      data: {
        msg: 'Question successfully deleted',
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};
