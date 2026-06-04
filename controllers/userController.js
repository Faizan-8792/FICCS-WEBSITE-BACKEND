import { getUser, getEvent, getActivity, getMedia as getMediaModel, getMembership, getContact } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const User = getUser();
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });
  res.json(users);
});

export const getPendingUsers = asyncHandler(async (req, res) => {
  const User = getUser();
  const users = await User.findAll({
    where: { role: 'user', status: 'pending' },
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']],
  });
  res.json(users);
});

export const approveUser = asyncHandler(async (req, res) => {
  const User = getUser();
  const user = await User.findByPk(req.params.id);

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
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      approvedAt: user.approvedAt,
    },
  });
});

export const revokeUser = asyncHandler(async (req, res) => {
  const User = getUser();
  const user = await User.findByPk(req.params.id);

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
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      approvedAt: user.approvedAt,
    },
  });
});

export const getDashboardOverview = asyncHandler(async (req, res) => {
  const User = getUser();
  const Event = getEvent();
  const Activity = getActivity();
  const Media = getMediaModel();
  const Membership = getMembership();
  const Contact = getContact();

  const [pendingUsers, events, activities, media, memberships, contacts, latestUsers] =
    await Promise.all([
      User.count({ where: { role: 'user', status: 'pending' } }),
      Event.count(),
      Activity.count(),
      Media.count(),
      Membership.count(),
      Contact.count(),
      User.findAll({
        attributes: { exclude: ['password'] },
        order: [['createdAt', 'DESC']],
        limit: 5,
      }),
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
