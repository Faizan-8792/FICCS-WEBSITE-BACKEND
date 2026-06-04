import { getMembershipPageContent as getMembershipPageContentModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultMembershipPageContent } from '../utils/defaultContent.js';

const getOrCreateMembershipPageContent = async () => {
  const MembershipPageContent = getMembershipPageContentModel();
  let content = await MembershipPageContent.findOne();

  if (!content) {
    content = await MembershipPageContent.create(defaultMembershipPageContent);
  } else {
    let needsSave = false;
    const plain = content.toJSON();
    for (const [key, value] of Object.entries(defaultMembershipPageContent)) {
      if (plain[key] === undefined || plain[key] === null || plain[key] === '') {
        content[key] = value;
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
  await content.update(req.body);
  res.json(content);
});
