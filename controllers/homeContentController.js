import { getHomeContent as getHomeContentModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultHomeContent } from '../utils/defaultContent.js';

const getOrCreateHomeContent = async () => {
  const HomeContent = getHomeContentModel();
  let content = await HomeContent.findOne();

  if (!content) {
    content = await HomeContent.create(defaultHomeContent);
  } else {
    let needsSave = false;
    const plain = content.toJSON();
    for (const [key, value] of Object.entries(defaultHomeContent)) {
      if (plain[key] === undefined || plain[key] === null || plain[key] === '') {
        content[key] = value;
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
  await content.update(req.body);
  res.json(content);
});
