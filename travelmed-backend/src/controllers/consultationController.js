import { z } from 'zod';
import * as consultationService from '../services/consultationService.js';
import { CONSULTATION_STATUSES } from '../config/commerce.js';
import prisma from '../config/database.js';

const createSchema = z.object({
  orderId: z.string().trim().min(4, 'Order ID is required').max(40),
  whatsapp: z
    .string()
    .trim()
    .min(8, 'Valid WhatsApp number required')
    .max(20)
    .regex(/^[+\d][\d\s-]{6,}$/, 'Valid WhatsApp number required'),
  symptom: z.string().trim().min(2).max(120),
  destination: z.string().trim().min(2).max(120),
});

const updateSchema = z
  .object({
    status: z.enum(CONSULTATION_STATUSES).optional(),
    doctorId: z.string().min(1).nullable().optional(),
    meetingLink: z.string().url().max(300).nullable().optional(),
    notes: z.string().max(2000).nullable().optional(),
  })
  .strict();

export const create = async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const booking = await consultationService.createBooking(data);
    res.status(201).json({
      success: true,
      message: `Consultation ${booking.sequence} of ${booking.consultationsAllowed} booked.`,
      data: {
        id: booking.id,
        orderId: booking.orderId,
        sequence: booking.sequence,
        consultationsUsed: booking.consultationsUsed,
        consultationsRemaining: booking.consultationsRemaining,
        consultationsAllowed: booking.consultationsAllowed,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAll = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, data: await consultationService.getAll() });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body);
    const booking = await consultationService.update(req.params.id, data);
    await prisma.activityLog
      .create({
        data: {
          user: req.user?.name || 'System Admin',
          action: 'Consultation Updated',
          changes: `${booking.orderId}: ${Object.entries(data).map(([k, v]) => `${k}=${v ?? '—'}`).join(', ')}`,
        },
      })
      .catch(() => {});
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};
