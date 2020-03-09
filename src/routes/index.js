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
  .route('/questions')
  .get(protect, isTeacher, getQuestions)
  .post(protect, isTeacher, createQuestion);

router
  .route('/questions/:id')
  .get(protect, isTeacher, getQuestion)
  .put(protect, isTeacher, updateQuestion)
  .delete(protect, isTeacher, deleteQuestion);

// Route for the students

export default router;
