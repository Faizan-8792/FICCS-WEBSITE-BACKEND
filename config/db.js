import { Sequelize } from 'sequelize';

let sequelize;

export const connectDb = async () => {
  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT || 3306;
  const database = process.env.DB_NAME;
  const username = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;

  if (!host || !database || !username) {
    throw new Error(
      'DB_HOST, DB_NAME, and DB_USER must be set in backend/.env before starting the server.'
    );
  }

  sequelize = new Sequelize(database, username, password, {
    host,
    port: Number(port),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    // Hostinger shared MySQL caps concurrent connections per user (often 2-5).
    // A high pool.max means connections can never be acquired, so queries wait
    // forever and requests hang with no error. Keep the pool small and fail
    // fast instead of hanging indefinitely.
    pool: {
      max: 5,
      min: 0,
      acquire: 20000, // give up acquiring a connection after 20s (throws)
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 20000, // fail the initial TCP/handshake after 20s
    },
    retry: { max: 1 },
  });

  try {
    await sequelize.authenticate();
    console.log(`MySQL connected: ${host}:${port}/${database}`);
  } catch (error) {
    console.error(
      '\n[DB] Could not connect to MySQL. Common fixes:\n' +
        '  1. Verify DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in backend/.env.\n' +
        '  2. Ensure the MySQL server is running and accessible.\n' +
        '  3. Check that your IP is whitelisted (Hostinger remote MySQL).\n' +
        '  4. Confirm port 3306 is not blocked by a firewall/VPN.\n'
    );
    throw error;
  }

  return sequelize;
};

export { sequelize };
export const getSequelize = () => sequelize;
