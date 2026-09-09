import { z } from 'zod';

const cartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  type: z.enum(['kit', 'addon']),
  description: z.string().optional(),
  options: z.object({
    size: z.enum(['Solo', 'Couple', 'Family']).optional(),
    pediatricAddon: z.boolean().optional(),
    seniorAddon: z.boolean().optional(),
  }).optional()
});

export const createOrderSchema = z.object({
  shippingAddress: z.object({
    fullName: z.string().min(1, 'Full name is required'),
    address: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    country: z.string().min(1, 'Country is required'),
    zipCode: z.string().min(1, 'ZIP/Pincode is required'),
    phone: z.string().min(8, 'Valid phone required').optional(),
  }),
  items: z.array(cartItemSchema).min(1, 'Order must contain at least 1 item'),
  paymentStatus: z.string().optional(),
  paymentId: z.string().optional().nullable(),
  couponCode: z.string().optional()
});
