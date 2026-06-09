/**
 * Seed a handful of approved demo members so the Member Codes registry has
 * data to work with (assign codes, test export). Idempotent — skips emails
 * that already exist. Demo accounts use role 'user', status 'approved'.
 *
 * Usage: node scripts/seedDemoMembers.js   (npm run seed:members)
 * Remove later by deleting these users from Admin > User Approvals.
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from '../config/db.js';
import { initModels, getUser } from '../models/index.js';

const DEMO = [
  { name: 'Dr Demo Sharma', email: 'demo.sharma@ficcs.test' },
  { name: 'Dr Demo Iyer', email: 'demo.iyer@ficcs.test' },
  { name: 'Dr Demo Khan', email: 'demo.khan@ficcs.test' },
  { name: 'Dr Demo Reddy', email: 'demo.reddy@ficcs.test' },
  { name: 'Dr Demo Banerjee', email: 'demo.banerjee@ficcs.test' },
];

const run = async () => {
  try {
    const sequelize = await connectDb();
    initModels(sequelize);
    const User = getUser();

    let created = 0;
    for (const d of DEMO) {
      const existing = await User.findOne({ where: { email: d.email } });
      if (existing) {
        console.log(`Skip (exists): ${d.email}`);
        continue;
      }
      await User.create({
        name: d.name,
        email: d.email,
        password: 'DemoMember@2026',
        role: 'user',
        status: 'approved',
        approvedAt: new Date(),
      });
      console.log(`Created demo member: ${d.name}`);
      created += 1;
    }

    console.log(`\nDone. Demo members created: ${created}`);
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

run();
