import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import twilioService from './twilioService.js';

export const createOrder = async ({ shippingAddress, items, paymentStatus, paymentId, couponCode }, userId) => {
  // 1. Calculate costs
  let subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (coupon && coupon.status === 'Active') {
      if (coupon.type === 'Percentage') {
        subtotal = subtotal - ((subtotal * coupon.discount) / 100);
      } else {
        subtotal = subtotal - coupon.discount;
      }
      if (subtotal < 0) subtotal = 0;
      await prisma.coupon.update({ where: { id: coupon.id }, data: { usages: { increment: 1 } } });
    }
  }

  const shippingCost = subtotal > 150 ? 0 : 15;
  const total = subtotal + shippingCost;

  // 2. Generate random order ID and tracking number
  const orderId = 'TM-' + Math.floor(100000 + Math.random() * 900000);
  const trackingNumber = 'TRK' + Math.floor(100000000 + Math.random() * 900000000) + 'US';

  // 3. Estimate delivery: 3 days from now
  const delDate = new Date();
  delDate.setDate(delDate.getDate() + 3);
  const estimatedDelivery = delDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // 4. Save to PostgreSQL database
  const order = await prisma.order.create({
    data: {
      orderId,
      userId,
      status: 'Processing',
      trackingNumber,
      estimatedDelivery,
      subtotal,
      shippingCost,
      total,
      shippingFullName: shippingAddress.fullName,
      shippingAddress: shippingAddress.address,
      shippingCity: shippingAddress.city,
      shippingCountry: shippingAddress.country,
      shippingZipCode: shippingAddress.zipCode,
      shippingPhone: shippingAddress.phone || null,
      paymentStatus: paymentStatus || 'Pending',
      paymentId: paymentId || null,
      items: {
        create: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          type: item.type,
          description: item.description,
          sizeOption: item.options?.size,
          pediatricAddon: item.options?.pediatricAddon || false,
          seniorAddon: item.options?.seniorAddon || false,
        }))
      }
    },
    include: {
      items: true
    }
  });

  // 5. Send Order SMS via Twilio using order's shipping phone
  if (order.shippingPhone) {
    const successMsg = `Thank you for your order! Your TravelMed order ${orderId} has been successfully placed. Status: ${order.status}. Estimated delivery: ${order.estimatedDelivery}.`;
    await twilioService.sendOrderSms(order.shippingPhone, successMsg);
  }

  return order;
};

export const getOrderById = async (orderId) => {
  const order = await prisma.order.findFirst({
    where: {
      OR: [
        { orderId: { equals: orderId, mode: 'insensitive' } },
        { trackingNumber: { equals: orderId, mode: 'insensitive' } }
      ]
    },
    include: {
      items: true
    }
  });

  if (!order) {
    throw new NotFoundError(`Order with ID or tracking number "${orderId}" was not found.`);
  }

  return order;
};

export const getAllOrders = async () => {
  return await prisma.order.findMany({
    include: {
      items: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

export const updateOrderStatus = async (orderId, status) => {
  // Check if exists
  const existingOrder = await getOrderById(orderId);

  const updatedOrder = await prisma.order.update({
    where: { orderId },
    data: { status },
    include: {
      items: true
    }
  });

  if (updatedOrder.shippingPhone) {
    const updateMsg = `Hello! Your TravelMed order ${updatedOrder.orderId} status has been updated to: ${status}.`;
    await twilioService.sendOrderSms(updatedOrder.shippingPhone, updateMsg);
  }

  return updatedOrder;
};
