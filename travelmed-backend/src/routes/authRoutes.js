import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

// Only an existing admin can create accounts — public self-registration as admin is not allowed
router.post('/register', protect, restrictTo('admin'), authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);

export default router;
