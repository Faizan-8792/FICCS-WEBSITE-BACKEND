import express from 'express';
import {
  deleteMessage,
  dismissMessage,
  getMessages,
  markAllMessagesRead,
  markMessageRead,
  sendMessage,
} from '../controllers/messageController.js';
import { adminOnly, memberOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Approved members and admins only — non-members get 403 so the UI can show
// a locked state with an "Apply for membership" CTA.
router.get('/', protect, memberOnly, getMessages);
// Static routes MUST come before parameterized routes
router.patch('/read-all', protect, memberOnly, markAllMessagesRead);
router.patch('/:id/read', protect, memberOnly, markMessageRead);
router.delete('/:id/dismiss', protect, memberOnly, dismissMessage);

// Admin only
router.post('/', protect, adminOnly, sendMessage);
router.delete('/:id', protect, adminOnly, deleteMessage);

export default router;
