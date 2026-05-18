import express from 'express';
import {
  deleteMessage,
  dismissMessage,
  getMessages,
  markAllMessagesRead,
  markMessageRead,
  sendMessage,
} from '../controllers/messageController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authenticated users
router.get('/', protect, getMessages);
// Static routes MUST come before parameterized routes
router.patch('/read-all', protect, markAllMessagesRead);
router.patch('/:id/read', protect, markMessageRead);
router.delete('/:id/dismiss', protect, dismissMessage);

// Admin only
router.post('/', protect, adminOnly, sendMessage);
router.delete('/:id', protect, adminOnly, deleteMessage);

export default router;
