import { Router } from 'express';
import { DatasetController } from '../controllers/dataset.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const datasetRoutes = Router();

datasetRoutes.get('/', requireAuth, DatasetController.list);
datasetRoutes.post('/', requireAuth, DatasetController.create);
datasetRoutes.patch('/:id/archive', requireAuth, DatasetController.toggleArchive);
datasetRoutes.delete('/:id', requireAuth, DatasetController.delete);
