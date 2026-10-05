import { Router } from 'express';
import * as productController from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

// Admin (registered before /:idOrSlug so "all" isn't treated as a slug)
router.get('/admin/all', protect, restrictTo('admin'), productController.listAll);
router.post('/', protect, restrictTo('admin'), productController.create);
router.put('/:id', protect, restrictTo('admin'), productController.update);
router.delete('/:id', protect, restrictTo('admin'), productController.remove);

// Public
router.get('/', productController.listPublic);
router.get('/:idOrSlug', productController.getPublic);

export default router;
