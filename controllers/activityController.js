import { getActivity } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultActivities } from '../utils/defaultContent.js';

export const getActivities = asyncHandler(async (req, res) => {
  const Activity = getActivity();
  let activities = await Activity.findAll({ order: [['createdAt', 'DESC']] });
  if (!activities.length) {
    await Activity.bulkCreate(defaultActivities);
    activities = await Activity.findAll({ order: [['createdAt', 'DESC']] });
  }
  res.json(activities);
});

export const getActivityById = asyncHandler(async (req, res) => {
  const Activity = getActivity();
  const activity = await Activity.findByPk(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  res.json(activity);
});

export const createActivity = asyncHandler(async (req, res) => {
  const Activity = getActivity();
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
  const Activity = getActivity();
  const activity = await Activity.findByPk(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  const payload = {
    ...req.body,
    highlights: Array.isArray(req.body.highlights)
      ? req.body.highlights
      : String(req.body.highlights || '')
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
  };

  await activity.update(payload);
  res.json(activity);
});

export const deleteActivity = asyncHandler(async (req, res) => {
  const Activity = getActivity();
  const activity = await Activity.findByPk(req.params.id);

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  await activity.destroy();
  res.json({ message: 'Activity deleted' });
});
