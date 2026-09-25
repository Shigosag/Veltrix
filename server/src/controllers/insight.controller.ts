import { Request, Response } from 'express';
import { InsightService } from '../services/insight-service.js';

export class InsightController {
  static async list(req: Request, res: Response) {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const data = await InsightService.getInsights(category);
    res.json({ success: true, data });
  }

  static async dismiss(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'Insight ID is required' });

    await InsightService.dismissInsight(id);
    res.json({ success: true, message: 'Insight dismissed successfully' });
  }
}
