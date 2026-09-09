import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, restrictTo('admin'));
router.get('/', adminController.getAdmins);
router.post('/promote', adminController.promoteToAdmin);
router.delete('/:email', adminController.revokeAdmin);

export default router;
