import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics-service.js';

export class AnalyticsController {
  static getTelemetry(_req: Request, res: Response) {
    const cohorts = AnalyticsService.getRetentionCohorts();
    const performance = AnalyticsService.getPerformanceTelemetry();
    res.json({ success: true, data: { cohorts, performance } });
  }
}