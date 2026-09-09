import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const getAll = async () => {
  return await prisma.doctor.findMany({
    orderBy: { name: 'asc' }
  });
};

export const getById = async (id) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id }
  });

  if (!doctor) {
    throw new NotFoundError(`Doctor with ID "${id}" was not found.`);
  }

  return doctor;
};

export const create = async (data) => {
  return await prisma.doctor.create({
    data
  });
};

export const update = async (id, data) => {
  await getById(id);

  return await prisma.doctor.update({
    where: { id },
    data
  });
};

export const remove = async (id) => {
  await getById(id);

  return await prisma.doctor.delete({
    where: { id }
  });
};
