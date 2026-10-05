import crypto from 'crypto';
import * as doctorService from '../services/doctorService.js';
import { doctorSchema } from '../validators/doctorValidator.js';

/** Public: active doctors only. */
export const getAll = async (req, res, next) => {
  try {
    const doctors = (await doctorService.getAll()).filter((d) => d.status !== 'Inactive');
    return res.status(200).json({
      success: true,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

/** Admin: every doctor including inactive. */
export const getAllAdmin = async (req, res, next) => {
  try {
    const doctors = await doctorService.getAll();
    return res.status(200).json({
      success: true,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await doctorService.getById(id);
    return res.status(200).json({
      success: true,
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const data = doctorSchema.parse(req.body);
    const doctor = await doctorService.create({
      id: 'doc-' + crypto.randomBytes(4).toString('hex'),
      rating: 0,
      reviewsCount: 0,
      videoSimulatedUrl: '',
      ...data,
    });
    return res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const doctor = await doctorService.update(id, doctorSchema.parse(req.body));
    return res.status(200).json({
      success: true,
      message: 'Doctor updated successfully',
      data: doctor
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await doctorService.remove(id);
    return res.status(200).json({
      success: true,
      message: 'Doctor deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
