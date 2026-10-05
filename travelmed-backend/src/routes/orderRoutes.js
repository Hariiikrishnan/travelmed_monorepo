import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = Router();

// Public
router.post('/quote', orderController.quote);
router.get('/:orderId', orderController.getOrderById);

// Admin. Orders are created only through the payment flow (/api/payments).
router.get('/', protect, restrictTo('admin'), orderController.getAllOrders);
router.patch('/:orderId/status', protect, restrictTo('admin'), orderController.updateOrderStatus);

export default router;
