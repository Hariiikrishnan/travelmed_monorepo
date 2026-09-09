import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';

export const getAll = async (search) => {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { activeIngredient: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } },
          { symptoms: { hasSome: [search] } } // search in symptoms array!
        ]
      }
    : {};

  return await prisma.medicine.findMany({
    where,
    orderBy: { name: 'asc' }
  });
};

export const getById = async (id) => {
  const medicine = await prisma.medicine.findUnique({
    where: { id }
  });

  if (!medicine) {
    throw new NotFoundError(`Medicine with ID "${id}" was not found.`);
  }

  return medicine;
};

export const create = async (data) => {
  return await prisma.medicine.create({
    data
  });
};

export const update = async (id, data) => {
  // Check if exists
  await getById(id);

  return await prisma.medicine.update({
    where: { id },
    data
  });
};

export const remove = async (id) => {
  await getById(id);

  return await prisma.medicine.delete({
    where: { id }
  });
};
