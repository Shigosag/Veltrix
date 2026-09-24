import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard-service.js';

export class DashboardController {
  static async getOverview(_req: Request, res: Response) {
    const data = await DashboardService.getOverviewData();
    res.json({ success: true, data });
  }
}