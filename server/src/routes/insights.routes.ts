import { Router } from 'express';
import { InsightController } from '../controllers/insight.controller.js';

export const insightRoutes = Router();
insightRoutes.get('/', InsightController.list);