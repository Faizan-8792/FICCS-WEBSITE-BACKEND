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

    // Sync tables (alter: true adds new columns without dropping data)
    await sequelize.sync({ alter: true });
    console.log('Database tables synced');

    configureCloudinary();
    await bootstrapAdmin();

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
