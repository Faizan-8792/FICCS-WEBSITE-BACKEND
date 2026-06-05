/**
 * One-off update: force-refresh the About page "Who We Are" section to match
 * the current defaults in utils/defaultContent.js.
 *
 * The normal getOrCreate merge only fills EMPTY fields, so it never overwrites
 * an existing whoWeAre value. This script updates it explicitly.
 *
 * Run on the server (Hostinger), where the DB is reachable:
 *   node scripts/updateAboutWhoWeAre.js
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from '../config/db.js';
import { initModels, getAboutContent } from '../models/index.js';
import { defaultAboutContent } from '../utils/defaultContent.js';

const run = async () => {
  try {
    const sequelize = await connectDb();
    initModels(sequelize);
    await sequelize.sync({ alter: true });

    const AboutContent = getAboutContent();
    let content = await AboutContent.findOne();

    if (!content) {
      content = await AboutContent.create(defaultAboutContent);
      console.log('Created About content from defaults.');
    } else {
      content.whoWeAre = defaultAboutContent.whoWeAre;
      await content.save();
      console.log('Updated whoWeAre section:');
    }

    console.log(JSON.stringify(content.whoWeAre, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Update failed:', error);
    process.exit(1);
  }
};

run();
