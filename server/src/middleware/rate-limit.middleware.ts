import { Request, Response, NextFunction } from 'express';
import { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } from '../lib/constants.js';

interface ClientTracker {
  count: number;
  resetTime: number;
}

const ipBuckets = new Map<string, ClientTracker>();

// Periodic garbage collection every 5 minutes to prevent memory leaks from client IP scans
setInterval(() => {
  const now = Date.now();
  for (const [ip, tracker] of ipBuckets.entries()) {
    if (now > tracker.resetTime) {
      ipBuckets.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.ip || req.socket.remoteAddress || '127.0.0.1';
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
    const retryAfter = Math.max(1, Math.ceil((tracker.resetTime - now) / 1000));
    res.setHeader('Retry-After', retryAfter);
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please throttle your requests.',
    });
  }

  tracker.count += 1;
  next();
}
