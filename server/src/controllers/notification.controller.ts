import { Response } from 'express';
import { NotificationService } from '../services/notification-service.js';
import { db } from '../lib/db.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class NotificationController {
  static async list(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || (await db.user.findFirst())?.id || '';
    const data = await NotificationService.listNotifications(userId);
    res.json({ success: true, data });
  }

  static async markRead(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId || (await db.user.findFirst())?.id;
    if (userId) await NotificationService.markAllAsRead(userId);
    res.json({ success: true });
  }
}