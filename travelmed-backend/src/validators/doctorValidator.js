import { z } from 'zod';

export const doctorSchema = z.object({
  name: z.string().trim().min(3).max(120),
  specialty: z.string().trim().min(2).max(160),
  qualification: z.string().trim().max(200).default(''),
  languages: z.array(z.string().trim().min(1).max(40)).max(15).default(['English']),
  experience: z.string().trim().max(40).default(''),
  bio: z.string().trim().max(2000).default(''),
  image: z.string().trim().max(500).default(''),
  status: z.enum(['Active', 'Inactive']).default('Active'),
  fees: z.number().int().min(0).nullable().optional(),
  days: z.array(z.string().max(20)).max(7).default([]),
  slots: z.array(z.string().max(40)).max(30).default([]),
  availability: z.string().trim().max(60).default('Available'),
});
