import prisma from '../config/database.js';
import { NotFoundError, BadRequestError } from '../utils/errors.js';

export const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.params;
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      throw new NotFoundError('Invalid coupon code');
    }

    if (coupon.status !== 'Active') {
      throw new BadRequestError('This coupon is no longer active');
    }

    return res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (err) {
    next(err);
  }
};

export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({
      success: true,
      data: coupons
    });
  } catch (err) {
    next(err);
  }
};

export const createCoupon = async (req, res, next) => {
  try {
    const { code, discount, type } = req.body;
    
    if (!code || !discount) {
      throw new BadRequestError('Code and discount amount are required');
    }

    const existing = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (existing) {
      throw new BadRequestError('Coupon code already exists');
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount,
        type: type || 'Percentage',
        status: 'Active',
        usages: 0
      }
    });

    return res.status(201).json({
      success: true,
      data: coupon
    });
  } catch (err) {
    next(err);
  }
};

export const updateCouponStatus = async (req, res, next) => {
  try {
    const { code } = req.params;
    const { status } = req.body;

    if (!status || !['Active', 'Inactive'].includes(status)) {
      throw new BadRequestError('Invalid status. Must be Active or Inactive.');
    }

    const coupon = await prisma.coupon.update({
      where: { code: code.toUpperCase() },
      data: { status }
    });

    return res.status(200).json({
      success: true,
      data: coupon
    });
  } catch (err) {
    next(err);
  }
};
