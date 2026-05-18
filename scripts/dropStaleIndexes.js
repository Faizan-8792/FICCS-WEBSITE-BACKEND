/**
 * Run once to drop stale indexes from the users collection.
 * Usage: node scripts/dropStaleIndexes.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const db = mongoose.connection.db;
  const collection = db.collection('users');

  const indexes = await collection.indexes();
  console.log('Current indexes:', indexes.map((i) => i.name));

  const stale = ['username_1'];
  for (const name of stale) {
    const exists = indexes.some((i) => i.name === name);
    if (exists) {
      await collection.dropIndex(name);
      console.log(`Dropped stale index: ${name}`);
    } else {
      console.log(`Index not found (already clean): ${name}`);
    }
  }

  await mongoose.disconnect();
  console.log('Done.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
