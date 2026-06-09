/**
 * Brings the `messages` table up to date with the expanded notification model:
 *   audience      ENUM('all','members','selective')  (was ENUM('all'))
 *   recipientIds  JSON / LONGTEXT  (target user ids when audience='selective')
 *
 * Production startup uses sequelize.sync({}) (no alter), so model changes are
 * NOT auto-applied. This module exposes `ensureMessageColumns()` which the
 * server calls on boot (see index.js) so deploys self-heal. Also runnable:
 *   node scripts/migrateMessageColumns.js   (npm run migrate:messages)
 *
 * Safe + idempotent.
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from '../config/db.js';

/**
 * Apply message-table schema updates. Idempotent.
 * @param {import('sequelize').Sequelize} sequelize - authenticated instance.
 */
export const ensureMessageColumns = async (sequelize) => {
  const database = sequelize.config?.database || process.env.DB_NAME;

  const [columns] = await sequelize.query(
    `SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = :database AND TABLE_NAME = 'messages'`,
    { replacements: { database } }
  );

  // No messages table yet (fresh DB) — sequelize.sync creates it correctly.
  if (columns.length === 0) return 0;

  let changes = 0;
  const byName = {};
  columns.forEach((c) => {
    byName[c.COLUMN_NAME] = c;
  });

  // Widen the audience ENUM if it doesn't already include the new values.
  const audienceType = byName.audience?.COLUMN_TYPE || '';
  if (!audienceType.includes('members') || !audienceType.includes('selective')) {
    await sequelize.query(
      "ALTER TABLE `messages` MODIFY COLUMN `audience` ENUM('all','members','selective') NOT NULL DEFAULT 'all'"
    );
    console.log('[migrate] messages: widened audience ENUM');
    changes += 1;
  }

  // Add recipientIds JSON column if missing.
  if (!byName.recipientIds) {
    await sequelize.query('ALTER TABLE `messages` ADD COLUMN `recipientIds` JSON NULL');
    console.log('[migrate] messages: added column recipientIds');
    changes += 1;
  }

  return changes;
};

const run = async () => {
  try {
    const sequelize = await connectDb();
    const changes = await ensureMessageColumns(sequelize);
    console.log(`\nDone. Schema changes applied: ${changes}`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
};

const invokedDirectly =
  process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('scripts/migrateMessageColumns.js');
if (invokedDirectly) {
  run();
}
