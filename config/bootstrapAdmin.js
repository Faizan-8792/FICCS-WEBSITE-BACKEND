import { getUser } from '../models/index.js';

export const bootstrapAdmin = async () => {
  const User = getUser();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const existingAdmin = await User.findOne({ where: { email } });
  if (existingAdmin) {
    let needsSave = false;

    if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      needsSave = true;
    }

    if (existingAdmin.status !== 'approved') {
      existingAdmin.status = 'approved';
      needsSave = true;
    }

    if (!existingAdmin.approvedAt) {
      existingAdmin.approvedAt = new Date();
      needsSave = true;
    }

    if (needsSave) {
      await existingAdmin.save();
      console.log(`Updated admin user: ${email}`);
    }

    return;
  }

  await User.create({
    name: process.env.ADMIN_NAME || 'FICCS Admin',
    email,
    password,
    role: 'admin',
    status: 'approved',
    approvedAt: new Date(),
  });

  console.log(`Seeded admin user: ${email}`);
};
