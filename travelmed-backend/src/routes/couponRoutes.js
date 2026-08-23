import { Router } from 'express';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import * as couponController from '../controllers/couponController.js';

const router = Router();

// Public route to validate a coupon
router.get('/validate/:code', couponController.validateCoupon);

// Admin-only routes
router.use(protect, restrictTo('admin'));
router.get('/', couponController.getAllCoupons);
router.post('/', couponController.createCoupon);
router.patch('/:code/status', couponController.updateCouponStatus);

export default router;
