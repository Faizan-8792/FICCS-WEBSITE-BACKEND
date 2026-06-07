import { Op } from 'sequelize';
import { getEvent } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultEvents } from '../utils/defaultContent.js';

const seedIfEmpty = async () => {
  const Event = getEvent();
  const count = await Event.count();
  if (count === 0) {
    await Event.bulkCreate(defaultEvents);
  }
};

// Fire-and-forget seed — never blocks a GET request. On a fresh DB where the
// write is slow or lacks privileges, awaiting this would hang the request and
// the host would kill the worker (ERR_CONNECTION_RESET).
const seedInBackground = () => {
  seedIfEmpty().catch((err) => console.error('[events] background seed failed:', err.message));
};

export const getEvents = asyncHandler(async (req, res) => {
  const Event = getEvent();
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 15));
  const offset = (page - 1) * limit;

  const { count: total, rows: events } = await Event.findAndCountAll({
    order: [['date', 'ASC']],
    offset,
    limit,
  });

  if (total === 0) seedInBackground();

  res.json({
    events,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

export const getEventById = asyncHandler(async (req, res) => {
  const Event = getEvent();
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  res.json(event);
});

export const getUpcomingEvents = asyncHandler(async (req, res) => {
  const Event = getEvent();
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 6));

  const upcoming = await Event.findAll({
    where: { date: { [Op.gte]: new Date() } },
    order: [['date', 'ASC']],
    limit,
  });

  if (upcoming.length > 0) {
    return res.json(upcoming);
  }

  const recentPast = await Event.findAll({
    where: { date: { [Op.lt]: new Date() } },
    order: [['date', 'DESC']],
    limit,
  });

  if (recentPast.length === 0) seedInBackground();

  res.json(recentPast);
});

export const createEvent = asyncHandler(async (req, res) => {
  const Event = getEvent();
  const event = await Event.create(req.body);
  res.status(201).json(event);
});

export const updateEvent = asyncHandler(async (req, res) => {
  const Event = getEvent();
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  await event.update(req.body);
  res.json(event);
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const Event = getEvent();
  const event = await Event.findByPk(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  await event.destroy();
  res.json({ message: 'Event deleted' });
});
