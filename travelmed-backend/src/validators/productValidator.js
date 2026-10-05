import { z } from 'zod';

const kitItemSchema = z.object({
  medicineId: z.string().min(1).max(80),
  quantity: z.number().int().min(1).max(999),
  unit: z.string().trim().min(1).max(30).default('pcs'),
  note: z.string().trim().max(200).default(''),
});

const slug = z
  .string()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9-]+$/, 'Slug may contain lowercase letters, numbers and hyphens only');

export const productSchema = z
  .object({
    slug,
    name: z.string().min(2).max(160),
    sku: z.string().min(2).max(60),
    mrp: z.number().positive(),
    price: z.number().positive(),
    gstPercent: z.number().min(0).max(28).default(5),
    stock: z.number().int().min(0),
    status: z.enum(['In Stock', 'Out of Stock']),
    visibility: z.enum(['Visible', 'Hidden']),
    description: z.string().max(5000).default(''),
    highlights: z.array(z.string().max(200)).max(30).default([]),
    benefits: z.array(z.string().max(200)).max(30).default([]),
    specs: z.record(z.string().max(200)).default({}),
    faqs: z.array(z.object({ q: z.string().max(300), a: z.string().max(2000) })).max(30).default([]),
    images: z.array(z.string().max(500)).max(20).default([]),
    seoTitle: z.string().max(120).default(''),
    seoDescription: z.string().max(320).default(''),
    kitTypeId: z.string().min(1).nullable().default(null),
    tagline: z.string().trim().max(160).default(''),
    tripLength: z.string().trim().max(80).default(''),
    bagSize: z.string().trim().max(80).default(''),
    bagWeight: z.string().trim().max(40).default(''),
    consultsIncluded: z.number().int().min(0).max(10).default(0),
    isFeatured: z.boolean().default(false),
    sortOrder: z.number().int().min(0).max(999).default(0),
    items: z
      .array(kitItemSchema)
      .max(300)
      .refine((items) => new Set(items.map((i) => i.medicineId)).size === items.length, {
        message: 'A medicine can only be listed once per kit',
      })
      .optional(),
  })
  .refine((p) => p.price <= p.mrp, { message: 'Selling price cannot be higher than MRP', path: ['price'] });

export const productUpdateSchema = productSchema;
