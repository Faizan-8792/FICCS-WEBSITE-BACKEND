import { getAboutContent as getAboutContentModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultAboutContent } from '../utils/defaultContent.js';

const withDefaults = (plain, defaults) => {
  const merged = { ...plain };
  for (const [key, value] of Object.entries(defaults)) {
    if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
      merged[key] = value;
    }
  }
  return merged;
};

const ensureRowInBackground = (Model, defaults) => {
  Model.findOne()
    .then((row) => (row ? null : Model.create(defaults)))
    .catch((err) => console.error('[about] background seed failed:', err.message));
};

export const getAboutContent = asyncHandler(async (req, res) => {
  const AboutContent = getAboutContentModel();
  const content = await AboutContent.findOne();

  if (content) {
    res.json(withDefaults(content.toJSON(), defaultAboutContent));
    return;
  }

  res.json(withDefaults({}, defaultAboutContent));
  ensureRowInBackground(AboutContent, defaultAboutContent);
});

export const updateAboutContent = asyncHandler(async (req, res) => {
  const AboutContent = getAboutContentModel();
  let content = await AboutContent.findOne();
  if (!content) {
    content = await AboutContent.create(defaultAboutContent);
  }
  await content.update(req.body);
  res.json(content.toJSON());
});
