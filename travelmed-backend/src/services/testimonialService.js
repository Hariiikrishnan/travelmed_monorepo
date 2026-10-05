import prisma from '../config/database.js';

/** Public: only reviews an admin has approved. */
export const getApproved = async () => {
  return await prisma.testimonial.findMany({
    where: { status: 'Approved' },
    orderBy: { createdAt: 'desc' }
  });
};

/** Admin moderation: every review regardless of status. */
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
