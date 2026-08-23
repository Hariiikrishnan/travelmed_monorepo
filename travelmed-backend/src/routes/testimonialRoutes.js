import { Router } from 'express';
import * as testimonialController from '../controllers/testimonialController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', testimonialController.getAll);

// Authenticated User Route for submitting reviews
router.post('/', protect, testimonialController.create);

// Protected Admin Routes
router.patch('/:id/status', protect, restrictTo('admin'), testimonialController.updateStatus);
router.patch('/:id/reply', protect, restrictTo('admin'), testimonialController.updateReply);

export default router;
