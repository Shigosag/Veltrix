import { Request, Response } from 'express';
import { InsightService } from '../services/insight-service.js';

export class InsightController {
  static async list(req: Request, res: Response) {
    try {
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const data = await InsightService.getInsights(category);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async analyze(_req: Request, res: Response) {
    try {
      const insights = await InsightService.triggerDiagnosticScan();
      res.json({ success: true, message: 'Diagnostic scan complete', data: insights });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async dismiss(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'Insight ID is required' });
      }

      await InsightService.dismissInsight(id);
      res.json({ success: true, message: 'Insight dismissed successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
