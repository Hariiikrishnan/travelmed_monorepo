import Razorpay from 'razorpay';
import crypto from 'crypto';

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
    const { amount } = req.body; // Expect amount in Rupees (e.g. 2650)
    if (!amount) {
      return res.status(400).json({
        status: 'fail',
        message: 'Payment amount is required.'
      });
    }

    const razorpay = getRazorpayInstance();

    // If keys are dummy, return a mock order immediately
    if (!razorpay) {
      return res.status(200).json({
        success: true,
        data: {
          id: 'order_dummy_' + Math.random().toString(36).substring(2, 9),
          amount: amount * 100, // in paise
          currency: 'INR',
          isDummy: true
        }
      });
    }

    const options = {
      amount: Math.round(amount * 100), // convert to paise
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
