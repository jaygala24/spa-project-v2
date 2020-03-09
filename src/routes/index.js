import { Router } from 'express';
import { login } from '../controllers';

const router = Router();

router.route('/auth/users/login').post(login);

export default router;
