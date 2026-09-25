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

// CORS configuration with credentials support
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development, same-origin proxy, and configured CLIENT_URL
      if (!origin || origin === CLIENT_URL || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive for production container environments with rewrites
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(rateLimiter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
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

app.listen(PORT, () => {
  console.log(`🚀 Veltrix Telemetry API Server running on port ${PORT}`);
});
