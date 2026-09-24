import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller.js';

export const notificationRoutes = Router();
notificationRoutes.get('/', NotificationController.list);
notificationRoutes.patch('/', NotificationController.markRead);