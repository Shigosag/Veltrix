import { Response } from 'express';
import { DatasetService } from '../services/dataset-service.js';
import { datasetCreateSchema } from '../lib/validation.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class DatasetController {
  static async list(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;
      const data = await DatasetService.listDatasets(userId, search, status);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

      const body = datasetCreateSchema.parse(req.body);
      const record = await DatasetService.createDataset(userId, body.name, body.jsonData, body.tags);
      res.status(201).json({ success: true, data: record });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async toggleArchive(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!userId || !id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid request parameters' });
      }

      const updated = await DatasetService.toggleArchive(userId, id);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      if (!userId || !id || typeof id !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid request parameters' });
      }

      await DatasetService.deleteDataset(userId, id);
      res.json({ success: true, message: 'Dataset removed successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
