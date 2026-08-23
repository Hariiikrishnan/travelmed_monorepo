import prisma from '../config/database.js';

export const getAll = async (req, res, next) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json({ success: true, data: tickets });
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const ticket = await prisma.supportTicket.create({ data: req.body });
    return res.status(201).json({ success: true, data: ticket });
  } catch (err) { next(err); }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ticket = await prisma.supportTicket.update({
      where: { id }, data: { status }
    });
    return res.status(200).json({ success: true, data: ticket });
  } catch (err) { next(err); }
};

export const updateReply = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;
    const ticket = await prisma.supportTicket.update({
      where: { id }, data: { reply, status: 'Solved' }
    });
    return res.status(200).json({ success: true, data: ticket });
  } catch (err) { next(err); }
};
