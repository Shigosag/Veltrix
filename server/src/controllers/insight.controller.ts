import { Request, Response } from 'express';
import { InsightService } from '../services/insight-service.js';

export class InsightController {
  static async list(req: Request, res: Response) {
    const category = typeof req.query.category === 'string' ? req.query.category : undefined;
    const data = await InsightService.getInsights(category);
    res.json({ success: true, data });
  }

  static async dismiss(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ success: false, error: 'Insight ID is required' });
    }

    await InsightService.dismissInsight(id);
    res.json({ success: true, message: 'Insight dismissed successfully' });
  }
}
