import prisma from '../config/database.js';
import { BadRequestError } from '../utils/errors.js';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '../config/commerce.js';

const round2 = (n) => Math.round(n * 100) / 100;

/**
 * Prices a cart using ONLY database values. Client-supplied prices are ignored.
 * @param {Array<{productId: string, quantity: number}>} items
 * @param {string} [couponCode]
 */
export const priceCart = async (items, couponCode) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new BadRequestError('Your bag is empty.');
  }

  // Merge duplicate lines for the same product
  const quantities = new Map();
  for (const item of items) {
    const qty = Number(item.quantity);
    if (!item.productId || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      throw new BadRequestError('Invalid item in bag.');
    }
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + qty);
  }

  const products = await prisma.product.findMany({
    where: { OR: [{ id: { in: [...quantities.keys()] } }, { slug: { in: [...quantities.keys()] } }] },
  });

  const lines = [...quantities.entries()].map(([productId, quantity]) => {
    const product = products.find((p) => p.id === productId || p.slug === productId);
    if (!product || product.visibility !== 'Visible') {
      throw new BadRequestError('A product in your bag is no longer available.');
    }
    if (product.status !== 'In Stock' || product.stock < quantity) {
      throw new BadRequestError(`${product.name} is out of stock${product.stock > 0 ? ` (only ${product.stock} left)` : ''}.`);
    }
    return {
      productId: product.id,
      name: product.name,
      description: product.description,
      unitPrice: product.price,
      mrp: product.mrp,
      quantity,
      lineTotal: round2(product.price * quantity),
      consultsIncluded: product.consultsIncluded * quantity,
    };
  });

  const subtotal = round2(lines.reduce((sum, l) => sum + l.lineTotal, 0));
  const mrpTotal = round2(lines.reduce((sum, l) => sum + l.mrp * l.quantity, 0));

  let discount = 0;
  let coupon = null;
  if (couponCode) {
    const found = await prisma.coupon.findUnique({ where: { code: String(couponCode).trim().toUpperCase() } });
    if (!found || found.status !== 'Active') {
      throw new BadRequestError('This promo code is invalid or has expired.');
    }
    discount = found.type === 'Percentage' ? (subtotal * found.discount) / 100 : found.discount;
    discount = round2(Math.min(discount, subtotal));
    coupon = { code: found.code, type: found.type, value: found.discount };
  }

  const afterDiscount = round2(subtotal - discount);
  const shippingCost = afterDiscount >= FREE_SHIPPING_THRESHOLD || afterDiscount === 0 ? 0 : SHIPPING_FEE;
  const total = round2(afterDiscount + shippingCost);

  return {
    lines,
    subtotal,
    mrpTotal,
    savings: round2(mrpTotal - afterDiscount),
    discount,
    coupon,
    shippingCost,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    total,
    consultsIncluded: lines.reduce((sum, l) => sum + l.consultsIncluded, 0),
  };
};
