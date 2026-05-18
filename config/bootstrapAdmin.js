import User from '../models/User.js';

const repairLegacyUsers = async () => {
  const passwordRepairResult = await User.collection.updateMany(
    {
      $or: [{ password: { $exists: false } }, { password: null }, { password: '' }],
      passwordHash: { $type: 'string', $ne: '' },
    },
    [{ $set: { password: '$passwordHash' } }]
  );

  const roleRepairResult = await User.collection.updateMany(
    {
      role: { $exists: false },
      adminFingerprintHash: { $exists: true },
    },
    {
      $set: {
        role: 'admin',
        status: 'approved',
        approvedAt: new Date(),
      },
    }
  );

  if (passwordRepairResult.modifiedCount > 0) {
    console.log(`Repaired ${passwordRepairResult.modifiedCount} legacy user password field(s).`);
  }

  if (roleRepairResult.modifiedCount > 0) {
    console.log(`Promoted ${roleRepairResult.modifiedCount} legacy admin account(s).`);
  }
};

export const bootstrapAdmin = async () => {
  await repairLegacyUsers();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return;
  }

  const existingAdmin = await User.findOne({ email });
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
