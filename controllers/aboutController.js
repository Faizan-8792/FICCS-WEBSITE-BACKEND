import { getAboutContent as getAboutContentModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultAboutContent } from '../utils/defaultContent.js';

const getOrCreateAboutContent = async () => {
  const AboutContent = getAboutContentModel();
  let content = await AboutContent.findOne();

  if (!content) {
    content = await AboutContent.create(defaultAboutContent);
  } else {
    let needsSave = false;
    const plain = content.toJSON();
    for (const [key, value] of Object.entries(defaultAboutContent)) {
      if (plain[key] === undefined || plain[key] === null || plain[key] === '') {
        content[key] = value;
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
  await content.update(req.body);
  res.json(content);
});
