import { Router } from 'express';
import { DatasetController } from '../controllers/dataset.controller.js';

export const datasetRoutes = Router();
datasetRoutes.get('/', DatasetController.list);
datasetRoutes.post('/', DatasetController.create);