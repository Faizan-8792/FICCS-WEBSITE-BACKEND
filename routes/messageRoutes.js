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

// Any logged-in user can fetch their messages. Visibility (all / members /
// selective) is enforced per-message inside the controller, so non-members
// still receive broadcasts addressed to them.
router.get('/', protect, getMessages);
// Static routes MUST come before parameterized routes
router.patch('/read-all', protect, markAllMessagesRead);
router.patch('/:id/read', protect, markMessageRead);
router.delete('/:id/dismiss', protect, dismissMessage);

// Admin only
router.post('/', protect, adminOnly, sendMessage);
router.delete('/:id', protect, adminOnly, deleteMessage);

export default router;
