import { getMembershipPageContent as getMembershipPageContentModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultMembershipPageContent } from '../utils/defaultContent.js';

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

const getMembershipPageContentRow = async () => {
  const MembershipPageContent = getMembershipPageContentModel();
  let content = await MembershipPageContent.findOne();
  if (!content) {
    content = await MembershipPageContent.create(defaultMembershipPageContent);
  }
  return content;
};

export const getMembershipPageContent = asyncHandler(async (req, res) => {
  const content = await getMembershipPageContentRow();
  res.json(withDefaults(content.toJSON(), defaultMembershipPageContent));
});

export const updateMembershipPageContent = asyncHandler(async (req, res) => {
  const content = await getMembershipPageContentRow();
  await content.update(req.body);
  res.json(content.toJSON());
});
