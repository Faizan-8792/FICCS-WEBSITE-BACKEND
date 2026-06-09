/**
 * READ-ONLY audit: lists every membership application and which document
 * URLs are stored in the database. Helps confirm whether uploaded documents
 * are actually persisted per member.
 *
 * Usage:
 *   node scripts/checkMembershipDocs.js
 *
 * Output per member: stored URL count for profile / MCI / govtId / degree.
 * Does NOT modify any data.
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from '../config/db.js';
import { initModels, getMembership } from '../models/index.js';

const asArray = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return v ? [v] : [];
    }
  }
  return [];
};

const run = async () => {
  try {
    const sequelize = await connectDb();
    initModels(sequelize);
    const Membership = getMembership();

    const rows = await Membership.findAll({ order: [['createdAt', 'ASC']] });
    console.log(`\nTotal membership applications: ${rows.length}\n`);

    let missingAny = 0;
    for (const m of rows) {
      const govt = asArray(m.govtIdUrls);
      const degree = asArray(m.degreeCertificateUrls);
      const hasProfile = Boolean(m.profilePictureUrl);
      const hasMci = Boolean(m.mciCertificateUrl);
      const incomplete = !hasProfile || !hasMci || degree.length === 0;
      if (incomplete) missingAny += 1;

      console.log(
        `#${m.id} ${m.name} <${m.email}>` +
          `\n   profile: ${hasProfile ? 'YES' : 'NO '} | mci: ${hasMci ? 'YES' : 'NO '}` +
          ` | govtId: ${govt.length} | degree: ${degree.length}` +
          (incomplete ? '   <-- INCOMPLETE' : '')
      );
      if (hasProfile) console.log(`     profile: ${m.profilePictureUrl}`);
      if (hasMci) console.log(`     mci:     ${m.mciCertificateUrl}`);
      govt.forEach((u, i) => console.log(`     govtId[${i}]: ${u}`));
      degree.forEach((u, i) => console.log(`     degree[${i}]: ${u}`));
    }

    console.log(
      `\nSummary: ${rows.length} applications, ${missingAny} with at least one missing document field.`
    );
    process.exit(0);
  } catch (error) {
    console.error('Audit failed:', error.message);
    process.exit(1);
  }
};

run();
