import * as medicineService from '../services/medicineService.js';

export const getAll = async (req, res, next) => {
  try {
    const { search } = req.query;
    const medicines = await medicineService.getAll(search);

    return res.status(200).json({
      success: true,
      data: medicines
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicine = await medicineService.getById(id);

    return res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const medicine = await medicineService.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Medicine created successfully',
      data: medicine
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const medicine = await medicineService.update(id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Medicine updated successfully',
      data: medicine
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await medicineService.remove(id);

    return res.status(200).json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
