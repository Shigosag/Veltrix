import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';

export const analyticsRoutes = Router();
analyticsRoutes.get('/', AnalyticsController.getTelemetry);