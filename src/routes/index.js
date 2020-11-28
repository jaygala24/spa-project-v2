import { Router } from 'express';
import {
  login,
  generatePasswordForStudents,
  updateTeacherPassword,
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestions,
  createPaper,
  getPapers,
  getPaper,
  updatePaper,
  deletePaper,
  createStudentUser,
  createTeacherUser,
  resetStudentLogin,
  getLoggedInStudents,
  getTags,
  getAllSets,
  createAnswerObjForStudents,
  getQuestionsForStudents,
  evaluateMCQQuestion,
  runProgram,
  saveProgressOnTimeOut,
  getAllFiltersForEvaluate,
  getStudentResponses,
  evaluateCodeResponses,
  getCodeResponses,
  sendPdf,
  generateExcel,
  handlePythonCallback,
  getQandA,
  autoSave,
} from '../controllers';
import { protect, isTeacher, isAdmin } from '../middlewares';

// route which python server will POST to to return the output of code
// this will give net route : /api/api/endpoint
const callbackEndpoint = `/api/${process.env.PYTHON_CALLBACK_ENDPOINT}`;

const router = Router();

// Routes for the teachers
router.route('/auth/users/login').post(login);

router
  .route('/auth/users/password')
  .put(protect, isTeacher, updateTeacherPassword);

router
  .route('/students/changePassword')
  .get(protect, isTeacher, isAdmin, generatePasswordForStudents);

router
  .route('/students/loggedIn')
  .get(protect, isTeacher, getLoggedInStudents);

router
  .route('/students/resetLogin')
  .get(protect, isTeacher, resetStudentLogin);

router
  .route('/users/teachers/create')
  .post(protect, isTeacher, isAdmin, createTeacherUser);

router
  .route('/users/students/create')
  .post(protect, isTeacher, createStudentUser);

router.route('/questions/tags').get(protect, isTeacher, getTags);

router
  .route('/questions')
  .get(protect, isTeacher, getQuestions)
  .post(protect, isTeacher, createQuestion);

router
  .route('/questions/:id')
  .get(protect, isTeacher, getQuestion)
  .put(protect, isTeacher, updateQuestion)
  .delete(protect, isTeacher, deleteQuestion);

router
  .route('/papers')
  .get(protect, isTeacher, getPapers)
  .post(protect, isTeacher, createPaper);

router
  .route('/papers/:id')
  .get(protect, isTeacher, getPaper)
  .put(protect, isTeacher, updatePaper)
  .delete(protect, isTeacher, deletePaper);

router
  .route('/evaluate/filters')
  .get(protect, isTeacher, getAllFiltersForEvaluate);

router
  .route('/evaluate/responses')
  .get(protect, isTeacher, getStudentResponses);

router
  .route('/students/responses')
  .get(protect, isTeacher, getCodeResponses);

router
  .route('/evaluate/code/responses')
  .post(protect, evaluateCodeResponses);

router.route('/generate/pdf/:id').get(protect, isTeacher, sendPdf);

router
  .route('/generate/excel')
  .get(protect, isTeacher, generateExcel);

// Route for the students
router.route('/sets').get(protect, getAllSets);

router.route('/answers').post(protect, createAnswerObjForStudents);

router
  .route('/students/questions')
  .get(protect, getQuestionsForStudents);

router
  .route('/students/mcq/evaluate')
  .post(protect, evaluateMCQQuestion);

router.route('/students/runProgram').post(protect, runProgram);

router
  .route('/students/timeout')
  .post(protect, saveProgressOnTimeOut);

router.route('/students/getQandA').post(protect, getQandA);

router.route('/students/autosave').post(protect, autoSave);

// routes which will be hit by python server
router.route(callbackEndpoint).post(handlePythonCallback);

export default router;
