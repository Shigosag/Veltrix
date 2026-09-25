import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const notificationRoutes = Router();

notificationRoutes.get('/', requireAuth, NotificationController.list);
notificationRoutes.patch('/', requireAuth, NotificationController.markRead);
notificationRoutes.delete('/:id', requireAuth, NotificationController.delete);
