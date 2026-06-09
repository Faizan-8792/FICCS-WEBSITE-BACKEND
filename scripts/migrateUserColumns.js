/**
 * Adds the `memberCode` column to the `users` table:
 *   memberCode  VARCHAR(40) NULL  (FICCS-YYYY-NN, assigned by admin)
 *
 * Production startup uses sequelize.sync({}) (no alter), so new model columns
 * are NOT auto-created. This module exposes `ensureUserColumns()` which the
 * server calls on boot (see index.js) so deploys self-heal. Also runnable:
 *   node scripts/migrateUserColumns.js   (npm run migrate:users)
 *
 * Safe + idempotent.
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from '../config/db.js';

/**
 * Add missing user columns. Idempotent.
 * @param {import('sequelize').Sequelize} sequelize - authenticated instance.
 */
export const ensureUserColumns = async (sequelize) => {
  const database = sequelize.config?.database || process.env.DB_NAME;

  const [existing] = await sequelize.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = :database AND TABLE_NAME = 'users'`,
    { replacements: { database } }
  );

  if (existing.length === 0) return 0;

  const have = new Set(existing.map((r) => r.COLUMN_NAME));
  let added = 0;

  if (!have.has('memberCode')) {
    await sequelize.query('ALTER TABLE `users` ADD COLUMN `memberCode` VARCHAR(40) NULL');
    console.log('[migrate] users: added column memberCode');
    added += 1;
  }

  return added;
};

const run = async () => {
  try {
    const sequelize = await connectDb();
    const added = await ensureUserColumns(sequelize);
    console.log(`\nDone. Columns added: ${added}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

const invokedDirectly =
  process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('scripts/migrateUserColumns.js');
if (invokedDirectly) {
  run();
}
