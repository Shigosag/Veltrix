import { db } from '../lib/db.js';

export class NotificationService {
  static async listNotifications(userId: string) {
    return db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  static async markAllAsRead(userId: string) {
    return db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }

  static async dismissNotification(id: string, userId: string) {
    return db.notification.deleteMany({
      where: { id, userId },
    });
  }
}
