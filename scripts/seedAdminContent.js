/**
 * Seed script — creates default content rows in MySQL if they don't exist.
 * Usage: node scripts/seedAdminContent.js
 *        node scripts/seedAdminContent.js --reset  (drops and re-creates)
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from '../config/db.js';
import { initModels, getHomeContent, getAboutContent, getMembershipPageContent, getContactPageContent } from '../models/index.js';
import { defaultHomeContent, defaultAboutContent, defaultMembershipPageContent, defaultContactPageContent } from '../utils/defaultContent.js';

const reset = process.argv.includes('--reset');

const seed = async () => {
  try {
    const sequelize = await connectDb();
    initModels(sequelize);
    await sequelize.sync({ alter: true });

    const HomeContent = getHomeContent();
    const AboutContent = getAboutContent();
    const MembershipPageContent = getMembershipPageContent();
    const ContactPageContent = getContactPageContent();

    if (reset) {
      await HomeContent.destroy({ where: {} });
      await AboutContent.destroy({ where: {} });
      await MembershipPageContent.destroy({ where: {} });
      await ContactPageContent.destroy({ where: {} });
      console.log('Cleared existing content.');
    }

    const seedIfEmpty = async (Model, data, label) => {
      const count = await Model.count();
      if (count === 0) {
        await Model.create(data);
        console.log(`Seeded: ${label}`);
      } else {
        console.log(`Skipped (already exists): ${label}`);
      }
    };

    await seedIfEmpty(HomeContent, defaultHomeContent, 'HomeContent');
    await seedIfEmpty(AboutContent, defaultAboutContent, 'AboutContent');
    await seedIfEmpty(MembershipPageContent, defaultMembershipPageContent, 'MembershipPageContent');
    await seedIfEmpty(ContactPageContent, defaultContactPageContent, 'ContactPageContent');

    console.log('\nDone.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
