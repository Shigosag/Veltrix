import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken, TokenPayload } from '../lib/auth.js';
import { AUTH_COOKIE } from '../lib/constants.js';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.cookies[AUTH_COOKIE] || req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required. No session token provided.' });
  }

  const payload = await verifyAuthToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Session expired or token invalid. Please re-authenticate.' });
  }

  req.user = payload;
  next();
}

export function requireRole(...roles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Access denied: insufficient workspace permissions.' });
    }
    next();
  };
}
