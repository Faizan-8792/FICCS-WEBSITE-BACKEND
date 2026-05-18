import express from 'express';
import {
  approveUser,
  getDashboardOverview,
  getPendingUsers,
  getUsers,
  revokeUser,
} from '../controllers/userController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);
router.get('/', getUsers);
router.get('/pending', getPendingUsers);
router.get('/stats/overview', getDashboardOverview);
router.patch('/:id/approve', approveUser);
router.patch('/:id/revoke', revokeUser);

export default router;
