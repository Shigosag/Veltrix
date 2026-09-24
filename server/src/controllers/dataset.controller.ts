import { Request, Response } from 'express';
import { DatasetService } from '../services/dataset-service.js';
import { datasetCreateSchema } from '../lib/validation.js';
import { db } from '../lib/db.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class DatasetController {
  static async list(req: Request, res: Response) {
    try {
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;
      const data = await DatasetService.listDatasets(search, status);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const body = datasetCreateSchema.parse(req.body);
      const userId = req.user?.userId || (await db.user.findFirst())?.id;
      if (!userId) return res.status(400).json({ success: false, error: 'User required' });

      const record = await DatasetService.createDataset(userId, body.name, body.jsonData, body.tags);
      res.status(201).json({ success: true, data: record });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}