import { getAboutContent as getAboutContentModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultAboutContent } from '../utils/defaultContent.js';

/**
 * Merge default values in-memory for empty/missing fields. Read-only — never
 * writes to the DB, so GET requests stay fast and cannot hang on save().
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

const getAboutContentRow = async () => {
  const AboutContent = getAboutContentModel();
  let content = await AboutContent.findOne();
  if (!content) {
    content = await AboutContent.create(defaultAboutContent);
  }
  return content;
};

export const getAboutContent = asyncHandler(async (req, res) => {
  const content = await getAboutContentRow();
  res.json(withDefaults(content.toJSON(), defaultAboutContent));
});

export const updateAboutContent = asyncHandler(async (req, res) => {
  const content = await getAboutContentRow();
  await content.update(req.body);
  res.json(content.toJSON());
});
