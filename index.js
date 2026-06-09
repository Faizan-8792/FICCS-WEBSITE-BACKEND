import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bootstrapAdmin } from './config/bootstrapAdmin.js';
import { configureCloudinary } from './config/cloudinary.js';
import { connectDb, getSequelize } from './config/db.js';
import { initModels } from './models/index.js';
import { ensureMembershipColumns } from './scripts/migrateMembershipColumns.js';
import { ensureMessageColumns } from './scripts/migrateMessageColumns.js';
import { ensureUserColumns } from './scripts/migrateUserColumns.js';
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

// Behind Hostinger's LiteSpeed/Passenger proxy. Trust it so req.ip and
// express-rate-limit see the real client IP (via X-Forwarded-For) instead of
// the proxy's, otherwise all users share one rate-limit bucket.
app.set('trust proxy', 1);

// Security headers (CSP disabled here because the SPA is served from a separate
// origin; API responses are JSON). HSTS + sniff/frame protections stay on.
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Gzip responses — large JSON payloads (content blobs, member lists) ship
// smaller, cutting bandwidth and time-to-first-byte under load.
app.use(compression());

// Tracks whether the background DB initialization has completed. Routes under
// /api wait for this (return 503 until ready) so a request arriving during the
// slow remote-MySQL connect never crashes on an uninitialized model.
let dbReady = false;
// Resolves when background DB init completes (or rejects on failure). The /api
// readiness gate awaits this so the first request on a fresh worker doesn't 503.
let resolveReady;
let rejectReady;
const readyPromise = new Promise((resolve, reject) => {
  resolveReady = resolve;
  rejectReady = reject;
});
// Prevent an unhandled rejection warning if init fails before any request awaits.
readyPromise.catch(() => {});
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
// Concise logs in production, verbose in dev.
app.use(morgan(isDevMode ? 'dev' : 'combined'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global API rate limit — blunt protection against scraping / abuse / accidental
// floods. Generous enough for normal SPA browsing (many GETs per page view).
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300, // 300 req/min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please slow down.' },
});

// Strict limiter for auth — defends against credential stuffing / brute force.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 attempts / 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only count failed logins toward the limit
  message: { message: 'Too many attempts. Try again in a few minutes.' },
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', dbReady, timestamp: new Date().toISOString() });
});

// Root route — LiteSpeed's cache crawler and uptime checks hit "/". Respond
// 200 so it doesn't generate constant 404 noise in the logs.
app.get('/', (req, res) => {
  res.json({ service: 'FICCS API', status: 'ok' });
});

// Readiness gate: until the background DB init finishes, model getters return
// undefined and would crash a handler. Instead of instantly 503-ing (which
// caused the first request on a freshly-spawned Passenger worker to fail),
// WAIT for the init promise to resolve, then continue. Only 503 if init truly
// fails or takes unreasonably long.
app.use('/api', async (req, res, next) => {
  if (dbReady) return next();
  try {
    await Promise.race([
      readyPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 15000)),
    ]);
    if (dbReady) return next();
  } catch {
    // fall through to 503
  }
  res.status(503).json({ message: 'Service starting, please retry in a moment.' });
});

// Apply the global rate limiter to all API routes (after the readiness gate so
// 503s during startup don't consume a user's quota).
app.use('/api', apiLimiter);

app.use('/api/auth', authLimiter, authRoutes);
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
  // Start the HTTP server IMMEDIATELY, before any DB work. Under Phusion
  // Passenger (Hostinger), the app must call listen() quickly or Passenger
  // kills the spawn and resets the connection at the TLS layer (TCP connects,
  // TLS never completes — the exact ERR_CONNECTION_RESET symptom). Connecting
  // to the REMOTE MySQL (srv1983.hstgr.io) is slow, so it must NOT gate listen.
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });

  // Initialize the database in the background. Routes that need models await
  // the shared connection promise (see config/db.js). The server stays
  // reachable (health, static, root) even while this is in progress.
  try {
    const sequelize = await connectDb();
    initModels(sequelize);

    // Never use alter:true in production — on MariaDB it re-adds the users.email
    // unique index on every boot, eventually hitting MySQL's 64-key limit.
    const syncOptions = process.env.NODE_ENV === 'production' ? {} : { alter: true };
    await sequelize.sync(syncOptions);
    console.log('Database tables synced');

    // Self-healing migration: production sync uses {} (no alter), so columns
    // added to models after the table already exists are NOT auto-created.
    // Backfill the membership two-stage columns (userId, documentStatus,
    // paymentStatus) here so deploys don't require a manual migration step.
    // Idempotent — only adds what's missing.
    try {
      await ensureMembershipColumns(sequelize);
    } catch (migrationError) {
      console.error('[startup] membership column migration failed:', migrationError.message);
    }

    try {
      await ensureMessageColumns(sequelize);
    } catch (migrationError) {
      console.error('[startup] message column migration failed:', migrationError.message);
    }

    try {
      await ensureUserColumns(sequelize);
    } catch (migrationError) {
      console.error('[startup] user column migration failed:', migrationError.message);
    }

    dbReady = true;
    resolveReady();

    configureCloudinary();
    await bootstrapAdmin();
  } catch (error) {
    // Do NOT exit — keep the server up so the platform doesn't crash-loop.
    console.error('[startup] database/init error:', error.message);
    rejectReady(error);
  }
};

start();
