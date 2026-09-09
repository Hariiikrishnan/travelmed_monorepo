import { Router } from 'express';
import * as doctorController from '../controllers/doctorController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', doctorController.getAll);
router.get('/:id', doctorController.getById);

// Protected Admin Routes
router.post('/', protect, restrictTo('admin'), doctorController.create);
router.put('/:id', protect, restrictTo('admin'), doctorController.update);
router.delete('/:id', protect, restrictTo('admin'), doctorController.remove);

export default router;
