import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { bootstrapAdmin } from '../config/bootstrapAdmin.js';
import { connectDb } from '../config/db.js';
import AboutContent from '../models/AboutContent.js';
import Activity from '../models/Activity.js';
import ContactPageContent from '../models/ContactPageContent.js';
import Event from '../models/Event.js';
import HomeContent from '../models/HomeContent.js';
import Media from '../models/Media.js';
import MembershipPageContent from '../models/MembershipPageContent.js';
import {
  defaultAboutContent,
  defaultActivities,
  defaultContactPageContent,
  defaultEvents,
  defaultHomeContent,
  defaultMedia,
  defaultMembershipPageContent,
} from '../utils/defaultContent.js';

dotenv.config();

const shouldReset = process.argv.includes('--reset');

const seedSingleton = async (Model, defaults, label) => {
  let doc = await Model.findOne();

  if (!doc) {
    await Model.create(defaults);
    console.log(`  [ok] Seeded ${label}`);
    return;
  }

  if (shouldReset) {
    doc.set(defaults);
    await doc.save();
    console.log(`  [ok] Reset ${label}`);
    return;
  }

  const plain = doc.toObject();
  let needsSave = false;

  for (const [key, value] of Object.entries(defaults)) {
    if (!(key in plain) || plain[key] === undefined || plain[key] === null) {
      doc.set(key, value);
      needsSave = true;
    }
  }

  if (needsSave) {
    await doc.save();
    console.log(`  [ok] Updated missing fields in ${label}`);
    return;
  }

  console.log(`  [skip] ${label} already seeded`);
};

const seedCollection = async (Model, items, label) => {
  if (shouldReset) {
    await Model.deleteMany({});
    if (items.length) {
      await Model.insertMany(items);
    }
    console.log(`  [ok] Reset ${label}`);
    return;
  }

  const count = await Model.countDocuments();
  if (count === 0) {
    await Model.insertMany(items);
    console.log(`  [ok] Seeded ${label}`);
    return;
  }

  console.log(`  [skip] ${label} already seeded (${count} docs)`);
};

const run = async () => {
  console.log('\nFICCS Database Seed\n');
  console.log(
    shouldReset
      ? 'Mode: RESET (overwrite existing)\n'
      : 'Mode: INCREMENTAL (add missing only)\n'
  );

  try {
    await connectDb();

    console.log('--- Admin Account ---');
    await bootstrapAdmin();

    console.log('\n--- Page Content ---');
    await seedSingleton(HomeContent, defaultHomeContent, 'home content');
    await seedSingleton(AboutContent, defaultAboutContent, 'about content');
    await seedSingleton(
      ContactPageContent,
      defaultContactPageContent,
      'contact page content'
    );
    await seedSingleton(
      MembershipPageContent,
      defaultMembershipPageContent,
      'membership page content'
    );

    console.log('\n--- Collections ---');
    await seedCollection(Event, defaultEvents, 'events');
    await seedCollection(Activity, defaultActivities, 'activities');
    await seedCollection(Media, defaultMedia, 'media');

    console.log('\nSeed complete\n');
    process.exit(0);
  } catch (error) {
    console.error('\nSeed failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

run();
