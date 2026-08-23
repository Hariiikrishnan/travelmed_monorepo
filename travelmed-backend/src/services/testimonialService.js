import prisma from '../config/database.js';

export const getAll = async () => {
  return await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' }
  });
};

export const create = async (data) => {
  return await prisma.testimonial.create({
    data
  });
};

export const update = async (id, data) => {
  return await prisma.testimonial.update({
    where: { id },
    data
  });
};
