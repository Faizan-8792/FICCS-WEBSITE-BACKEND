import { Router } from 'express';
import {
  getMembershipPageContent,
  updateMembershipPageContent,
} from '../controllers/membershipPageContentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getMembershipPageContent);
router.put('/', protect, adminOnly, updateMembershipPageContent);

export default router;
