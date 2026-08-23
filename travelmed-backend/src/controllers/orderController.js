import * as orderService from '../services/orderService.js';
import { createOrderSchema } from '../validators/orderValidator.js';
import { BadRequestError } from '../utils/errors.js';

export const createOrder = async (req, res, next) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const userId = req.user?.id || null;
    const order = await orderService.createOrder(validatedData, userId);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await orderService.getOrderById(orderId);

    // Format the response items structure to match what the frontend expects
    const formattedOrder = {
      orderId: order.orderId,
      status: order.status,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total,
      shippingAddress: {
        fullName: order.shippingFullName,
        address: order.shippingAddress,
        city: order.shippingCity,
        country: order.shippingCountry,
        zipCode: order.shippingZipCode,
        phone: order.shippingPhone
      },
      items: order.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        type: item.type,
        description: item.description,
        options: {
          size: item.sizeOption,
          pediatricAddon: item.pediatricAddon,
          seniorAddon: item.seniorAddon
        }
      }))
    };

    return res.status(200).json({
      success: true,
      data: formattedOrder
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Refunded'];
    if (!status || !allowedStatuses.includes(status)) {
      throw new BadRequestError(`Invalid status. Must be one of: ${allowedStatuses.join(', ')}`);
    }

    const order = await orderService.updateOrderStatus(orderId, status);
    return res.status(200).json({
      success: true,
      message: `Order status updated to "${status}" successfully`,
      data: order
    });
  } catch (error) {
    next(error);
  }
};
