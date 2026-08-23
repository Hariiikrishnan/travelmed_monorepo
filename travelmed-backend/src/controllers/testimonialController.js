import * as testimonialService from '../services/testimonialService.js';

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
    const testimonialData = {
      ...req.body,
      id: crypto.randomUUID()
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
