import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';

export const dashboardRoutes = Router();
dashboardRoutes.get('/', DashboardController.getOverview);