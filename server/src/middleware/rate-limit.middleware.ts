import { Request, Response, NextFunction } from 'express';
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } from '../lib/constants.js';

interface ClientTracker {
  count: number;
  resetTime: number;
}

const ipBuckets = new Map<string, ClientTracker>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
  const now = Date.now();

  const tracker = ipBuckets.get(ip);

  if (!tracker || now > tracker.resetTime) {
    ipBuckets.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return next();
  }

  if (tracker.count >= RATE_LIMIT_MAX_REQUESTS) {
    res.setHeader('Retry-After', Math.ceil((tracker.resetTime - now) / 1000));
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please throttle your requests.',
    });
  }

  tracker.count += 1;
  next();
}
