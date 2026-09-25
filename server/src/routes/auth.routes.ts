import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const authRoutes = Router();

authRoutes.post('/', AuthController.login);
authRoutes.post('/login', AuthController.login);
authRoutes.get('/me', requireAuth, AuthController.me);
authRoutes.delete('/', AuthController.logout);
authRoutes.post('/logout', AuthController.logout);
