import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bootstrapAdmin } from './config/bootstrapAdmin.js';
import { configureCloudinary } from './config/cloudinary.js';
import { connectDb, getSequelize } from './config/db.js';
import { initModels } from './models/index.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import aboutRoutes from './routes/aboutRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import homeContentRoutes from './routes/homeContentRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import membershipRoutes from './routes/membershipRoutes.js';
import membershipPageContentRoutes from './routes/membershipPageContentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

// Global safety nets — surface silent crashes in the Hostinger logs instead of
// the process dying without a trace. These often reveal the real root cause.
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const parseAllowedOrigins = () => {
  const rawOrigins = [process.env.CLIENT_URLS, process.env.CLIENT_URL]
    .filter(Boolean)
    .join(',');

  return rawOrigins
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const allowedOrigins = parseAllowedOrigins();
const isLocalhostOrigin = (origin) => /^http:\/\/localhost:\d+$/.test(origin);
const isDevMode = process.env.NODE_ENV !== 'production';

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      if (isDevMode && isLocalhostOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// TEMPORARY request logger — confirms requests reach the Node process (vs being
// dropped by the Hostinger proxy). Remove once the connection issue is resolved.
app.use((req, res, next) => {
  console.log(`[req] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/membership-page-content', membershipPageContentRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/home-content', homeContentRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/chatbot', chatbotRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  try {
    const sequelize = await connectDb();
    initModels(sequelize);

    // Sync tables. IMPORTANT: never use `alter: true` in production.
    // On MariaDB, alter cannot detect existing UNIQUE indexes (e.g. users.email)
    // and re-adds a duplicate index on every restart, eventually hitting MySQL's
    // 64-key limit ("Too many keys specified") and crashing startup.
    // In production we only create missing tables; schema changes are applied
    // intentionally via migrations/scripts, not on every boot.
    const syncOptions = process.env.NODE_ENV === 'production' ? {} : { alter: true };
    await sequelize.sync(syncOptions);
    console.log('Database tables synced');

    // Start the HTTP server FIRST so the app is reachable immediately and
    // health checks pass. Admin bootstrap / Cloudinary config must never block
    // or delay listen() — a hang there previously prevented the server from
    // binding, causing ERR_CONNECTION_RESET on the public domain.
    const port = process.env.PORT || 5000;
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening on port ${port}`);
    });

    // Post-listen, best-effort setup. Failures are logged, not fatal.
    try {
      configureCloudinary();
      await bootstrapAdmin();
    } catch (setupError) {
      console.error('[startup] post-listen setup error:', setupError.message);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
