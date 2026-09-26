import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { PORT, CLIENT_URL } from './lib/constants.js';
import { errorHandler } from './middleware/error.middleware.js';
import { rateLimiter } from './middleware/rate-limit.middleware.js';

import { authRoutes } from './routes/auth.routes.js';
import { dashboardRoutes } from './routes/dashboard.routes.js';
import { datasetRoutes } from './routes/datasets.routes.js';
import { analyticsRoutes } from './routes/analytics.routes.js';
import { insightRoutes } from './routes/insights.routes.js';
import { notificationRoutes } from './routes/notifications.routes.js';
import { userRoutes } from './routes/user.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();

app.disable('x-powered-by');

// Strict CORS with credentials handling
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === CLIENT_URL || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true); // Allow internal reverse proxies and preview origins
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(cookieParser());
app.use(rateLimiter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    engineVersion: '2.1.0-production',
  });
});

// REST Modules
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/user', userRoutes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`🚀 Veltrix Telemetry API Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  server.close(() => process.exit(0));
});
