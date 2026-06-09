/**
 * Adds the two-stage approval columns to the `memberships` table:
 *   userId          INT UNSIGNED NULL
 *   documentStatus  ENUM('pending','approved','rejected') DEFAULT 'pending'
 *   paymentStatus   ENUM('pending','approved') DEFAULT 'pending'
 *
 * Production startup uses sequelize.sync({}) (no alter), so new model columns
 * are NOT auto-created. This module exposes `ensureMembershipColumns()` which
 * the server calls on boot (see index.js) so deploys self-heal without a manual
 * step. It can also be run directly:
 *   node scripts/migrateMembershipColumns.js   (or: npm run migrate:membership)
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

/**
 * Add any missing two-stage approval columns to the `memberships` table.
 * Idempotent — checks INFORMATION_SCHEMA first and only adds what's absent.
 * Returns the number of columns added.
 *
 * @param {import('sequelize').Sequelize} sequelize - an authenticated instance.
 */
export const ensureMembershipColumns = async (sequelize) => {
  const database = sequelize.config?.database || process.env.DB_NAME;

  const [existing] = await sequelize.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = :database AND TABLE_NAME = 'memberships'`,
    { replacements: { database } }
  );

  // No memberships table yet (fresh DB) — sequelize.sync creates it with all
  // columns, so there is nothing to backfill.
  if (existing.length === 0) return 0;

  const have = new Set(existing.map((r) => r.COLUMN_NAME));

  let added = 0;
  for (const col of COLUMNS) {
    if (have.has(col.name)) continue;
    await sequelize.query(`ALTER TABLE \`memberships\` ${col.ddl}`);
    console.log(`[migrate] memberships: added column ${col.name}`);
    added += 1;
  }
  return added;
};

const run = async () => {
  try {
    const sequelize = await connectDb();
    const added = await ensureMembershipColumns(sequelize);
    console.log(`\nDone. Columns added: ${added}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

// Only run as a CLI when invoked directly, not when imported by the server.
const invokedDirectly =
  process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('scripts/migrateMembershipColumns.js');
if (invokedDirectly) {
  run();
}
