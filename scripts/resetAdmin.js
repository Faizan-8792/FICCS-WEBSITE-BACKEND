/**
 * Reset (or create) the admin account from ADMIN_EMAIL / ADMIN_PASSWORD env vars.
 *
 * Unlike bootstrapAdmin (which never changes an existing admin's password),
 * this script force-sets the password, role, and approved status. The User
 * model's beforeUpdate/beforeCreate hooks hash the password automatically.
 *
 * Run on the server (Hostinger), where the DB is reachable:
 *   node scripts/resetAdmin.js
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from '../config/db.js';
import { initModels, getUser } from '../models/index.js';

const run = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'FICCS Admin';

  if (!email || !password) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.');
    process.exit(1);
  }

  try {
    const sequelize = await connectDb();
    initModels(sequelize);
    await sequelize.sync({ alter: true });

    const User = getUser();
    let admin = await User.findOne({ where: { email } });

    if (admin) {
      admin.name = name;
      admin.password = password; // beforeUpdate hook hashes it
      admin.role = 'admin';
      admin.status = 'approved';
      admin.approvedAt = admin.approvedAt || new Date();
      await admin.save();
      console.log(`Reset existing admin: ${email}`);
    } else {
      admin = await User.create({
        name,
        email,
        password, // beforeCreate hook hashes it
        role: 'admin',
        status: 'approved',
        approvedAt: new Date(),
      });
      console.log(`Created admin: ${email}`);
    }

    // Sanity check: verify the stored hash matches the env password.
    const ok = await admin.matchPassword(password);
    console.log(`Password verification: ${ok ? 'PASS' : 'FAIL'}`);
    process.exit(ok ? 0 : 1);
  } catch (error) {
    console.error('Admin reset failed:', error);
    process.exit(1);
  }
};

run();
