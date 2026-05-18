import MembershipPageContent from '../models/MembershipPageContent.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultMembershipPageContent } from '../utils/defaultContent.js';

const getOrCreateMembershipPageContent = async () => {
  let content = await MembershipPageContent.findOne();

  if (!content) {
    content = await MembershipPageContent.create(defaultMembershipPageContent);
  } else {
    const plain = content.toObject();
    let needsSave = false;
    for (const [key, value] of Object.entries(defaultMembershipPageContent)) {
      if (!(key in plain) || plain[key] === undefined || plain[key] === null) {
        content.set(key, value);
        needsSave = true;
      }
    }
    if (needsSave) await content.save();
  }

  return content;
};

export const getMembershipPageContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateMembershipPageContent();
  res.json(content);
});

export const updateMembershipPageContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateMembershipPageContent();
  Object.assign(content, req.body);
  await content.save();
  res.json(content);
});
