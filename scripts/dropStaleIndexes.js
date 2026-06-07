/**
 * Recovery script for the MySQL/MariaDB error:
 *   "Too many keys specified; max 64 keys allowed"
 *
 * Root cause: sequelize.sync({ alter: true }) on MariaDB cannot detect the
 * existing UNIQUE index on users.email, so every server restart adds another
 * duplicate index (email_2, email_3, ...). After ~64 restarts the table hits
 * MySQL's 64-key limit and sync() fails on startup.
 *
 * This script drops every duplicate index on the `users` table, keeping only
 * the primary key and ONE unique index per column. Safe to re-run.
 *
 * Run on the server (Hostinger), where the DB is reachable:
 *   node scripts/dropStaleIndexes.js
 */
import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from '../config/db.js';

const run = async () => {
  try {
    const sequelize = await connectDb();
    const database = process.env.DB_NAME;

    // All indexes on the users table.
    const [rows] = await sequelize.query(
      `SELECT INDEX_NAME, COLUMN_NAME, NON_UNIQUE
         FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = :database AND TABLE_NAME = 'users'
        ORDER BY INDEX_NAME`,
      { replacements: { database } }
    );

    // Group index names by the column they cover.
    const seenColumn = new Set();
    const toDrop = [];

    for (const row of rows) {
      const indexName = row.INDEX_NAME;
      const column = row.COLUMN_NAME;

      // Never touch the primary key.
      if (indexName === 'PRIMARY') continue;

      // Keep the first index we see for a column; drop the rest (duplicates
      // like email_2, email_3, ... created by repeated alter:true syncs).
      if (seenColumn.has(column)) {
        toDrop.push(indexName);
      } else {
        seenColumn.add(column);
      }
    }

    if (!toDrop.length) {
      console.log('No duplicate indexes found on `users`. Nothing to drop.');
      process.exit(0);
    }

    console.log(`Dropping ${toDrop.length} duplicate index(es) on \`users\`...`);
    for (const indexName of toDrop) {
      // Identifiers can't be bound params; indexName comes from the schema
      // catalog (not user input), and we backtick-escape it.
      await sequelize.query(`ALTER TABLE \`users\` DROP INDEX \`${indexName}\``);
      console.log(`  dropped ${indexName}`);
    }

    console.log('\nDone. Duplicate indexes removed.');
    process.exit(0);
  } catch (error) {
    console.error('Index cleanup failed:', error.message);
    process.exit(1);
  }
};

run();
