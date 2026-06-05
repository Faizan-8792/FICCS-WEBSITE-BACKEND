/**
 * One-off: replace the old contact email with the current FICCS_INQUIRY_EMAIL
 * across existing DB rows. Defaults only fill EMPTY fields, so rows seeded
 * before the email change still hold the old address.
 *
 * Run on the server (Hostinger), where the DB is reachable:
 *   node scripts/updateSiteEmail.js
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from '../config/db.js';
import {
  initModels,
  getAboutContent,
  getContactPageContent,
} from '../models/index.js';
import { FICCS_INQUIRY_EMAIL } from '../utils/defaultContent.js';

const OLD_EMAILS = ['ficcsindia@yahoo.com', 'admin@ficcs.com', 'admin@ficcs.org'];

const run = async () => {
  try {
    const sequelize = await connectDb();
    initModels(sequelize);
    await sequelize.sync({ alter: true });

    const AboutContent = getAboutContent();
    const ContactPageContent = getContactPageContent();

    let changed = 0;

    const about = await AboutContent.findOne();
    if (about && (OLD_EMAILS.includes(about.contactEmail) || !about.contactEmail)) {
      about.contactEmail = FICCS_INQUIRY_EMAIL;
      await about.save();
      changed += 1;
      console.log(`AboutContent.contactEmail -> ${FICCS_INQUIRY_EMAIL}`);
    }

    const contact = await ContactPageContent.findOne();
    if (contact && (OLD_EMAILS.includes(contact.officeEmail) || !contact.officeEmail)) {
      contact.officeEmail = FICCS_INQUIRY_EMAIL;
      await contact.save();
      changed += 1;
      console.log(`ContactPageContent.officeEmail -> ${FICCS_INQUIRY_EMAIL}`);
    }

    console.log(`\nDone. Rows updated: ${changed}`);
    process.exit(0);
  } catch (error) {
    console.error('Email update failed:', error);
    process.exit(1);
  }
};

run();
