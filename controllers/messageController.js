import { Op } from 'sequelize';
import { getMessage, getUser, getUserMessageState } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const VALID_AUDIENCES = ['all', 'members', 'selective'];

const toIdArray = (raw) => {
  if (Array.isArray(raw)) return raw.map(Number).filter((n) => Number.isInteger(n) && n > 0);
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.map(Number).filter(Boolean) : [];
    } catch {
      return [];
    }
  }
  return [];
};

/**
 * Decide whether a message is visible to a given user.
 *  - all        → every logged-in user (members + non-members)
 *  - members    → approved members and admins
 *  - selective  → only users whose id is in recipientIds
 * Admins always see everything they sent (and all broadcasts).
 */
const isVisibleTo = (message, user) => {
  const audience = message.audience || 'all';
  if (user.role === 'admin') return true;
  if (audience === 'all') return true;
  if (audience === 'members') return user.status === 'approved';
  if (audience === 'selective') return toIdArray(message.recipientIds).includes(user.id);
  return false;
};

export const sendMessage = asyncHandler(async (req, res) => {
  const Message = getMessage();
  const User = getUser();
  const { title, body } = req.body;
  const audience = VALID_AUDIENCES.includes(req.body.audience) ? req.body.audience : 'all';

  if (!title?.trim() || !body?.trim()) {
    res.status(400);
    throw new Error('Title and body are required');
  }

  let recipientIds = [];
  if (audience === 'selective') {
    recipientIds = toIdArray(req.body.recipientIds);
    if (recipientIds.length === 0) {
      res.status(400);
      throw new Error('Select at least one recipient for a selective message');
    }
    // Keep only ids that map to real users.
    const found = await User.findAll({
      where: { id: { [Op.in]: recipientIds } },
      attributes: ['id'],
    });
    recipientIds = found.map((u) => u.id);
    if (recipientIds.length === 0) {
      res.status(400);
      throw new Error('No valid recipients found');
    }
  }

  const message = await Message.create({
    title: title.trim(),
    body: body.trim(),
    sentBy: req.user.id,
    audience,
    recipientIds,
  });

  res.status(201).json(message);
});

export const getMessages = asyncHandler(async (req, res) => {
  const Message = getMessage();
  const UserMessageState = getUserMessageState();
  const user = req.user;

  const [messages, states] = await Promise.all([
    Message.findAll({ order: [['createdAt', 'DESC']], limit: 100 }),
    UserMessageState.findAll({ where: { userId: user.id } }),
  ]);

  const stateMap = {};
  states.forEach((s) => {
    stateMap[s.messageId] = s;
  });

  const result = messages
    .filter((m) => isVisibleTo(m, user))
    .filter((m) => !stateMap[m.id]?.dismissed)
    .map((m) => ({
      ...m.toJSON(),
      read: Boolean(stateMap[m.id]?.read),
    }));

  res.json(result);
});

export const markMessageRead = asyncHandler(async (req, res) => {
  const UserMessageState = getUserMessageState();
  const { id } = req.params;
  const userId = req.user.id;

  await UserMessageState.upsert({ userId, messageId: id, read: true });

  res.json({ success: true });
});

export const markAllMessagesRead = asyncHandler(async (req, res) => {
  const Message = getMessage();
  const UserMessageState = getUserMessageState();
  const user = req.user;

  const messages = await Message.findAll();
  const visible = messages.filter((m) => isVisibleTo(m, user));

  await Promise.all(
    visible.map((m) => UserMessageState.upsert({ userId: user.id, messageId: m.id, read: true }))
  );

  res.json({ success: true });
});

export const dismissMessage = asyncHandler(async (req, res) => {
  const UserMessageState = getUserMessageState();
  const { id } = req.params;
  const userId = req.user.id;

  await UserMessageState.upsert({ userId, messageId: id, dismissed: true, read: true });

  res.json({ success: true });
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const Message = getMessage();
  const UserMessageState = getUserMessageState();

  const message = await Message.findByPk(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  await UserMessageState.destroy({ where: { messageId: req.params.id } });
  await message.destroy();
  res.json({ message: 'Deleted' });
});
