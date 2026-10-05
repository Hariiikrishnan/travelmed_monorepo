import * as orderService from '../services/orderService.js';
import { priceCart } from '../services/pricingService.js';
import { quoteSchema } from '../validators/orderValidator.js';
import { BadRequestError } from '../utils/errors.js';
import { ORDER_STATUSES } from '../config/commerce.js';

/** Server-calculated totals for the bag — what the customer will actually be charged. */
export const quote = async (req, res, next) => {
  try {
    const { items, couponCode } = quoteSchema.parse(req.body);
    const result = await priceCart(items, couponCode);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/** Public order tracking — returns no address, phone or email. */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getPublicTracking(req.params.orderId);
    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status || !ORDER_STATUSES.includes(status)) {
      throw new BadRequestError(`Invalid status. Must be one of: ${ORDER_STATUSES.join(', ')}`);
    }

    const order = await orderService.updateOrderStatus(orderId, status);
    return res.status(200).json({
      success: true,
      message: `Order status updated to "${status}" successfully`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
