import { getHomeContent as getHomeContentModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultHomeContent } from '../utils/defaultContent.js';

const getOrCreateHomeContent = async () => {
  const HomeContent = getHomeContentModel();
  console.log('[home-content] STEP 1: findOne start');
  let content = await HomeContent.findOne();
  console.log('[home-content] STEP 2: findOne done, found =', Boolean(content));

  if (!content) {
    console.log('[home-content] STEP 3: creating default row');
    content = await HomeContent.create(defaultHomeContent);
    console.log('[home-content] STEP 4: created');
  } else {
    let needsSave = false;
    const plain = content.toJSON();
    for (const [key, value] of Object.entries(defaultHomeContent)) {
      if (plain[key] === undefined || plain[key] === null || plain[key] === '') {
        content[key] = value;
        needsSave = true;
      }
    }
    if (needsSave) {
      console.log('[home-content] STEP 3b: saving backfilled defaults');
      await content.save();
    }
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
