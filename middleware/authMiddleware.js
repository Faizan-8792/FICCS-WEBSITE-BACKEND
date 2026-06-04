import jwt from 'jsonwebtoken';
import { getUser } from '../models/index.js';
import { asyncHandler } from './asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const User = getUser();
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  req.user = user;
  next();
});

export const adminOnly = asyncHandler((req, res, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403);
    throw new Error('Admin access required');
  }

  next();
});

export const memberOnly = asyncHandler((req, res, next) => {
  const user = req.user;
  if (!user) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const isMember = user.role === 'admin' || user.status === 'approved';
  if (!isMember) {
    res.status(403);
    throw new Error('FICCS membership required');
  }

  next();
});
