/**
 * Adds the two-stage approval columns to the `memberships` table:
 *   userId          INT UNSIGNED NULL
 *   documentStatus  ENUM('pending','approved','rejected') DEFAULT 'pending'
 *   paymentStatus   ENUM('pending','approved') DEFAULT 'pending'
 *
 * Production startup uses sequelize.sync({}) (no alter), so new model columns
 * are NOT auto-created. Run this once on the server after deploying:
 *   node scripts/migrateMembershipColumns.js
 *
 * Safe + idempotent: each column is added only if it doesn't already exist.
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from '../config/db.js';

const COLUMNS = [
  { name: 'userId', ddl: 'ADD COLUMN `userId` INT UNSIGNED NULL' },
  {
    name: 'documentStatus',
    ddl: "ADD COLUMN `documentStatus` ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending'",
  },
  {
    name: 'paymentStatus',
    ddl: "ADD COLUMN `paymentStatus` ENUM('pending','approved') NOT NULL DEFAULT 'pending'",
  },
];

const run = async () => {
  try {
    const sequelize = await connectDb();
    const database = process.env.DB_NAME;

    const [existing] = await sequelize.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = :database AND TABLE_NAME = 'memberships'`,
      { replacements: { database } }
    );
    const have = new Set(existing.map((r) => r.COLUMN_NAME));

    let added = 0;
    for (const col of COLUMNS) {
      if (have.has(col.name)) {
        console.log(`Skip (exists): ${col.name}`);
        continue;
      }
      await sequelize.query(`ALTER TABLE \`memberships\` ${col.ddl}`);
      console.log(`Added: ${col.name}`);
      added += 1;
    }

    console.log(`\nDone. Columns added: ${added}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

run();
