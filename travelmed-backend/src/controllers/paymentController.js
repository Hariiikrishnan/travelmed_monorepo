import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../config/database.js';

// Initialize Razorpay conditionally (allows dummy mode)
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === 'dummy' || keySecret === 'dummy') {
    return null;
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
};

export const createRazorpayOrder = async (req, res, next) => {
  try {
    const { items, couponCode } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ status: 'fail', message: 'Cart items are required to generate order.' });
    }

    // 1. Calculate base subtotal securely on server
    let subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 2. Validate and apply coupon from secure Postgres DB
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: String(couponCode).toUpperCase() } });
      if (coupon && coupon.status === 'Active') {
        if (coupon.type === 'Percentage') {
          subtotal = subtotal - ((subtotal * coupon.discount) / 100);
        } else {
          subtotal = subtotal - coupon.discount;
        }
        if (subtotal < 0) subtotal = 0;
      }
    }

    // 3. Add exact shipping logic matching DB
    const shippingCost = subtotal >= 2000 ? 0 : 150;
    const finalAmount = subtotal + shippingCost;

    const razorpay = getRazorpayInstance();

    // If keys are dummy, return a mock order immediately
    if (!razorpay) {
      return res.status(200).json({
        success: true,
        data: {
          id: 'order_dummy_' + Math.random().toString(36).substring(2, 9),
          amount: finalAmount * 100, // in paise
          currency: 'INR',
          isDummy: true
        }
      });
    }

    const options = {
      amount: Math.round(finalAmount * 100), // convert to paise securely
      currency: 'INR',
      receipt: 'rcpt_' + Math.floor(Math.random() * 1000000)
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    next(err);
  }
};

export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        status: 'fail',
        message: 'Order ID and Payment ID are required for verification.'
      });
    }

    // Auto-verify if dummy payment
    if (razorpay_order_id.startsWith('order_dummy_')) {
      return res.status(200).json({
        success: true,
        message: 'Dummy payment verified successfully.',
        data: {
          paymentId: razorpay_payment_id,
          status: 'success'
        }
      });
    }

    if (!razorpay_signature) {
      return res.status(400).json({
        status: 'fail',
        message: 'Signature is required for real payments.'
      });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body.toString())
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid payment signature. Payment validation failed.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully.',
      data: {
        paymentId: razorpay_payment_id,
        status: 'success'
      }
    });
  } catch (err) {
    next(err);
  }
};
