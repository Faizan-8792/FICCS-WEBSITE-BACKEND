import { getContact, getContactPageContent as getContactPageContentModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultContactPageContent } from '../utils/defaultContent.js';
import { sendInquiryViaFormSubmit } from '../utils/formSubmitNotify.js';

const getOrCreateContactPageContent = async () => {
  const ContactPageContent = getContactPageContentModel();
  let content = await ContactPageContent.findOne();
  if (!content) {
    content = await ContactPageContent.create(defaultContactPageContent);
  }
  return content;
};

// Merge defaults in-memory for empty fields. Read-only — never writes on GET.
const withContactDefaults = (plain) => {
  const merged = { ...plain };
  for (const [key, value] of Object.entries(defaultContactPageContent)) {
    if (merged[key] === undefined || merged[key] === null || merged[key] === '') {
      merged[key] = value;
    }
  }
  return merged;
};

export const submitContact = asyncHandler(async (req, res) => {
  const Contact = getContact();
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('All contact fields are required');
  }

  const contact = await Contact.create({ name, email, message });

  // Notify FICCS + project owner via FormSubmit. Fully non-blocking: any
  // failure here (content lookup or relay send) must never turn a successful
  // submission into an error response, otherwise users retry and create
  // duplicates.
  Promise.resolve()
    .then(async () => {
      const content = await getOrCreateContactPageContent();
      await sendInquiryViaFormSubmit({ name, email, message }, content?.officeEmail);
    })
    .catch((err) => console.error('[contact] notification error:', err.message));

  res.status(201).json(contact);
});

export const getContacts = asyncHandler(async (req, res) => {
  const Contact = getContact();
  const contacts = await Contact.findAll({ order: [['createdAt', 'DESC']] });
  res.json(contacts);
});

export const getContactPageContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateContactPageContent();
  res.json(withContactDefaults(content.toJSON()));
});

export const updateContactPageContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateContactPageContent();
  await content.update(req.body);
  res.json(content);
});
