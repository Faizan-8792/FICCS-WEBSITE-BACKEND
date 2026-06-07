import { getHomeContent as getHomeContentModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultHomeContent } from '../utils/defaultContent.js';

/**
 * Merge default values into a plain content object for empty/missing fields.
 * This is read-only — it never writes to the DB, so GET requests stay fast and
 * cannot hang on a save(). Admins persist real values via the update endpoint.
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

const getHomeContentRow = async () => {
  const HomeContent = getHomeContentModel();
  let content = await HomeContent.findOne();
  if (!content) {
    content = await HomeContent.create(defaultHomeContent);
  }
  return content;
};

export const getHomeContent = asyncHandler(async (req, res) => {
  const content = await getHomeContentRow();
  res.json(withDefaults(content.toJSON(), defaultHomeContent));
});

export const updateHomeContent = asyncHandler(async (req, res) => {
  const content = await getHomeContentRow();
  await content.update(req.body);
  res.json(content.toJSON());
});
