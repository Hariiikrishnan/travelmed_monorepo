import { Router } from 'express';
import * as consultationController from '../controllers/consultationController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { formLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Public: customers request one of their free teleconsultations
router.post('/', formLimiter, consultationController.create);

// Admin
router.get('/', protect, restrictTo('admin'), consultationController.getAll);
router.patch('/:id', protect, restrictTo('admin'), consultationController.update);

export default router;
