import { Router } from 'express';
import {
  login,
  generatePasswordForStudents,
  updateTeacherPassword,
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

// Route for the students

export default router;
