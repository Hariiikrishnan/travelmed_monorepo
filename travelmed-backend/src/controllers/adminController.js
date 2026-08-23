import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import crypto from 'crypto';

export const getAdmins = async (req, res, next) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'admin' },
      select: { id: true, name: true, email: true, createdAt: true, role: true }
    });
    return res.status(200).json({ success: true, data: admins });
  } catch (err) {
    next(err);
  }
};

export const promoteToAdmin = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    
    // Check if user already exists
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (user) {
      if (user.role === 'admin') {
         return res.status(400).json({ success: false, message: 'User is already an admin.' });
      }
      user = await prisma.user.update({
        where: { email },
        data: { role: 'admin' }
      });
    } else {
      // Create new Admin
      // WARNING: Production implementations MUST use bcrypt (hash middleware usually handles this but we will just pass standard payload since user creation hashes in authController usually, we will mimic that or do it here)
      // Since this is purely for the dashboard visualization without blowing scope, we will store standard. The proper way is registering in auth controller and updating role.
      return res.status(400).json({ success: false, message: 'Admin creation requires existing user. Please register the user through standard channels first!' });
    }
    
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const revokeAdmin = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'user' }
    });
    return res.status(200).json({ success: true, message: 'Admin revoked successfully' });
  } catch (err) {
    next(err);
  }
};
