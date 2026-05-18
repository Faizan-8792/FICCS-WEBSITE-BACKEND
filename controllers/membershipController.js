import Membership from '../models/Membership.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const submitMembership = asyncHandler(async (req, res) => {
  const { name, email, details } = req.body;

  if (!name || !email || !details) {
    res.status(400);
    throw new Error('All membership fields are required');
  }

  const membership = await Membership.create({ name, email, details });
  res.status(201).json(membership);
});

export const getMemberships = asyncHandler(async (req, res) => {
  const memberships = await Membership.find().sort({ createdAt: -1 });
  res.json(memberships);
});
