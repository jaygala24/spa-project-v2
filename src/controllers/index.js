import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import puppeteer from 'puppeteer';
import { Workbook } from 'exceljs';
import { User, Question, Paper, SelectedAnswer } from '../models';
import { getSocket } from '../utils/websocketMap';
import {
  handleError,
  cmpPassword,
  genHashPassword,
  newToken,
} from '../utils';
import getPythonPath from '../utils/python';
import axios from 'axios'
import ErrorHandler from '../utils/error';
import { reportCardTemplate } from '../utils/reportCardTemplate';

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

    if (user['type'] === 'Student') {
      // If student already loggedIn then throw error
      if (user['loggedIn']) {
        const error = new ErrorHandler(401, 'User Already Logged In');
        return handleError(error, res);
      }

      // If student logins first time then update the loggedIn as true
      const _user = await User.findOneAndUpdate(
        { sapId },
        { loggedIn: true },
      );
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
 * Get the tags from the db
 *
 * Returns the list of the tags
 *
 * Access - Teachers
 */
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
    const error = new ErrorHandler(
      400,
      'Please provide all the details for creating questions',
    );

    if (!type || !title || !tag || !category) {
      return handleError(error, res);
    } else if (type === 'Single' && (!correctAnswers || !options)) {
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

    const _paper = await Paper.findOne({ set }).exec();

    if (_paper) {
      const error = new ErrorHandler(
        400,
        'Set name already exists. Please provide a new set name.',
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
      mcq.push({
        ...paper['mcq'][i]['questionId']._doc,
        marks: paper['mcq'][i]['marks'],
      });
    }

    for (let i = 0; i < paper['code'].length; i++) {
      code.push({
        ...paper['code'][i]['questionId']._doc,
        marks: paper['code'][i]['marks'],
        options: undefined,
        correctAnswers: undefined,
      });
    }

    // Successfully returns the single paper
    return res.status(200).json({
      success: true,
      data: {
        count: {
          mcq: mcq.length,
          code: code.length,
        },
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

/**
 * Get all set names for the current year
 *
 * Returns the list of set name and id for current year
 *
 * Access - Students
 */
export const getAllSets = async (req, res, next) => {
  try {
    const year = new Date().getFullYear();

    const _papers = await Paper.find(
      { year },
      { set: 1, _id: 1 },
    ).sort('set');

    const sets = [];

    for (let i = 0; i < _papers.length; i++) {
      sets.push({ set: _papers[i]['set'], id: _papers[i]['_id'] });
    }

    return res.status(200).json({
      success: true,
      data: {
        sets,
      },
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Creates the answer object for the student in the database
 *
 * Returns the acknowledgement along with the paperId
 *
 * Access - Students
 */
export const createAnswerObjForStudents = async (req, res, next) => {
  try {
    // Get the current date
    const date = new Date().toISOString().slice(0, 10);
    const { paperId } = req.body;

    // Find paper in the db using paperId
    const paper = await Paper.findById(paperId).exec();

    // Paper does not exist in the db so throw error
    if (!paper) {
      const error = new ErrorHandler(400, 'Paper does not exists');
      return handleError(error, res);
    }

    // Find the selected answer of current date and logged in user
    const _selectedAnswer = await SelectedAnswer.findOne({
      studentId: req.user._id,
      date,
    });

    // If selected answer exists and its paperId matches the paperId extracted
    // from body then return the response without doing anything
    if (_selectedAnswer && _selectedAnswer['paperId'] == paperId) {
      return res.status(200).json({
        success: true,
        data: {
          msg: `Created answers already exists for student: ${req.user.sapId}`,
          paperId,
        },
        error: {},
      });
    }

    // If selected answer's paperId matches the paperId extracted from body then
    // remove the selected answer and create a new selected answer
    if (_selectedAnswer) {
      await _selectedAnswer.remove();
    }

    const mcq = [],
      code = [];
    let mcqTotalMarks = 0,
      codeTotalMarks = 0;

    // Creating the mcq object as per the format required for the db
    for (let i = 0; i < paper['mcq'].length; i++) {
      mcq.push({
        questionId: paper['mcq'][i]['questionId'],
        optionsSelected: ' ',
        marks: 0,
      });
      mcqTotalMarks += paper['mcq'][i]['marks'];
    }

    // Creating the code object as per the format required for the db
    for (let i = 0; i < paper['code'].length; i++) {
      code.push({
        questionId: paper['code'][i]['questionId'],
        program: ' ',
        output: ' ',
        marks: 0,
      });
      codeTotalMarks += paper['code'][i]['marks'];
    }

    await SelectedAnswer.create({
      studentId: req.user._id,
      paperId,
      currentSection: 'MCQ',
      time: paper['time'],
      mcq,
      mcqMarksObtained: 0,
      mcqTotalMarks,
      code,
      codeMarksObtained: 0,
      codeTotalMarks,
      print: false,
      date,
    });

    return res.status(201).json({
      success: true,
      data: {
        msg: `Successfully created answers for student: ${req.user.sapId}`,
        paperId,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Get the questions for students based on the paperId and current section
 *
 * Returns the questions along with paper and submittedAnswers
 *
 * Access - Students
 */
export const getQuestionsForStudents = async (req, res) => {
  try {
    const { paperId } = req.query;
    const date = new Date().toISOString().slice(0, 10);

    // Find the paperObj in the db using paperId
    const paperObj = await Paper.findById(paperId)
      .populate('mcq.questionId', {
        correctAnswers: 0,
        tag: 0,
        category: 0,
      })
      .populate('code.questionId', {
        options: 0,
        correctAnswers: 0,
        tag: 0,
        category: 0,
      })
      .exec();

    const paper = {
      _id: paperObj['_id'],
      set: paperObj['set'],
      mcq: [],
      code: [],
    };

    // Selected answer object from db using  studentId, paperId and date
    const selectedAnswer = await SelectedAnswer.findOne(
      {
        studentId: req.user._id,
        paperId,
        date,
      },
      {
        currentSection: 1,
        time: 1,
        mcq: 1,
        code: 1,
      },
    ).exec();

    // Test already submitted
    if (selectedAnswer['currentSection'] === 'None') {
      const error = new ErrorHandler(400, 'Test already submitted!');
      return handleError(error, res);
    } else if (selectedAnswer['currentSection'] === 'MCQ') {
      for (let ind = 0; ind < paperObj['mcq'].length; ind++) {
        paper['mcq'].push({
          ...paperObj['mcq'][ind]['questionId']._doc,
          marks: paperObj['mcq'][ind]['marks'],
        });
      }
    } else {
      for (let ind = 0; ind < paperObj['code'].length; ind++) {
        paper['code'].push({
          ...paperObj['code'][ind]['questionId']._doc,
          marks: paperObj['code'][ind]['marks'],
        });
      }
    }

    // Extract field values
    const extractFieldValue = (id, obj, field) => {
      let value;
      for (let i = 0; i < obj.length; i++) {
        if (String(id) === String(obj[i]['questionId'])) {
          value = obj[i][field];
          break;
        }
      }
      return value;
    };

    let responses = [];

    if (selectedAnswer['currentSection'] === 'MCQ') {
      // MCQ section
      for (let i = 0; i < paper['mcq'].length; i++) {
        responses.push(
          extractFieldValue(
            paper['mcq'][i]['_id'],
            selectedAnswer['mcq'],
            'optionsSelected',
          ),
        );
      }
    } else {
      // MCQ section
      for (let i = 0; i < paper['code'].length; i++) {
        responses.push(
          extractFieldValue(
            paper['code'][i]['_id'],
            selectedAnswer['code'],
            'program',
          ),
        );
      }
    }

    // submittedAnswer as per the students current section
    let submittedAnswers =
      selectedAnswer['currentSection'] === 'MCQ'
        ? {
          ...selectedAnswer._doc,
          mcq: undefined,
          code: undefined,
          responses,
        }
        : {
          ...selectedAnswer._doc,
          mcq: undefined,
          code: undefined,
          responses,
        };

    return res.status(200).json({
      success: true,
      data: {
        count: {
          mcq: paper['mcq'].length,
          code: paper['code'].length,
        },
        paper,
        submittedAnswers,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Evaluates the individual MCQ question
 *
 * Returns the submittedAnswers of logged in student
 *
 * Access - Students
 */
export const evaluateMCQQuestion = async (req, res, next) => {
  try {
    const {
      paperId,
      questionId,
      optionsSelected,
      time,
      currentSection,
    } = req.body;
    const date = new Date().toISOString().slice(0, 10);
    let marks = 0,
      mcqMarksObtained = 0;

    // Find the paper in the db using the paperId
    const paperObj = await Paper.findOne(
      {
        _id: paperId,
        'mcq.questionId': questionId,
      },
      { set: 1, mcq: 1 },
    )
      .populate('mcq.questionId', {
        _id: 1,
        correctAnswers: 1,
        marks: 1,
      })
      .exec();

    // Evaluate the question based on the question id
    for (let i = 0; i < paperObj['mcq'].length; i++) {
      if (
        paperObj['mcq'][i]['questionId']['_id'] == questionId &&
        paperObj['mcq'][i]['questionId']['correctAnswers'].includes(
          optionsSelected,
        )
      ) {
        marks = paperObj['mcq'][i]['marks'];
        break;
      }
    }

    // Find the selected answer of student
    const _submittedAnswer = await SelectedAnswer.findOne({
      studentId: req.user._id,
      paperId,
      date,
    });

    const mcq = [];

    // Creating mcq object as per the format for saving in db
    for (let i = 0; i < _submittedAnswer['mcq'].length; i++) {
      if (_submittedAnswer['mcq'][i]['questionId'] == questionId) {
        mcq.push({
          questionId,
          optionsSelected,
          marks,
        });
      } else {
        mcq.push(_submittedAnswer['mcq'][i]);
      }
      mcqMarksObtained += mcq[i]['marks'];
    }

    // Updating the selected answers of student
    const submittedAnswer = await SelectedAnswer.findOneAndUpdate(
      {
        studentId: req.user._id,
        paperId,
        date,
      },
      {
        mcq,
        mcqMarksObtained,
        time,
        currentSection,
      },
      { new: true },
    );

    // returning the selected answer of student
    return res.status(200).json({
      success: true,
      data: {
        submittedAnswer: {
          _id: submittedAnswer['_id'],
          paperId: submittedAnswer['paperId'],
          currentSection: submittedAnswer['currentSection'],
          time: submittedAnswer['time'],
          mcq: submittedAnswer['mcq'],
          mcqTotalMarks: submittedAnswer['mcqTotalMarks'],
        },
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Inserts code and input in the document
 * sends request to python server to compile code
 *
 * Access - Students
 */
export const runProgram = async (req, res, next) => {
  try {
    const {
      code,
      input,
      metadata,
      paperId,
      questionId,
      currentSection,
    } = req.body;
    const date = new Date().toISOString().slice(0, 10);

    // find the selected answer of student
    const _submittedAnswer = await SelectedAnswer.findOne(
      {
        studentId: req.user._id,
        paperId,
        date,
      },
      { currentSection: 1 },
    ).exec();

    // currentSection None then throw error
    if (_submittedAnswer['currentSection'] === 'None') {
      const error = new ErrorHandler(403, 'Test already submitted');
      return handleError(error, res);
    }
    const _saveAns = await SelectedAnswer.findOneAndUpdate({
      studentId: req.user._id,
      paperId,
      date,
    }, { $set: { 'code.$.program': code, 'code.$.input': input } });

    await axios.post(getPythonPath(), {
      code: code,
      input: input,
      metadata: {
        id: metadata,
        paperId,
        date,
        questionId,
        currentSection
      }
    });

    // returns the selected answer of current student
    return res.status(201).json({
      success: true,
      studentId: submittedAnswer['studentId'],
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};



/**
 * Saves the progress of the students on the timeout
 *
 * Returns the acknowledgement after saving the progress
 *
 * Access - Students
 */
export const saveProgressOnTimeOut = async (req, res, next) => {
  try {
    const { paperId, currentSection } = req.body;
    const date = new Date().toISOString().slice(0, 10);

    // find the selected answer of student
    const _submittedAnswer = await SelectedAnswer.findOne(
      {
        studentId: req.user._id,
        paperId,
        date,
      },
      { currentSection: 1, mcq: 1 },
    ).exec();

    // currentSection None then throw error
    if (_submittedAnswer['currentSection'] === 'None') {
      const error = new ErrorHandler(403, 'Test already submitted');
      return handleError(error, res);
    }

    if (currentSection === 'MCQ') {
      const { questionId, optionsSelected } = req.body;
      let marks = 0,
        mcqMarksObtained = 0;

      // Find the paper in the db using the paperId
      const paperObj = await Paper.findOne(
        {
          _id: paperId,
          'mcq.questionId': questionId,
        },
        { set: 1, mcq: 1 },
      )
        .populate('mcq.questionId', {
          _id: 1,
          correctAnswers: 1,
          marks: 1,
        })
        .exec();

      // Evaluate the question based on the question id
      for (let i = 0; i < paperObj['mcq'].length; i++) {
        if (
          paperObj['mcq'][i]['questionId']['_id'] == questionId &&
          paperObj['mcq'][i]['questionId']['correctAnswers'].includes(
            optionsSelected,
          )
        ) {
          marks = paperObj['mcq'][i]['marks'];
          break;
        }
      }

      const mcq = [];

      // Creating mcq object as per the format for saving in db
      for (let i = 0; i < _submittedAnswer['mcq'].length; i++) {
        if (_submittedAnswer['mcq'][i]['questionId'] == questionId) {
          mcq.push({
            questionId,
            optionsSelected,
            marks,
          });
        } else {
          mcq.push(_submittedAnswer['mcq'][i]);
        }
        mcqMarksObtained += mcq[i]['marks'];
      }

      // Updating the selected answers of student
      await SelectedAnswer.findOneAndUpdate(
        {
          studentId: req.user._id,
          paperId,
          date,
        },
        {
          mcq,
          mcqMarksObtained,
          time: 0,
          currentSection: 'None',
        },
      );
    } else {
      // No need to take any action, as if there was any code executed previously
      // that along with its input and output would have been saved.
    }

    await User.findOneAndUpdate(
      {
        _id: req.user._id,
      },
      {
        loggedIn: false,
      },
    );

    return res.status(200).json({
      success: true,
      data: {
        msg: 'Test submitted',
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Gives the filter parameters for the evaluation of papers
 *
 * Returns the list of filters
 *
 * Access - Teachers
 */
export const getAllFiltersForEvaluate = async (req, res, next) => {
  try {
    const year = await Paper.distinct('year');
    const type = await Paper.distinct('type');
    const div = await User.distinct('div');

    return res.status(200).json({
      success: true,
      data: {
        year,
        type,
        div,
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Gives the list of students as per the filters
 *
 * Returns the list of students
 *
 * Access - Teachers
 */
export const getStudentResponses = async (req, res, next) => {
  try {
    const { year: batch, type, div } = req.query;

    // Finds the students based on the div and batch
    const _studentId = await User.find(
      { div, batch },
      { _id: 1 },
    ).exec();

    // Finds the paper based on the year and type
    const _paperId = await Paper.find(
      { year: batch, type },
      { _id: 1 },
    ).exec();

    const studentId = [],
      paperId = [];

    for (let i = 0; i < _studentId.length; i++) {
      studentId.push(_studentId[i]['_id']);
    }

    for (let i = 0; i < _paperId.length; i++) {
      paperId.push(_paperId[i]['_id']);
    }

    // Finds the selected answers of students as per the studentIds and paperIds
    const selectedAnswer = await SelectedAnswer.find({
      studentId,
      paperId,
    })
      .populate('studentId', 'sapId')
      .populate('paperId', 'set')
      .exec();

    const _students = [];

    // Format the student object for the api response
    for (let i = 0; i < selectedAnswer.length; i++) {
      _students.push({
        studentId: selectedAnswer[i]['studentId']['_id'],
        sapId: selectedAnswer[i]['studentId']['sapId'],
        set: selectedAnswer[i]['paperId']['set'],
        paperId: selectedAnswer[i]['paperId']['_id'],
        _id: selectedAnswer[i]['_id'],
        print: selectedAnswer[i]['print'],
      });
    }

    // Sort by the sapId in ascending order
    const students = _students.sort((a, b) => a.sapId - b.sapId);

    // Returns the list of students
    return res.status(200).json({
      success: true,
      data: {
        year: batch,
        type,
        div,
        students,
      },
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Gives the selected answer of student
 *
 * Returns the selected answer of student
 *
 * Access - Teachers
 */
export const getCodeResponses = async (req, res, next) => {
  try {
    const { id, sapId } = req.query;

    const student = await User.findOne(
      { sapId },
      { _id: 1, sapId: 1 },
    ).exec();

    // find the selected answer of student
    const _selectedAnswer = await SelectedAnswer.findOne({
      _id: id,
      studentId: student._id,
    })
      .populate('paperId', {
        set: 1,
        code: 1,
        type: 1,
        year: 1,
        _id: 0,
      })
      .exec();

    // Extract field values
    const extractFieldValue = (id, obj, field) => {
      let value;
      for (let i = 0; i < obj.length; i++) {
        if (String(id) === String(obj[i]['questionId'])) {
          value = obj[i][field];
          break;
        }
      }
      return value;
    };

    const code = [];

    // format as per the response
    for (let i = 0; i < _selectedAnswer['code'].length; i++) {
      const question = await Question.findById(
        _selectedAnswer['code'][i]['questionId'],
      );

      code.push({
        _id: _selectedAnswer['code'][i]['questionId'],
        title: question['title'],
        program: _selectedAnswer['code'][i]['program'],
        output: _selectedAnswer['code'][i]['output'],
        marks: _selectedAnswer['code'][i]['marks'],
        maximumMarks: extractFieldValue(
          _selectedAnswer['code'][i]['questionId'],
          _selectedAnswer['paperId']['code'],
          'marks',
        ),
      });
    }

    // returns the selected answer of student
    return res.status(200).json({
      success: true,
      data: {
        count: {
          mcq: _selectedAnswer['mcq'].length,
          code: _selectedAnswer['code'].length,
        },
        mcqMarksObtained: _selectedAnswer['mcqMarksObtained'],
        mcqTotalMarks: _selectedAnswer['mcqTotalMarks'],
        codeMarksObtained: _selectedAnswer['codeMarksObtained'],
        codeTotalMarks: _selectedAnswer['codeTotalMarks'],
        code,
        set: _selectedAnswer['paperId']['set'],
        type: _selectedAnswer['paperId']['type'],
        year: _selectedAnswer['paperId']['year'],
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Evaluates the code responses submitted by student
 *
 * Returns the acknowledgement msg
 *
 * Access - Teachers
 */
export const evaluateCodeResponses = async (req, res, next) => {
  try {
    const { id, sapId, code } = req.body;
    let codeMarksObtained = 0;

    console.log({ code });

    const student = await User.findOne(
      { sapId },
      { _id: 1, sapId: 1 },
    ).exec();

    // Updates the individual code question marks
    for (let i = 0; i < code.length; i++) {
      await SelectedAnswer.findOneAndUpdate(
        {
          _id: id,
          studentId: student._id,
          'code.questionId': code[i]['questionId'],
        },
        { $set: { 'code.$.marks': code[i]['marks'] } },
      );
      codeMarksObtained += Number(code[i]['marks']);
    }

    // Updates the total code marks obtained
    await SelectedAnswer.findOneAndUpdate(
      {
        _id: id,
        studentId: student._id,
      },
      {
        codeMarksObtained,
        print: true,
      },
    );

    const selectedAnswer = await SelectedAnswer.findOne({
      _id: id,
    })
      .populate('paperId', {
        set: 1,
        time: 1,
        code: 1,
        mcq: 1,
        year: 1,
        type: 1,
        _id: 0,
      })
      .populate('studentId', { sapId: 1, _id: 0, div: 1, batch: 1 })
      .populate('mcq.questionId')
      .populate('code.questionId')
      .exec();

    // Generating PDF
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const content = reportCardTemplate(selectedAnswer);

    await page.setContent(content);

    const dir = path.join(
      __basedir,
      'media',
      'results',
      selectedAnswer['studentId']['batch'].toString(),
      selectedAnswer['paperId']['type'],
      selectedAnswer['studentId']['div'],
    );

    // Creates the dir if doesn't exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await page.pdf({
      path: path.join(
        dir,
        `${selectedAnswer['studentId']['sapId']}.pdf`,
      ),
      format: 'A4',
      printBackground: true,
      margin: {
        left: '32px',
        top: '32px',
        right: '32px',
        bottom: '32px',
      },
    });

    // returns the acknowledgement msg
    return res.status(200).json({
      success: true,
      data: {
        msg: `Paper evaluated of sapId: ${student.sapId}`,
      },
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Sends the pdf file in response
 *
 * Returns the pdf file of student progress
 *
 * Access - Teachers
 */
export const sendPdf = async (req, res, next) => {
  try {
    const { id } = req.params;

    const selectedAnswer = await SelectedAnswer.findOne({
      _id: id,
    })
      .populate('paperId', {
        type: 1,
        _id: 0,
      })
      .populate('studentId', { sapId: 1, _id: 0, div: 1, batch: 1 });

    const filename = path.join(
      __basedir,
      'media',
      'results',
      selectedAnswer['studentId']['batch'].toString(),
      selectedAnswer['paperId']['type'],
      selectedAnswer['studentId']['div'],
      `${selectedAnswer['studentId']['sapId']}.pdf`,
    );

    return res.sendFile(filename);
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Sends the excel sheet of score in response
 *
 * Returns the excel sheet of div
 *
 * Access - Teachers
 */
export const generateExcel = async (req, res, next) => {
  try {
    const { year: batch, type, div } = req.query;

    // Finds the students based on the div and batch
    const _studentId = await User.find(
      { div, batch },
      { _id: 1 },
    ).exec();

    // Finds the paper based on the year and type
    const _paperId = await Paper.find(
      { year: batch, type },
      { _id: 1 },
    ).exec();

    const studentId = [],
      paperId = [];

    for (let i = 0; i < _studentId.length; i++) {
      studentId.push(_studentId[i]['_id']);
    }

    for (let i = 0; i < _paperId.length; i++) {
      paperId.push(_paperId[i]['_id']);
    }

    // Finds the selected answers of students as per the studentIds and paperIds
    const _selectedAnswer = await SelectedAnswer.find(
      {
        studentId,
        paperId,
      },
      { currentSection: 0, time: 0, date: 0 },
    )
      .populate('studentId', 'sapId')
      .populate('paperId', 'set')
      .exec();

    // Sort by the sapId in ascending order
    const selectedAnswer = _selectedAnswer.sort(
      (a, b) => a['studentId']['sapId'] - b['studentId']['sapId'],
    );

    const dir = path.join(
      __basedir,
      'media',
      'excel',
      batch.toString(),
      type,
    );

    // Creates the dir if doesn't exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filename = path.join(dir, `${div}.xlsx`);

    // Generate the excel
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(div);

    let arr = [];

    arr.push({ header: 'SAP ID', key: 'sapId', width: 25 });

    for (let i = 0; i < selectedAnswer[0]['mcq'].length; i++) {
      arr.push({
        header: `MCQ Q. ${i + 1}`,
        key: `mcq${i + 1}`,
        width: 15,
      });
    }

    for (let i = 0; i < selectedAnswer[0]['code'].length; i++) {
      arr.push({
        header: `Code Q. ${i + 1}`,
        key: `code${i + 1}`,
        width: 15,
      });
    }

    arr.push({ header: 'Total', key: 'total', width: 15 });
    arr.push({ header: 'Evaluated', key: 'eval', width: 15 });

    // set the columns
    worksheet.columns = arr;

    // Iterating through answer
    for (let i = 0; i < selectedAnswer.length; i++) {
      const obj = {
        sapId: selectedAnswer[i]['studentId']['sapId'],
      };

      for (let j = 0; j < selectedAnswer[i]['mcq'].length; j++) {
        obj[`mcq${j + 1}`] = selectedAnswer[i]['mcq'][j]['marks'];
      }

      for (let j = 0; j < selectedAnswer[i]['code'].length; j++) {
        obj[`code${j + 1}`] = selectedAnswer[i]['code'][j]['marks'];
      }

      obj['total'] =
        selectedAnswer[i]['mcqMarksObtained'] +
        selectedAnswer[i]['codeMarksObtained'];

      obj['eval'] =
        selectedAnswer[i]['print'] === true ? 'Yes' : 'No';

      worksheet.addRow(obj);
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + filename,
    );

    workbook.xlsx.writeFile(filename).then(function () {
      workbook.xlsx.write(res);
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/**
 * Handles the return of data from python server
 * the python server will send data with following params :
 * success : true only if the program has executed without any errors
 * timeout : if the program was killed due to timeout
 * stderr : error message if there was any error in compiling/ running the program, empty for timeout or success
 * stdout : output of code if everything went well, empty for all other conditions
 * metadata : metadata sent along with compile request
 * 
 * Accessible to all, no authentication
 */
export const handlePythonCallback = async (req, res, next) => {
  let { id } = req.body.metadata;
  if (!id) {
    console.error('internal error : metadata should have had \'id\' parameter');
    return res.status(400).send();
  }
  const body = req.body;
  // we send the response early as we do not need to hold the python server anymore
  res.status(200).send();
  let ws = getSocket(id);
  if (!ws) {
    console.error(`internal error : socket for id ${id} has been closed before returning the output`);
    return;
  }

  ws.send(JSON.stringify(body));


  try {
    const { paperId, questionId, currentSection } = req.body.metadata;
    const date = new Date().toISOString().slice(0, 10);

    // find the selected answer of student
    const _submittedAnswer = await SelectedAnswer.findOne(
      {
        studentId: req.user._id,
        paperId,
        date,
      },
      { currentSection: 1 },
    ).exec();

    // currentSection None then throw error
    if (_submittedAnswer['currentSection'] === 'None') {
      const error = new ErrorHandler(403, 'Test already submitted');
      return handleError(error, res);
    }

    // Updating the progress of the student
    const submittedAnswer = await SelectedAnswer.findOneAndUpdate(
      {
        studentId: req.user._id,
        paperId,
        date,
        'code.questionId': questionId,
      },
      { $set: { 'code.$.output': req.body.stdout, currentSection, time: 0 } },
      { new: true },
    );

    // Logging out the user if the currentSection is None
    if (currentSection === 'None') {
      await User.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        {
          loggedIn: false,
        },
      );
    }
  } catch (err) {
    return handleError(err, res);
  }


}

// This is used in place of old runProgram's use for switching question

export const getQandA = async (req, res, next) => {

  try {
    const {
      paperId,
      questionId,
    } = req.body;
    const date = new Date().toISOString().slice(0, 10);

    // find the selected answer of student
    const _submittedAnswer = await SelectedAnswer.findOne(
      {
        studentId: req.user._id,
        paperId,
        date,
      },
      { currentSection: 1 },
    ).exec();

    // currentSection None then throw error
    if (_submittedAnswer['currentSection'] === 'None') {
      const error = new ErrorHandler(403, 'Test already submitted');
      return handleError(error, res);
    }


    // get last submitted answer
    const submittedAnswer = await SelectedAnswer.findOne(
      {
        studentId: req.user._id,
        paperId,
        date,
        'code.questionId': questionId,
      }
    );

    // returns the selected answer of current student
    return res.status(201).json({
      success: true,
      data: {
        submittedAnswer: {
          _id: submittedAnswer['_id'],
          paperId: submittedAnswer['paperId'],
          currentSection: submittedAnswer['currentSection'],
          studentId: submittedAnswer['studentId'],
          time: submittedAnswer['time'],
          code: submittedAnswer['code'],
          codeTotalMarks: submittedAnswer['codeTotalMarks'],
        },
      },
      error: {},
    });
  } catch (err) {
    return handleError(err, res);
  }

}