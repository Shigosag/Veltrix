import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard-service.js';
import { anomalyUpdateSchema } from '../lib/validation.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class DashboardController {
  static async getOverview(_req: Request, res: Response) {
    try {
      const data = await DashboardService.getOverviewData();
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Telemetry aggregation failed' });
    }
  }

  static async updateAnomaly(req: AuthenticatedRequest, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid anomaly identifier' });
      }

      const { status } = anomalyUpdateSchema.parse(req.body);
      const updated = await DashboardService.updateAnomalyStatus(id, status, req.user?.userId);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
