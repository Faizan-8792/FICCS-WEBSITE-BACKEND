import express from 'express';
import {
  createActivity,
  deleteActivity,
  getActivityById,
  getActivities,
  updateActivity,
} from '../controllers/activityController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getActivities)
  .post(protect, adminOnly, createActivity);
router
  .route('/:id')
  .get(getActivityById)
  .put(protect, adminOnly, updateActivity)
  .delete(protect, adminOnly, deleteActivity);

export default router;
