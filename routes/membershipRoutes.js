import express from 'express';
import {
  getMemberships,
  submitMembership,
} from '../controllers/membershipController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitMembership);
router.get('/', protect, adminOnly, getMemberships);

export default router;
