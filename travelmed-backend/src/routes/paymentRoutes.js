import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';
import { formLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/create-order', formLimiter, optionalProtect, createRazorpayOrder);
router.post('/verify', verifyPayment);

export default router;
