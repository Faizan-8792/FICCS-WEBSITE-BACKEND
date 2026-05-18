import express from 'express';
import {
  getContactPageContent,
  getContacts,
  submitContact,
  updateContactPageContent,
} from '../controllers/contactController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/content', getContactPageContent);
router.put('/content', protect, adminOnly, updateContactPageContent);
router.post('/', submitContact);
router.get('/', protect, adminOnly, getContacts);

export default router;
