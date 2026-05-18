import AboutContent from '../models/AboutContent.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultAboutContent } from '../utils/defaultContent.js';

const getOrCreateAboutContent = async () => {
  let content = await AboutContent.findOne();

  if (!content) {
    content = await AboutContent.create(defaultAboutContent);
  } else {
    const plain = content.toObject();
    let needsSave = false;
    for (const [key, value] of Object.entries(defaultAboutContent)) {
      if (!(key in plain) || plain[key] === undefined || plain[key] === null) {
        content.set(key, value);
        needsSave = true;
      }
    }
    if (needsSave) await content.save();
  }

  return content;
};

export const getAboutContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateAboutContent();
  res.json(content);
});

export const updateAboutContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateAboutContent();
  Object.assign(content, req.body);
  await content.save();
  res.json(content);
});
