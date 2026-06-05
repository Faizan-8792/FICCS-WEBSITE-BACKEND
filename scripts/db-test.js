/**
 * Standalone DB connectivity test.
 * Uses the exact same env vars and mysql2 package as the application.
 *
 * Usage (local):   node scripts/db-test.js
 * Usage (Hostinger): node scripts/db-test.js
 *
 * Expects .env in backend root OR env vars set in dashboard.
 */
import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2/promise';

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT || 3306);
const database = process.env.DB_NAME;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

console.log('--- DB Connection Test ---');
console.log(`Host:     ${host || '(MISSING)'}`);
console.log(`Port:     ${port}`);
console.log(`Database: ${database || '(MISSING)'}`);
console.log(`User:     ${user || '(MISSING)'}`);
console.log(`Password: ${password ? '***' + password.slice(-3) : '(EMPTY)'}`);
console.log('--------------------------');

if (!host || !database || !user) {
  console.error('FAIL: Missing required env vars (DB_HOST, DB_NAME, or DB_USER)');
  process.exit(1);
}

try {
  const connection = await mysql.createConnection({
    host,
    port,
    database,
    user,
    password: password || '',
  });

  const [rows] = await connection.execute('SELECT 1 AS result');
  console.log('CONNECTED SUCCESSFULLY');
  console.log('Query test:', rows[0].result === 1 ? 'PASS' : 'FAIL');
  await connection.end();
  process.exit(0);
} catch (error) {
  console.error(`FAIL: ${error.code || error.name}`);
  console.error(`Message: ${error.message}`);

  if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('→ Wrong username or password');
  } else if (error.code === 'ECONNREFUSED') {
    console.error('→ MySQL not reachable at this host/port');
  } else if (error.code === 'ER_BAD_DB_ERROR') {
    console.error('→ Database name does not exist');
  } else if (error.code === 'ENOTFOUND') {
    console.error('→ Hostname cannot be resolved (DNS failure)');
  } else if (error.code === 'ETIMEDOUT') {
    console.error('→ Connection timed out — firewall or wrong host');
  }

  process.exit(1);
}
