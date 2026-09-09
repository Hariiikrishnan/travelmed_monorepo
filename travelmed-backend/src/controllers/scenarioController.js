import * as scenarioService from '../services/scenarioService.js';

export const getAll = async (req, res, next) => {
  try {
    const scenarios = await scenarioService.getAll();
    return res.status(200).json({
      success: true,
      data: scenarios
    });
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scenario = await scenarioService.getById(id);
    return res.status(200).json({
      success: true,
      data: scenario
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const scenario = await scenarioService.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Travel scenario created successfully',
      data: scenario
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scenario = await scenarioService.update(id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Travel scenario updated successfully',
      data: scenario
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await scenarioService.remove(id);
    return res.status(200).json({
      success: true,
      message: 'Travel scenario deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
