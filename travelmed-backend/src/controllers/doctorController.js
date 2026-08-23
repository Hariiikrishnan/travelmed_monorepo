import * as doctorService from '../services/doctorService.js';

export const getAll = async (req, res, next) => {
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
    const doctor = await doctorService.create(req.body);
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
    const doctor = await doctorService.update(id, req.body);
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
