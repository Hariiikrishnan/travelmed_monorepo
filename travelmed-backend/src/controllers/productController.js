import * as productService from '../services/productService.js';
import { productSchema, productUpdateSchema } from '../validators/productValidator.js';
import { publicCommerceConfig } from '../config/commerce.js';
import { revalidateWebsite } from '../utils/revalidateWebsite.js';
import prisma from '../config/database.js';

const withCommerce = (product) => ({ ...product, commerce: publicCommerceConfig() });


const logChange = (req, action, changes) =>
  prisma.activityLog
    .create({ data: { user: req.user?.name || 'System Admin', action, changes } })
    .catch(() => {});

export const listPublic = async (req, res, next) => {
  try {
    const products = await productService.getVisible();
    res.status(200).json({ success: true, data: products.map(withCommerce) });
  } catch (err) {
    next(err);
  }
};

export const getPublic = async (req, res, next) => {
  try {
    const product = await productService.getPublic(req.params.idOrSlug);
    res.status(200).json({ success: true, data: withCommerce(product) });
  } catch (err) {
    next(err);
  }
};

export const listAll = async (req, res, next) => {
  try {
    const products = await productService.getAll();
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = productSchema.parse(req.body);
    const product = await productService.create(data);
    await logChange(req, 'Product Created', `${product.name} · ₹${product.price}`);
    await revalidateWebsite('product');
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const update = async (req, res, next) => {
  try {
    const parsed = productUpdateSchema.parse(req.body);
    // Only change fields the client actually sent, so schema defaults never wipe existing values
    const data = Object.fromEntries(Object.entries(parsed).filter(([key]) => key in req.body));
    const before = await productService.getById(req.params.id);
    const product = await productService.update(req.params.id, data);
    const priceNote =
      before.price !== product.price || before.mrp !== product.mrp
        ? ` · price ₹${before.price} → ₹${product.price}, MRP ₹${before.mrp} → ₹${product.mrp}`
        : '';
    const contentsNote =
      data.items && before.counts.medicines !== product.counts.medicines
        ? ` · contents ${before.counts.medicines} → ${product.counts.medicines} medicines`
        : '';
    await logChange(req, 'Product Updated', `${product.name}${priceNote}${contentsNote}`);
    await revalidateWebsite('product');
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const remove = async (req, res, next) => {
  try {
    const product = await productService.remove(req.params.id);
    await logChange(req, 'Product Deleted', product.name);
    await revalidateWebsite('product');
    res.status(200).json({ success: true, data: { id: product.id } });
  } catch (err) {
    next(err);
  }
};
