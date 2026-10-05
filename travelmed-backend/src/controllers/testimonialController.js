import * as testimonialService from '../services/testimonialService.js';

export const getApproved = async (req, res, next) => {
  try {
    const testimonials = await testimonialService.getApproved();
    return res.status(200).json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const testimonials = await testimonialService.getAll();
    return res.status(200).json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};

import crypto from 'crypto';

export const create = async (req, res, next) => {
  try {
    const { name, location, tripType, quote, rating, avatar } = req.body;
    const testimonialData = {
      id: crypto.randomUUID(),
      name: String(name ?? '').slice(0, 80),
      location: String(location ?? '').slice(0, 80),
      tripType: String(tripType ?? '').slice(0, 80),
      quote: String(quote ?? '').slice(0, 1000),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      avatar: String(avatar ?? '').slice(0, 300),
      status: 'Pending' // every new review waits for admin approval
    };
    const testimonial = await testimonialService.create(testimonialData);
    return res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const t = await testimonialService.update(id, { status });
    res.status(200).json({ success: true, data: t });
  } catch (err) { next(err); }
};

export const updateReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const t = await testimonialService.update(id, { reply });
    res.status(200).json({ success: true, data: t });
  } catch (err) { next(err); }
};
