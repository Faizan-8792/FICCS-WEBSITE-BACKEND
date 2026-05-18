import Contact from '../models/Contact.js';
import ContactPageContent from '../models/ContactPageContent.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultContactPageContent } from '../utils/defaultContent.js';

const getOrCreateContactPageContent = async () => {
  let content = await ContactPageContent.findOne();

  if (!content) {
    content = await ContactPageContent.create(defaultContactPageContent);
  } else {
    const plain = content.toObject();
    let needsSave = false;
    for (const [key, value] of Object.entries(defaultContactPageContent)) {
      if (!(key in plain) || plain[key] === undefined || plain[key] === null) {
        content.set(key, value);
        needsSave = true;
      }
    }
    if (needsSave) await content.save();
  }

  return content;
};

export const submitContact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('All contact fields are required');
  }

  const contact = await Contact.create({ name, email, message });
  res.status(201).json(contact);
});

export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

export const getContactPageContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateContactPageContent();
  res.json(content);
});

export const updateContactPageContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateContactPageContent();
  Object.assign(content, req.body);
  await content.save();
  res.json(content);
});
