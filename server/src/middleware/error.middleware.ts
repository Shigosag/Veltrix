import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: err.errors });
  }
  const status = err.status || 500;
  res.status(status).json({ success: false, error: err.message || 'Internal server error' });
}