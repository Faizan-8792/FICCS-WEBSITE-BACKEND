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

  // TEMPORARY DEBUG — remove after verifying Hostinger env vars
  if (process.env.NODE_ENV !== 'production') {
    console.log('[DB DEBUG]', {
      DB_HOST: host,
      DB_PORT: port,
      DB_NAME: database,
      DB_USER: username,
      DB_PASSWORD_LENGTH: password?.length,
    });
  }

  sequelize = new Sequelize(database, username, password, {
    host,
    port: Number(port),
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'production' ? false : console.log,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
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
