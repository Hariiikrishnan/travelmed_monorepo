import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect, restrictTo, optionalProtect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', optionalProtect, orderController.createOrder);
router.get('/:orderId', orderController.getOrderById);

// Protected Admin Routes
router.get('/', protect, restrictTo('admin'), orderController.getAllOrders);
router.patch('/:orderId/status', protect, restrictTo('admin'), orderController.updateOrderStatus);

export default router;
