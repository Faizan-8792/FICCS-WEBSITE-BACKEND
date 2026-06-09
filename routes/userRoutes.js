import express from 'express';
import {
  approveUser,
  assignMemberCode,
  clearAllMemberCodes,
  getDashboardOverview,
  getPendingUsers,
  getUsers,
  revokeUser,
  suggestMemberCode,
} from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);
router.get('/', getUsers);
router.get('/pending', getPendingUsers);
router.get('/stats/overview', getDashboardOverview);
router.get('/member-code/suggest', suggestMemberCode);
router.delete('/member-code/all', clearAllMemberCodes);
router.patch('/:id/approve', approveUser);
router.patch('/:id/revoke', revokeUser);
router.patch('/:id/member-code', assignMemberCode);

export default router;
