import { z } from 'zod';

/** Clients send only what they want and how many — never prices. */
export const cartItemSchema = z.object({
  productId: z.string().min(1).max(80),
  quantity: z.number().int().min(1).max(20),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required').max(120),
  address: z.string().trim().min(5, 'Street address is required').max(300),
  city: z.string().trim().min(2, 'City is required').max(80),
  country: z.string().trim().min(2, 'Country is required').max(60),
  zipCode: z.string().trim().min(3, 'Pincode / ZIP is required').max(12),
  phone: z.string().trim().min(8, 'Valid phone number required').max(20),
  email: z.string().trim().email('Valid email address required').max(160),
});

export const quoteSchema = z.object({
  items: z.array(cartItemSchema).min(1, 'Your bag is empty'),
  couponCode: z.string().trim().max(40).optional().nullable(),
});

export const checkoutSchema = quoteSchema.extend({
  shippingAddress: shippingAddressSchema,
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().optional(),
});
