import { User, Question, Paper } from '../models';
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

export const getTags = async (req, res, next) => {
  try {
    const tags = await Question.distinct('tag');

    return res.status(200).json({
      success: true,
      data: {
        count: tags.length,
        tags,
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
    let { type: typeQuery, tag: tagQuery } = req.query;

    // Get the distinct values of tag and type from the questions in the db
    const tags = await Question.distinct('tag');
    const types = await Question.distinct('type');

    // If type not provided then fetches all the types questions
    if (!typeQuery) {
      typeQuery = types;
    }

    // If tag not provided then fetches all the tags questions
    if (!tagQuery) {
      tagQuery = tags;
    }

    // Fetches all the questions from the db based on filter
    const questions = await Question.find({
      type: typeQuery,
      tag: tagQuery,
    }).exec();

    for (let i = 0; i < questions.length; i++) {
      if (questions[i]['type'] === 'Code') {
        questions[i]['options'] = undefined;
        questions[i]['correctAnswers'] = undefined;
      }
    }

    // Successfully returns the questions, count of questions and tags associated with the questions
    return res.status(200).json({
      success: true,
      data: {
        tags,
        types,
        count: questions.length,
        questions,
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

/**
 * Create a single paper in the db
 *
 * Returns the created paper along with the acknowledgement
 *
 * Access - Teachers
 */
export const createPaper = async (req, res, next) => {
  try {
    // Extract all the fields from the body
    const { set, type, time, mcq, code, year } = req.body;

    // Checks if all the fields are provided otherwise returns error
    if (!set || !type || !time || !mcq || !code || !year) {
      const error = new ErrorHandler(
        400,
        'Please provide all the details for creating paper',
      );
      return handleError(error, res);
    }

    // Creates the paper object
    const paper = await Paper.create({
      set,
      type,
      time,
      mcq,
      code,
      year,
    });

    // Successfully returns the created paper object along with acknowledgement
    return res.status(201).json({
      success: true,
      data: {
        paper,
        msg: 'Paper successfully created',
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Fetch the papers from the db based on query filters
 *
 * Filter parameters are type and year
 *
 * Returns the year, type and papers
 *
 * Access - Teachers
 */
export const getPapers = async (req, res, next) => {
  try {
    // Extract the query parameters
    let { type: typeQuery, year: yearQuery } = req.query;

    // Get the distinct year and type values from Paper Model
    const years = await Paper.distinct('year');
    const types = await Paper.distinct('type');

    // If value not provided then assign the distinct values for fetching all the papers
    if (!typeQuery) {
      typeQuery = types;
    }
    if (!yearQuery) {
      yearQuery = years;
    }

    // Fetch the papers from the db based on filter
    const papers = await Paper.find(
      { type: typeQuery, year: yearQuery },
      { set: 1, time: 1, type: 1, year: 1 },
    ).exec();

    // Successfully returns the year, type and papers
    return res.status(200).json({
      success: true,
      data: {
        years,
        types,
        papers,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Fetch the single paper from the db using paper id
 *
 * Returns paper object
 *
 * Access - Teachers
 */
export const getPaper = async (req, res, next) => {
  try {
    // Extract the parameter id from the route
    const { id } = req.params;

    // Fetch the single paper from db using paper id
    const paper = await Paper.findById(id)
      .populate('mcq.questionId')
      .populate('code.questionId')
      .exec();

    // Paper not found in the db
    if (!paper) {
      const error = new ErrorHandler(
        400,
        'Please provide a valid paper id',
      );
      return handleError(error, res);
    }

    let mcqMarks = 0,
      codeMarks = 0,
      totalMarks = 0,
      mcq = [],
      code = [];

    // Calculating the total marks
    for (let i = 0; i < paper['mcq'].length; i++) {
      mcqMarks += paper['mcq'][i]['marks'];
    }

    for (let i = 0; i < paper['code'].length; i++) {
      codeMarks += paper['code'][i]['marks'];
    }

    totalMarks = mcqMarks + codeMarks;

    for (let i = 0; i < paper['mcq'].length; i++) {
      mcq.push(paper['mcq'][i]['questionId']);
    }

    for (let i = 0; i < paper['code'].length; i++) {
      code.push({
        ...paper['code'][i]['questionId']._doc,
        options: undefined,
        correctAnswers: undefined,
      });
    }

    // Successfully returns the single paper
    return res.status(200).json({
      success: true,
      data: {
        paper: {
          ...paper._doc,
          mcq,
          code,
          mcqMarks,
          codeMarks,
          totalMarks,
        },
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Updates the single paper from the db using paper id
 *
 * Returns updated paper object
 *
 * Access - Teachers
 */
export const updatePaper = async (req, res, next) => {
  try {
    // Extract the parameter id from the route
    const { id } = req.params;

    // Extract all the fields from the body
    const { set, type, time, mcq, code, year } = req.body;

    // Fetch the single paper from db using paper id
    const _paper = await Paper.findById(id).exec();

    // Paper not found in the db
    if (!_paper) {
      const error = new ErrorHandler(
        400,
        'Please provide a valid paper id',
      );
      return handleError(error, res);
    }

    // Update the paper marks
    const paper = await Paper.findByIdAndUpdate(
      id,
      { set, type, time, mcq, code, year },
      { new: true },
    );

    // Successfully returns the updated paper object with acknowledgement
    return res.status(200).json({
      success: true,
      data: {
        paper,
        msg: 'Paper updated successfully',
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Deletes the single paper from the db using paper id
 *
 * Returns the acknowledgement after deleting paper
 *
 * Access - Teachers
 */
export const deletePaper = async (req, res, next) => {
  try {
    // Extract the parameter id from the route
    const { id } = req.params;

    // Fetch the single paper from db using paper id
    const _paper = await Paper.findById(id).exec();

    // Paper not found in the db
    if (!_paper) {
      const error = new ErrorHandler(
        400,
        'Please provide a valid paper id',
      );
      return handleError(error, res);
    }

    await Paper.findByIdAndRemove(req.params.id);
    return res.status(200).json({
      success: true,
      data: {
        msg: 'Paper successfully deleted',
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Creates the student user
 *
 * Returns the acknowledgement after creating student user
 *
 * Access - Teachers
 */
export const createStudentUser = async (req, res, next) => {
  try {
    const { sapId, div, year: batch } = req.body;

    if (!sapId || !div || !batch) {
      const error = new ErrorHandler(
        400,
        'Please provide all the details for creating student user',
      );
      return handleError(error, res);
    }

    const _user = await User.findOne({
      sapId,
      type: 'Student',
    }).exec();

    // User found in the db
    if (_user) {
      const error = new ErrorHandler(400, 'User already exists');
      return handleError(error, res);
    }

    // Using same password as of other students
    const _userObj = await User.findOne(
      {},
      { password: 1, _id: 0 },
    ).exec();

    // Creating the user in the db
    const user = await User.create({
      sapId,
      password: _userObj.password,
      div,
      batch,
      type: 'Student',
    });

    // Internal server error
    if (!user) {
      const error = new ErrorHandler(
        500,
        'User creation failed! Please try again',
      );
      return handleError(error, res);
    }

    // Acknowledgement msg
    return res.status(200).json({
      success: true,
      data: {
        msg: `User successfully created with sapId: ${sapId} and division: ${div}`,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Creates the teacher user
 *
 * Returns the acknowledgement after creating teacher user
 *
 * Access - Teachers
 */
export const createTeacherUser = async (req, res, next) => {
  try {
    const { sapId, password: plainPassword } = req.body;

    if (!sapId || !plainPassword) {
      const error = new ErrorHandler(
        400,
        'Please provide all the details for creating teacher user',
      );
      return handleError(error, res);
    }

    // Generate the hash of plain password
    const hashPassword = await genHashPassword(plainPassword);

    const _user = await User.findOne({
      sapId,
      type: 'Teacher',
    }).exec();

    // User found in the db
    if (_user) {
      const error = new ErrorHandler(400, 'User already exists');
      return handleError(error, res);
    }

    // Create the user in the db
    const user = await User.create({
      sapId,
      password: hashPassword,
      type: 'Teacher',
    });

    // Internal Server Error
    if (!user) {
      const error = new ErrorHandler(
        500,
        'Teacher creation failed! Please try again',
      );
      return handleError(error, res);
    }

    return res.status(200).json({
      success: true,
      data: {
        msg: `Teacher successfully created with sapId: ${sapId}`,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Resets the student login
 *
 * Returns the acknowledgement after resetting student login
 *
 * Access - Teachers
 */
export const resetStudentLogin = async (req, res, next) => {
  try {
    const { sapId } = req.query;
    let msg;

    if (sapId !== undefined) {
      // Reset individual student login
      const _student = await User.findOneAndUpdate(
        { sapId },
        { loggedIn: false },
      );
      msg = `Student login reset of SAP ID: ${sapId}`;
    } else {
      // Reset all student login
      const _student = await User.updateMany(
        { loggedIn: true },
        { loggedIn: false },
      );
      msg = `All students login reset`;
    }

    return res.status(200).json({
      success: true,
      data: {
        msg,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Get all logged in students
 *
 * Returns the list of sapId of students logged in
 *
 * Access - Teachers
 */
export const getLoggedInStudents = async (req, res, next) => {
  try {
    // find loggedIn students
    const students = await User.find(
      { type: 'Student', loggedIn: true },
      { sapId: 1, _id: 0 },
    ).sort('sapId');

    // Acknowledgement of list of students
    return res.status(200).json({
      success: true,
      data: {
        count: students.length,
        students,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};
