import { Prisma } from '@prisma/client';
import prisma from '../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../utils/errors.js';

const ACTIVE = { status: { not: 'Cancelled' } };

/**
 * Books a free teleconsultation for a paid order. At most `order.consultsAllowed`
 * (the sum of the kits' included consults) non-cancelled bookings per order. The count and insert run in a SERIALIZABLE
 * transaction so two simultaneous requests cannot exceed the limit.
 */
export const createBooking = async ({ orderId, whatsapp, symptom, destination }) => {
  const order = await prisma.order.findFirst({
    where: { orderId: { equals: orderId.trim(), mode: 'insensitive' } },
    select: { orderId: true, paymentStatus: true, status: true, consultsAllowed: true },
  });
  if (!order) throw new NotFoundError('We could not find that Order ID. Please check your order confirmation.');
  if (order.paymentStatus !== 'Paid' || ['Cancelled', 'Refunded'].includes(order.status)) {
    throw new BadRequestError('Teleconsultations are available only for confirmed (paid) orders.');
  }
  const allowed = order.consultsAllowed;
  if (allowed <= 0) {
    throw new BadRequestError("The kit in this order doesn't include free teleconsultations.");
  }

  const attempt = () =>
    prisma.$transaction(
      async (tx) => {
        const used = await tx.consultationBooking.count({ where: { orderId: order.orderId, ...ACTIVE } });
        if (used >= allowed) {
          throw new AppError(
            allowed === 1
              ? `The free teleconsultation for order ${order.orderId} has already been used.`
              : `All ${allowed} free teleconsultations for order ${order.orderId} have already been used.`,
            409
          );
        }
        const booking = await tx.consultationBooking.create({
          data: { orderId: order.orderId, whatsapp, symptom, destination },
        });
        return { booking, sequence: used + 1 };
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

  let result;
  try {
    result = await attempt();
  } catch (err) {
    // P2034 = serialization conflict from a concurrent request — retry once, then re-check the limit
    if (err?.code === 'P2034') result = await attempt();
    else throw err;
  }

  return {
    ...result.booking,
    sequence: result.sequence,
    consultationsUsed: result.sequence,
    consultationsRemaining: allowed - result.sequence,
    consultationsAllowed: allowed,
  };
};

/** Admin list with per-order usage and the booking's position (1 or 2) within its order. */
export const getAll = async () => {
  const bookings = await prisma.consultationBooking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      doctor: { select: { id: true, name: true, specialty: true } },
      order: { select: { orderId: true, shippingFullName: true, shippingEmail: true, status: true, consultsAllowed: true } },
    },
  });

  // Sequence = order of creation among the order's non-cancelled bookings
  const byOrder = new Map();
  [...bookings]
    .sort((a, b) => a.createdAt - b.createdAt)
    .forEach((b) => {
      const list = byOrder.get(b.orderId) ?? [];
      list.push(b);
      byOrder.set(b.orderId, list);
    });

  return bookings.map((b) => {
    const siblings = byOrder.get(b.orderId) ?? [];
    const active = siblings.filter((s) => s.status !== 'Cancelled');
    const position = active.findIndex((s) => s.id === b.id);
    return {
      ...b,
      sequence: position >= 0 ? position + 1 : null,
      consultationsUsed: active.length,
      consultationsRemaining: Math.max(0, b.order.consultsAllowed - active.length),
      consultationsAllowed: b.order.consultsAllowed,
    };
  });
};

export const update = async (id, data) => {
  const existing = await prisma.consultationBooking.findUnique({ where: { id } });
  if (!existing) throw new NotFoundError('Booking not found.');

  // Re-activating a cancelled booking must not exceed the order's limit
  if (existing.status === 'Cancelled' && data.status && data.status !== 'Cancelled') {
    const [used, order] = await Promise.all([
      prisma.consultationBooking.count({ where: { orderId: existing.orderId, ...ACTIVE } }),
      prisma.order.findUnique({ where: { orderId: existing.orderId }, select: { consultsAllowed: true } }),
    ]);
    if (used >= (order?.consultsAllowed ?? 0)) {
      throw new AppError('This order has no free teleconsultations left to re-activate this booking.', 409);
    }
  }

  return prisma.consultationBooking.update({
    where: { id },
    data,
    include: { doctor: { select: { id: true, name: true, specialty: true } } },
  });
};
