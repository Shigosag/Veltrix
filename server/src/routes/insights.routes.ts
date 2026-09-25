import { Router } from 'express';
import { InsightController } from '../controllers/insight.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const insightRoutes = Router();

insightRoutes.get('/', requireAuth, InsightController.list);
insightRoutes.patch('/:id/dismiss', requireAuth, InsightController.dismiss);
