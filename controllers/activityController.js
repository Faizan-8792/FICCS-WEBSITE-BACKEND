import Activity from '../models/Activity.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultActivities } from '../utils/defaultContent.js';

export const getActivities = asyncHandler(async (req, res) => {
  let activities = await Activity.find().sort({ createdAt: -1 });
  if (!activities.length) {
    await Activity.insertMany(defaultActivities);
    activities = await Activity.find().sort({ createdAt: -1 });
  }
  res.json(activities);
});

export const getActivityById = asyncHandler(async (req, res) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  res.json(activity);
});

export const createActivity = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    highlights: Array.isArray(req.body.highlights)
      ? req.body.highlights
      : String(req.body.highlights || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
  };

  const activity = await Activity.create(payload);
  res.status(201).json(activity);
});

export const updateActivity = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    highlights: Array.isArray(req.body.highlights)
      ? req.body.highlights
      : String(req.body.highlights || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
  };

  const activity = await Activity.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  res.json(activity);
});

export const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await Activity.findByIdAndDelete(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  res.json({ message: 'Activity deleted' });
});
