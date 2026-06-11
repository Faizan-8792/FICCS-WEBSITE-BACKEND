import express from 'express';
import {
  approveUser,
  assignMemberCode,
  autoAssignMemberCodes,
  clearAllMemberCodes,
  deleteAllMembers,
  deleteUser,
  getDashboardOverview,
  getPendingUsers,
  getUsers,
  revokeUser,
  setUserRole,
  suggestMemberCode,
} from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);
router.get('/', getUsers);
router.get('/pending', getPendingUsers);
router.get('/stats/overview', getDashboardOverview);
router.get('/member-code/suggest', suggestMemberCode);
router.post('/member-code/auto-assign', autoAssignMemberCodes);
router.delete('/member-code/all', clearAllMemberCodes);
router.delete('/members/all', deleteAllMembers);
router.patch('/:id/approve', approveUser);
router.patch('/:id/revoke', revokeUser);
router.patch('/:id/role', setUserRole);
router.patch('/:id/member-code', assignMemberCode);
router.delete('/:id', deleteUser);

export default router;
