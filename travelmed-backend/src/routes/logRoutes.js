import { Router } from 'express';
import * as logController from '../controllers/logController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

// Used by the dashboard to add and see activity logs
router.use(protect, restrictTo('admin'));
router.get('/', logController.getAllLogs);
router.post('/', logController.createLog);

export default router;
