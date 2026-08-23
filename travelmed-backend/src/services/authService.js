import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { ConflictError, UnauthorizedError } from '../utils/errors.js';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev-jwt-secret-key-12345', {
    expiresIn: '7d'
  });
};

export const register = async ({ email, password, name, role = 'admin' }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new ConflictError('A user with this email address already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });

  const token = signToken(user.id);

  return { user, token };
};

export const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new UnauthorizedError('Incorrect email or password.');
  }

  const token = signToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token
  };
};
