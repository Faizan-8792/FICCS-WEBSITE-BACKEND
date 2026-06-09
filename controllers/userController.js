import { getUser, getEvent, getActivity, getMedia as getMediaModel, getMembership, getContact } from '../models/index.js';
import { Op } from 'sequelize';
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
      memberCode: user.memberCode,
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

/**
 * Assign (or update) a member's FICCS code. Validates format FICCS-YYYY-NN and
 * enforces uniqueness across users. Admin-only.
 */
export const assignMemberCode = asyncHandler(async (req, res) => {
  const User = getUser();
  const { memberCode } = req.body;
  const code = String(memberCode || '').trim().toUpperCase();

  if (!/^FICCS-\d{4}-\d{2,}$/.test(code)) {
    res.status(400);
    throw new Error('Code must look like FICCS-2026-01');
  }

  const user = await User.findByPk(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Enforce uniqueness — no two members share a code.
  const clash = await User.findOne({
    where: { memberCode: code, id: { [Op.ne]: user.id } },
  });
  if (clash) {
    res.status(409);
    throw new Error(`Code ${code} is already assigned to ${clash.name}`);
  }

  user.memberCode = code;
  await user.save();

  res.json({
    message: 'Member code assigned',
    user: { _id: user.id, id: user.id, name: user.name, memberCode: user.memberCode },
  });
});

/**
 * Remove all assigned member codes (clears the code registry / history).
 * This does NOT delete user accounts or revoke membership — it only wipes the
 * `memberCode` field on every user so codes can be re-issued. Reversible by
 * re-assigning. Admin-only.
 */
export const clearAllMemberCodes = asyncHandler(async (req, res) => {
  const User = getUser();
  const [affected] = await User.update(
    { memberCode: null },
    { where: { memberCode: { [Op.ne]: null } } }
  );
  res.json({ message: 'Member code history cleared', cleared: affected });
});

/**
 * Permanently delete ALL member records (approved non-admin user accounts).
 * Destructive + irreversible. Admin accounts are never touched. Admin-only.
 */
export const deleteAllMembers = asyncHandler(async (req, res) => {
  const User = getUser();
  const deleted = await User.destroy({
    where: { role: 'user', status: 'approved' },
  });
  res.json({ message: 'All member records deleted', deleted });
});

/**
 * Suggest the next available member code for the current year, format
 * FICCS-YYYY-NN. Scans existing codes for the year and returns max+1.
 */
export const suggestMemberCode = asyncHandler(async (req, res) => {
  const User = getUser();
  const year = new Date().getFullYear();
  const prefix = `FICCS-${year}-`;

  const users = await User.findAll({
    where: { memberCode: { [Op.like]: `${prefix}%` } },
    attributes: ['memberCode'],
  });

  let max = 0;
  for (const u of users) {
    const tail = String(u.memberCode).slice(prefix.length);
    const n = parseInt(tail, 10);
    if (Number.isInteger(n) && n > max) max = n;
  }

  const next = String(max + 1).padStart(2, '0');
  res.json({ suggestion: `${prefix}${next}`, year, nextNumber: max + 1 });
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
