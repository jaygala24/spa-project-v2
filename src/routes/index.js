import { Router } from 'express';
import { getPosts } from '../controllers';

const router = Router();

router.route('/posts').get(getPosts);

export default router;
