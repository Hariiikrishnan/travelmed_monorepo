import { Router } from 'express';
import * as scenarioController from '../controllers/scenarioController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', scenarioController.getAll);
router.get('/:id', scenarioController.getById);

// Protected Admin Routes
router.post('/', protect, restrictTo('admin'), scenarioController.create);
router.put('/:id', protect, restrictTo('admin'), scenarioController.update);
router.delete('/:id', protect, restrictTo('admin'), scenarioController.remove);

export default router;
