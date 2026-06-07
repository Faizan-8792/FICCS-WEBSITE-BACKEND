import { getMembershipPageContent as getMembershipPageContentModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultMembershipPageContent } from '../utils/defaultContent.js';

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
    .catch((err) => console.error('[membership-content] background seed failed:', err.message));
};

export const getMembershipPageContent = asyncHandler(async (req, res) => {
  const MembershipPageContent = getMembershipPageContentModel();
  const content = await MembershipPageContent.findOne();

  if (content) {
    res.json(withDefaults(content.toJSON(), defaultMembershipPageContent));
    return;
  }

  res.json(withDefaults({}, defaultMembershipPageContent));
  ensureRowInBackground(MembershipPageContent, defaultMembershipPageContent);
});

export const updateMembershipPageContent = asyncHandler(async (req, res) => {
  const MembershipPageContent = getMembershipPageContentModel();
  let content = await MembershipPageContent.findOne();
  if (!content) {
    content = await MembershipPageContent.create(defaultMembershipPageContent);
  }
  await content.update(req.body);
  res.json(content.toJSON());
});
