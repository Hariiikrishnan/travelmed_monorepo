import { Router } from 'express';
import * as medicineController from '../controllers/medicineController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', medicineController.getAll);
router.get('/:id', medicineController.getById);

// Protected Admin Routes
router.post('/', protect, restrictTo('admin'), medicineController.create);
router.put('/:id', protect, restrictTo('admin'), medicineController.update);
router.delete('/:id', protect, restrictTo('admin'), medicineController.remove);

export default router;
