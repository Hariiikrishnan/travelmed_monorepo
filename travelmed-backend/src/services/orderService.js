import crypto from 'crypto';
import prisma from '../config/database.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';
import { priceCart } from './pricingService.js';
import twilioService from './twilioService.js';

const newOrderId = () => 'TM-' + crypto.randomBytes(5).toString('hex').toUpperCase().slice(0, 8);
const newTrackingNumber = () => 'TRK' + crypto.randomInt(100000000, 999999999);

const estimatedDeliveryText = () => {
  const d = new Date();
  d.setDate(d.getDate() + 5);
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });
};

/** Full order shape for the buyer (right after payment) and for admins. */
export const formatOrder = (order) => ({
  orderId: order.orderId,
  status: order.status,
  paymentStatus: order.paymentStatus,
  trackingNumber: order.trackingNumber,
  estimatedDelivery: order.estimatedDelivery,
  subtotal: order.subtotal,
  discount: order.discount,
  couponCode: order.couponCode,
  shippingCost: order.shippingCost,
  total: order.total,
  createdAt: order.createdAt,
  shippingAddress: {
    fullName: order.shippingFullName,
    address: order.shippingAddress,
    city: order.shippingCity,
    country: order.shippingCountry,
    zipCode: order.shippingZipCode,
    phone: order.shippingPhone,
    email: order.shippingEmail,
  },
  items: (order.items ?? []).map((item) => ({
    id: item.productId ?? item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    type: item.type,
    description: item.description,
  })),
});

/**
 * Creates an order awaiting payment. Prices come from the database only.
 * Called at checkout start; it becomes Paid only via markOrderPaid().
 */
export const createPendingOrder = async ({ shippingAddress, items, couponCode }, userId, razorpayOrderId = null) => {
  const quote = await priceCart(items, couponCode);

  return prisma.order.create({
    data: {
      orderId: newOrderId(),
      userId,
      status: 'Pending',
      paymentStatus: 'Pending',
      razorpayOrderId,
      trackingNumber: newTrackingNumber(),
      estimatedDelivery: estimatedDeliveryText(),
      subtotal: quote.subtotal,
      discount: quote.discount,
      couponCode: quote.coupon?.code ?? null,
      shippingCost: quote.shippingCost,
      total: quote.total,
      consultsAllowed: quote.consultsIncluded,
      shippingFullName: shippingAddress.fullName,
      shippingAddress: shippingAddress.address,
      shippingCity: shippingAddress.city,
      shippingCountry: shippingAddress.country,
      shippingZipCode: shippingAddress.zipCode,
      shippingPhone: shippingAddress.phone || null,
      shippingEmail: shippingAddress.email || null,
      items: {
        create: quote.lines.map((line) => ({
          productId: line.productId,
          name: line.name,
          price: line.unitPrice,
          quantity: line.quantity,
          type: 'kit',
          description: line.description,
        })),
      },
    },
    include: { items: true },
  });
};

/** Attaches the gateway order id once Razorpay has created it. */
export const attachRazorpayOrder = (orderId, razorpayOrderId) =>
  prisma.order.update({ where: { orderId }, data: { razorpayOrderId } });

/**
 * Marks a pending order as paid (idempotent): decrements stock, counts the coupon
 * use and notifies the customer. Must only be called after payment verification.
 */
export const markOrderPaid = async (razorpayOrderId, paymentId) => {
  const existing = await prisma.order.findUnique({ where: { razorpayOrderId }, include: { items: true } });
  if (!existing) throw new NotFoundError('Order for this payment was not found.');
  if (existing.paymentStatus === 'Paid') return existing;

  const order = await prisma.$transaction(async (tx) => {
    for (const item of existing.items) {
      if (!item.productId) continue;
      const updated = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (updated.count === 0) {
        // Payment already captured — keep the order but flag it for the team instead of failing
        await tx.activityLog.create({
          data: { user: 'System', action: 'Stock Alert', changes: `Order ${existing.orderId} paid while ${item.name} stock was insufficient` },
        });
      }
    }
    if (existing.couponCode) {
      await tx.coupon.updateMany({ where: { code: existing.couponCode }, data: { usages: { increment: 1 } } });
    }
    return tx.order.update({
      where: { orderId: existing.orderId },
      data: { paymentStatus: 'Paid', paymentId, status: 'Processing' },
      include: { items: true },
    });
  });

  if (order.shippingPhone) {
    await twilioService.sendOrderSms(
      order.shippingPhone,
      `Thank you for your order! Your TravelMed order ${order.orderId} is confirmed. Estimated delivery: ${order.estimatedDelivery}.`
    );
  }
  return order;
};

export const findOrder = async (orderIdOrTracking) => {
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { orderId: { equals: orderIdOrTracking, mode: 'insensitive' } },
        { trackingNumber: { equals: orderIdOrTracking, mode: 'insensitive' } },
      ],
    },
    include: { items: true },
  });
  if (!order) throw new NotFoundError(`Order "${orderIdOrTracking}" was not found.`);
  return order;
};

/** Public tracking view — no address, phone or email. */
export const getPublicTracking = async (orderIdOrTracking) => {
  const order = await findOrder(orderIdOrTracking);
  return {
    orderId: order.orderId,
    status: order.status,
    paymentStatus: order.paymentStatus,
    trackingNumber: order.trackingNumber,
    estimatedDelivery: order.estimatedDelivery,
    createdAt: order.createdAt,
    shippingAddress: {
      fullName: order.shippingFullName.split(' ')[0],
      city: order.shippingCity,
    },
    items: order.items.map((i) => ({ name: i.name, quantity: i.quantity })),
  };
};

const consultCounts = async (orderIds) => {
  if (!orderIds.length) return new Map();
  const rows = await prisma.consultationBooking.groupBy({
    by: ['orderId'],
    where: { orderId: { in: orderIds }, status: { not: 'Cancelled' } },
    _count: { _all: true },
  });
  return new Map(rows.map((r) => [r.orderId, r._count._all]));
};

export const getAllOrders = async () => {
  const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
  const counts = await consultCounts(orders.map((o) => o.orderId));
  return orders.map((o) => {
    const used = counts.get(o.orderId) ?? 0;
    return { ...o, consultationsUsed: used, consultationsRemaining: Math.max(0, o.consultsAllowed - used) };
  });
};

export const updateOrderStatus = async (orderId, status) => {
  const existing = await findOrder(orderId);
  if (existing.paymentStatus !== 'Paid' && !['Pending', 'Cancelled'].includes(status)) {
    throw new BadRequestError('This order has not been paid yet. It can only be kept Pending or Cancelled.');
  }

  const updatedOrder = await prisma.order.update({
    where: { orderId: existing.orderId },
    data: { status },
    include: { items: true },
  });

  if (updatedOrder.shippingPhone && updatedOrder.paymentStatus === 'Paid') {
    await twilioService.sendOrderSms(
      updatedOrder.shippingPhone,
      `Hello! Your TravelMed order ${updatedOrder.orderId} status has been updated to: ${status}.`
    );
  }
  return updatedOrder;
};
