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
} from '../controllers';
import { protect, isTeacher, isAdmin } from '../middlewares';

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

// Route for the students

export default router;
