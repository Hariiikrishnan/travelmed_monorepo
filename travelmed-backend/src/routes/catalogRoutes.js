import { Router } from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { crud } from '../controllers/catalogController.js';

const build = (key) => {
  const c = crud(key);
  const router = Router();
  // Admin (registered before the public list so "/admin/all" isn't shadowed)
  router.get('/admin/all', protect, restrictTo('admin'), c.listAll);
  router.post('/', protect, restrictTo('admin'), c.create);
  router.patch('/:id', protect, restrictTo('admin'), c.update);
  router.delete('/:id', protect, restrictTo('admin'), c.remove);
  // Public
  router.get('/', c.listPublic);
  return router;
};

export const kitTypeRoutes = build('kitType');
export const medicineCategoryRoutes = build('medicineCategory');
