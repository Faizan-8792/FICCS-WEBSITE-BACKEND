import HomeContent from '../models/HomeContent.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultHomeContent } from '../utils/defaultContent.js';

const getOrCreateHomeContent = async () => {
  let content = await HomeContent.findOne();

  if (!content) {
    content = await HomeContent.create(defaultHomeContent);
  } else {
    // Merge in any new default fields that are missing from the existing document
    const plain = content.toObject();
    let needsSave = false;
    for (const [key, value] of Object.entries(defaultHomeContent)) {
      if (!(key in plain) || plain[key] === undefined || plain[key] === null) {
        content.set(key, value);
        needsSave = true;
      }
    }
    if (needsSave) await content.save();
  }

  return content;
};

export const getHomeContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateHomeContent();
  res.json(content);
});

export const updateHomeContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateHomeContent();
  Object.assign(content, req.body);
  await content.save();
  res.json(content);
});
