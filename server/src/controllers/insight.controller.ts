import { Request, Response } from 'express';
import { InsightService } from '../services/insight-service.js';

export class InsightController {
  static async list(req: Request, res: Response) {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const data = await InsightService.getInsights(category);
    res.json({ success: true, data });
  }
}