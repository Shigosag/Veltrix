import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken, TokenPayload } from '../lib/auth.js';
import { AUTH_COOKIE } from '../lib/constants.js';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies[AUTH_COOKIE] || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ success: false, error: 'Authentication required' });

  const payload = await verifyAuthToken(token);
  if (!payload) return res.status(401).json({ success: false, error: 'Invalid or expired session' });

  req.user = payload;
  next();
}