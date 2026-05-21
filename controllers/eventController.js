import Event from '../models/Event.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultEvents } from '../utils/defaultContent.js';

/** Seed default events when the collection is empty. */
const seedIfEmpty = async () => {
  const count = await Event.countDocuments();
  if (count === 0) {
    await Event.insertMany(defaultEvents);
  }
};

export const getEvents = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 15));
  const skip = (page - 1) * limit;

  await seedIfEmpty();

  const [total, events] = await Promise.all([
    Event.countDocuments(),
    Event.find().sort({ date: 1 }).skip(skip).limit(limit),
  ]);

  res.json({
    events,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.json(event);
});

export const getUpcomingEvents = asyncHandler(async (req, res) => {
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 6));

  await seedIfEmpty();

  const events = await Event.find({ date: { $gte: new Date() } })
    .sort({ date: 1 })
    .limit(limit);

  res.json(events);
});

export const createEvent = asyncHandler(async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.json(event);
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.json({ message: 'Event deleted' });
});
