import { getMessage, getUserMessageState } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const sendMessage = asyncHandler(async (req, res) => {
  const Message = getMessage();
  const { title, body } = req.body;

  if (!title?.trim() || !body?.trim()) {
    res.status(400);
    throw new Error('Title and body are required');
  }

  const message = await Message.create({
    title: title.trim(),
    body: body.trim(),
    sentBy: req.user.id,
    audience: 'all',
  });

  res.status(201).json(message);
});

export const getMessages = asyncHandler(async (req, res) => {
  const Message = getMessage();
  const UserMessageState = getUserMessageState();
  const userId = req.user.id;

  const [messages, states] = await Promise.all([
    Message.findAll({ where: { audience: 'all' }, order: [['createdAt', 'DESC']], limit: 50 }),
    UserMessageState.findAll({ where: { userId } }),
  ]);

  const stateMap = {};
  states.forEach((s) => {
    stateMap[s.messageId] = s;
  });

  const result = messages
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
  const userId = req.user.id;

  const messages = await Message.findAll({ where: { audience: 'all' }, attributes: ['id'] });

  await Promise.all(
    messages.map((m) =>
      UserMessageState.upsert({ userId, messageId: m.id, read: true })
    )
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
