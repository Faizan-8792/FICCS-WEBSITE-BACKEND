import express from 'express';
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  getUpcomingEvents,
  updateEvent,
} from '../controllers/eventController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/upcoming', getUpcomingEvents);
router
  .route('/')
  .get(getEvents)
  .post(protect, adminOnly, createEvent);
router
  .route('/:id')
  .get(getEventById)
  .put(protect, adminOnly, updateEvent)
  .delete(protect, adminOnly, deleteEvent);

export default router;
