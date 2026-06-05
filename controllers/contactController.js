import { getContact, getContactPageContent as getContactPageContentModel } from '../models/index.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { defaultContactPageContent, FICCS_INQUIRY_EMAIL } from '../utils/defaultContent.js';
import { sendMail, getContactRecipients } from '../utils/mailer.js';

// Project owner who should also receive every inquiry notification.
const OWNER_NOTIFY_EMAIL = 'saifullahfaizan786@gmail.com';

/**
 * Build the recipient list for inquiry notifications:
 *   - the live FICCS office email (from DB, falls back to default)
 *   - the project owner
 *   - any extra addresses configured via CONTACT_NOTIFY_EMAILS
 * Duplicates and empties are removed.
 */
const resolveNotifyRecipients = (officeEmail) => {
  const recipients = [
    officeEmail || FICCS_INQUIRY_EMAIL,
    OWNER_NOTIFY_EMAIL,
    ...getContactRecipients(),
  ];
  return [...new Set(recipients.map((e) => e.trim().toLowerCase()).filter(Boolean))];
};

const sendInquiryNotification = async ({ name, email, message }, officeEmail) => {
  const recipients = resolveNotifyRecipients(officeEmail);
  const subject = `New FICCS inquiry from ${name}`;
  const text =
    `You received a new inquiry via the FICCS website.\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n\n` +
    `Message:\n${message}\n`;
  const html =
    `<h2>New FICCS website inquiry</h2>` +
    `<p><strong>Name:</strong> ${name}</p>` +
    `<p><strong>Email:</strong> ${email}</p>` +
    `<p><strong>Message:</strong></p>` +
    `<p style="white-space:pre-wrap">${message}</p>`;

  // Non-blocking: never let mail issues break the submission.
  await sendMail({ to: recipients, subject, text, html, replyTo: email });
};

const getOrCreateContactPageContent = async () => {
  const ContactPageContent = getContactPageContentModel();
  let content = await ContactPageContent.findOne();

  if (!content) {
    content = await ContactPageContent.create(defaultContactPageContent);
  } else {
    let needsSave = false;
    const plain = content.toJSON();
    for (const [key, value] of Object.entries(defaultContactPageContent)) {
      if (plain[key] === undefined || plain[key] === null || plain[key] === '') {
        content[key] = value;
        needsSave = true;
      }
    }
    if (needsSave) await content.save();
  }

  return content;
};

export const submitContact = asyncHandler(async (req, res) => {
  const Contact = getContact();
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('All contact fields are required');
  }

  const contact = await Contact.create({ name, email, message });

  // Notify FICCS + project owner. Fully non-blocking: any failure here
  // (content lookup or mail send) must never turn a successful submission
  // into an error response, otherwise users retry and create duplicates.
  Promise.resolve()
    .then(async () => {
      const content = await getOrCreateContactPageContent();
      await sendInquiryNotification({ name, email, message }, content?.officeEmail);
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
  res.json(content);
});

export const updateContactPageContent = asyncHandler(async (req, res) => {
  const content = await getOrCreateContactPageContent();
  await content.update(req.body);
  res.json(content);
});
