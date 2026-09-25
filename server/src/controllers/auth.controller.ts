import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../lib/db.js';
import { signAuthToken } from '../lib/auth.js';
import { AUTH_COOKIE } from '../lib/constants.js';
import { loginSchema } from '../lib/validation.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = loginSchema.parse(req.body);

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, error: 'Invalid email address or password' });
    }

    const token = await signAuthToken({ userId: user.id, email: user.email, role: user.role });

    res.cookie(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  }

  static me(req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthenticated' });
    }
    return res.json({ success: true, data: { user: req.user } });
  }

  static logout(_req: Request, res: Response) {
    res.clearCookie(AUTH_COOKIE, { path: '/' });
    return res.json({ success: true, message: 'Signed out successfully' });
  }
}
