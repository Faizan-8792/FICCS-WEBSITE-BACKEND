import express from 'express';
import {
  getHomeContent,
  updateHomeContent,
} from '../controllers/homeContentController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getHomeContent);
router.put('/', protect, adminOnly, updateHomeContent);

export default router;
