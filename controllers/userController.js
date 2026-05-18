import Activity from '../models/Activity.js';
import Contact from '../models/Contact.js';
import Event from '../models/Event.js';
import Media from '../models/Media.js';
import Membership from '../models/Membership.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

export const getPendingUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user', status: 'pending' })
    .select('-password')
    .sort({ createdAt: -1 });
  res.json(users);
});

export const approveUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role !== 'user') {
    res.status(400);
    throw new Error('Only regular user accounts can be promoted to member');
  }

  user.status = 'approved';
  user.approvedAt = new Date();
  await user.save();

  res.json({
    message: 'User promoted to member',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      approvedAt: user.approvedAt,
    },
  });
});

export const revokeUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role !== 'user') {
    res.status(400);
    throw new Error('Cannot revoke admin accounts');
  }

  user.status = 'pending';
  user.approvedAt = null;
  await user.save();

  res.json({
    message: 'Member status revoked',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      approvedAt: user.approvedAt,
    },
  });
});

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const [pendingUsers, events, activities, media, memberships, contacts, latestUsers] =
    await Promise.all([
      User.countDocuments({ role: 'user', status: 'pending' }),
      Event.countDocuments(),
      Activity.countDocuments(),
      Media.countDocuments(),
      Membership.countDocuments(),
      Contact.countDocuments(),
      User.find().select('-password').sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({
    metrics: [
      { label: 'Non-Members', value: pendingUsers },
      { label: 'Events', value: events },
      { label: 'Activities', value: activities },
      { label: 'Media Items', value: media },
      { label: 'Membership Leads', value: memberships },
      { label: 'Contact Messages', value: contacts },
    ],
    latestUsers,
  });
});
