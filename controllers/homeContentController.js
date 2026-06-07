import { getHomeContent as getHomeContentModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultHomeContent } from '../utils/defaultContent.js';

/**
 * Merge defaults in-memory for empty/missing fields. Read-only.
 */
const withDefaults = (plain, defaults) => {
  const merged = { ...plain };
  for (const [key, value] of Object.entries(defaults)) {
    if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
      merged[key] = value;
    }
  }
  return merged;
};

/**
 * Fire-and-forget seed of the initial row. NEVER awaited inside a GET handler,
 * so a slow/failing write (e.g. missing INSERT privilege on a fresh DB) can
 * never hang the request or get the worker killed by the host.
 */
const ensureRowInBackground = (Model, defaults) => {
  Model.findOne()
    .then((row) => {
      if (!row) return Model.create(defaults);
      return null;
    })
    .catch((err) => console.error('[home-content] background seed failed:', err.message));
};

export const getHomeContent = asyncHandler(async (req, res) => {
  const HomeContent = getHomeContentModel();
  const content = await HomeContent.findOne();

  if (content) {
    res.json(withDefaults(content.toJSON(), defaultHomeContent));
    return;
  }

  // No row yet — respond with defaults immediately, seed in the background.
  res.json(withDefaults({}, defaultHomeContent));
  ensureRowInBackground(HomeContent, defaultHomeContent);
});

export const updateHomeContent = asyncHandler(async (req, res) => {
  const HomeContent = getHomeContentModel();
  let content = await HomeContent.findOne();
  if (!content) {
    content = await HomeContent.create(defaultHomeContent);
  }
  await content.update(req.body);
  res.json(content.toJSON());
});
