import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const dashboardRoutes = Router();

dashboardRoutes.get('/', requireAuth, DashboardController.getOverview);
dashboardRoutes.patch('/anomalies/:id', requireAuth, DashboardController.updateAnomaly);
