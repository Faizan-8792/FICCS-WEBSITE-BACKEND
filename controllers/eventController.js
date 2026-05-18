import Event from '../models/Event.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultEvents } from '../utils/defaultContent.js';

export const getEvents = asyncHandler(async (req, res) => {
  let events = await Event.find().sort({ date: 1 });
  if (!events.length) {
    await Event.insertMany(defaultEvents);
    events = await Event.find().sort({ date: 1 });
  }
  res.json(events);
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
  const limit = Number(req.query.limit) || 6;
  let events = await Event.find({ date: { $gte: new Date() } })
    .sort({ date: 1 })
    .limit(limit);
  if (!events.length) {
    await Event.insertMany(defaultEvents);
    events = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(limit);
  }
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
