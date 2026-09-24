import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';

export const authRoutes = Router();

authRoutes.post('/', AuthController.login);
authRoutes.post('/login', AuthController.login);

authRoutes.delete('/', AuthController.logout);
authRoutes.post('/logout', AuthController.logout);