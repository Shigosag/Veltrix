import { Response } from 'express';
import { UserService } from '../services/user-service.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class UserController {
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const data = await UserService.getUserProfile(userId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const updated = await UserService.updateProfile(userId, req.body);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async updatePreferences(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const updated = await UserService.updatePreferences(userId, req.body);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
