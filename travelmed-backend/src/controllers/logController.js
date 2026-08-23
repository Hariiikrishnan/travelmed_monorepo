import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllLogs = async (req, res, next) => {
  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to 50 recent logs for dashboard UI
    });
    return res.status(200).json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};

export const createLog = async (req, res, next) => {
  try {
    const { action, changes } = req.body;
    if (!action || !changes) {
      return res.status(400).json({ success: false, message: 'Action and changes are required' });
    }
    const user = req.user?.name || 'System Admin';
    const log = await prisma.activityLog.create({
      data: { user, action, changes }
    });
    return res.status(201).json({ success: true, data: log });
  } catch (err) {
    next(err);
  }
};
