/**
 * Store-wide commerce rules. Single source of truth for the backend —
 * the website and admin read these values from the API, never hard-code them.
 */
export const FREE_SHIPPING_THRESHOLD = Number(process.env.FREE_SHIPPING_THRESHOLD ?? 2000);
export const SHIPPING_FEE = Number(process.env.SHIPPING_FEE ?? 150);
export const CURRENCY = 'INR';

export const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Refunded'];
export const CONSULTATION_STATUSES = ['New', 'Contacted', 'Completed', 'Cancelled'];

/** Dummy (no-Razorpay) payments are only ever allowed outside production. */
export const isDummyPaymentAllowed = () => process.env.NODE_ENV !== 'production';

export const publicCommerceConfig = () => ({
  currency: CURRENCY,
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  shippingFee: SHIPPING_FEE,
});
