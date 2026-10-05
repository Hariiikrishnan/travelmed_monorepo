import Razorpay from 'razorpay';
import crypto from 'crypto';
import { checkoutSchema, verifyPaymentSchema } from '../validators/orderValidator.js';
import * as orderService from '../services/orderService.js';
import { AppError, BadRequestError } from '../utils/errors.js';
import { CURRENCY, isDummyPaymentAllowed } from '../config/commerce.js';

const hasRealKeys = () => {
  const { RAZORPAY_KEY_ID: id, RAZORPAY_KEY_SECRET: secret } = process.env;
  return Boolean(id && secret && id !== 'dummy' && secret !== 'dummy');
};

const getRazorpay = () =>
  new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

const safeEqual = (a, b) => {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
};

/**
 * Step 1 of checkout: price the bag on the server, create a pending order
 * and a matching Razorpay order. The client never decides the amount.
 */
export const createRazorpayOrder = async (req, res, next) => {
  try {
    const data = checkoutSchema.parse(req.body);
    const realPayments = hasRealKeys();

    if (!realPayments && !isDummyPaymentAllowed()) {
      throw new AppError('Online payments are temporarily unavailable. Please try again shortly.', 503);
    }

    const order = await orderService.createPendingOrder(data, req.user?.id ?? null);
    const amountPaise = Math.round(order.total * 100);

    if (!realPayments) {
      const dummyId = 'order_dummy_' + crypto.randomBytes(6).toString('hex');
      await orderService.attachRazorpayOrder(order.orderId, dummyId);
      return res.status(200).json({
        success: true,
        data: { id: dummyId, amount: amountPaise, currency: CURRENCY, orderId: order.orderId, isDummy: true },
      });
    }

    const rzpOrder = await getRazorpay().orders.create({
      amount: amountPaise,
      currency: CURRENCY,
      receipt: order.orderId,
      notes: { orderId: order.orderId },
    });
    await orderService.attachRazorpayOrder(order.orderId, rzpOrder.id);

    res.status(200).json({
      success: true,
      data: {
        id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        orderId: order.orderId,
        key: process.env.RAZORPAY_KEY_ID, // public key id — safe to expose
        isDummy: false,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Step 2: verify the gateway signature, then (and only then) mark the order paid.
 * Returns the confirmed order for the success page.
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = verifyPaymentSchema.parse(req.body);

    if (razorpay_order_id.startsWith('order_dummy_')) {
      if (!isDummyPaymentAllowed()) {
        throw new BadRequestError('Invalid payment.');
      }
    } else {
      if (!hasRealKeys() || !razorpay_signature) {
        throw new BadRequestError('Payment signature is required.');
      }
      const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
      if (!safeEqual(expected, razorpay_signature)) {
        throw new BadRequestError('Invalid payment signature. Payment validation failed.');
      }
    }

    const order = await orderService.markOrderPaid(razorpay_order_id, razorpay_payment_id);
    res.status(200).json({ success: true, message: 'Payment verified successfully.', data: orderService.formatOrder(order) });
  } catch (err) {
    next(err);
  }
};
