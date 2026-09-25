import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

export const userRoutes = Router();

userRoutes.get('/profile', requireAuth, UserController.getProfile);
userRoutes.put('/profile', requireAuth, UserController.updateProfile);
userRoutes.put('/preferences', requireAuth, UserController.updatePreferences);
