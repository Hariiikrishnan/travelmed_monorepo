import { Router } from 'express';
import * as ticketController from '../controllers/ticketController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

// Public route for customers via contact page
router.post('/', ticketController.create);

// Protected Admin routes
router.use(protect, restrictTo('admin'));
router.get('/', ticketController.getAll);
router.patch('/:id/status', ticketController.updateStatus);
router.patch('/:id/reply', ticketController.updateReply);

export default router;
