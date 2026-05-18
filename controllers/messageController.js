import Message from '../models/Message.js';
import UserMessageState from '../models/UserMessageState.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

// Admin: send a broadcast message
export const sendMessage = asyncHandler(async (req, res) => {
  const { title, body } = req.body;

  if (!title?.trim() || !body?.trim()) {
    res.status(400);
    throw new Error('Title and body are required');
  }

  const message = await Message.create({
    title: title.trim(),
    body: body.trim(),
    sentBy: req.user._id,
    audience: 'all',
  });

  res.status(201).json(message);
});

// Authenticated: get messages with per-user read/dismissed state
export const getMessages = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [messages, states] = await Promise.all([
    Message.find({ audience: 'all' }).sort({ createdAt: -1 }).limit(50).lean(),
    UserMessageState.find({ user: userId }).lean(),
  ]);

  // Build a map of messageId → state
  const stateMap = {};
  states.forEach((s) => {
    stateMap[String(s.message)] = s;
  });

  // Filter out dismissed messages and attach read status
  const result = messages
    .filter((m) => !stateMap[String(m._id)]?.dismissed)
    .map((m) => ({
      ...m,
      read: Boolean(stateMap[String(m._id)]?.read),
    }));

  res.json(result);
});

// Authenticated: mark a message as read
export const markMessageRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  await UserMessageState.findOneAndUpdate(
    { user: userId, message: id },
    { read: true },
    { upsert: true, new: true }
  );

  res.json({ success: true });
});

// Authenticated: mark all messages as read
export const markAllMessagesRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const messages = await Message.find({ audience: 'all' }).select('_id').lean();

  await Promise.all(
    messages.map((m) =>
      UserMessageState.findOneAndUpdate(
        { user: userId, message: m._id },
        { read: true },
        { upsert: true }
      )
    )
  );

  res.json({ success: true });
});

// Authenticated: dismiss (delete from user's view) a message
export const dismissMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  await UserMessageState.findOneAndUpdate(
    { user: userId, message: id },
    { dismissed: true, read: true },
    { upsert: true }
  );

  res.json({ success: true });
});

// Admin: permanently delete a message for everyone
export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }
  // Clean up all user states for this message
  await UserMessageState.deleteMany({ message: req.params.id });
  res.json({ message: 'Deleted' });
});
