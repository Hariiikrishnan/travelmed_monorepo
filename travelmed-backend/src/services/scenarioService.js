import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const getAll = async () => {
  return await prisma.travelScenario.findMany({
    orderBy: { title: 'asc' }
  });
};

export const getById = async (id) => {
  const scenario = await prisma.travelScenario.findUnique({
    where: { id }
  });

  if (!scenario) {
    throw new NotFoundError(`Travel scenario with ID "${id}" was not found.`);
  }

  return scenario;
};

export const create = async (data) => {
  return await prisma.travelScenario.create({
    data
  });
};

export const update = async (id, data) => {
  await getById(id);

  return await prisma.travelScenario.update({
    where: { id },
    data
  });
};

export const remove = async (id) => {
  await getById(id);

  return await prisma.travelScenario.delete({
    where: { id }
  });
};
