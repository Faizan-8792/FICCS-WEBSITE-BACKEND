import express from 'express';
import { handleChatMessage } from '../controllers/chatbotController.js';

const router = express.Router();

// Public endpoint — no auth required so all visitors can use the chatbot
router.post('/', handleChatMessage);

export default router;
