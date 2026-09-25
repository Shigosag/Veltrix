import { Response } from 'express';
import { NotificationService } from '../services/notification-service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class NotificationController {
  static async list(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const data = await NotificationService.listNotifications(userId);
    res.json({ success: true, data });
  }

  static async markRead(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    await NotificationService.markAllAsRead(userId);
    res.json({ success: true, message: 'All notifications marked as read' });
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;
    const { id } = req.params;
    if (!userId || !id) return res.status(400).json({ success: false, error: 'Invalid parameters' });

    await NotificationService.dismissNotification(id, userId);
    res.json({ success: true, message: 'Notification dismissed' });
  }
}
