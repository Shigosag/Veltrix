export const AUTH_COOKIE = 'veltrix_session_token';
export const PORT = Number(process.env.SERVER_PORT) || 5000;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const JWT_SECRET_STRING = process.env.JWT_SECRET || 'veltrix_super_secure_production_secret_key_minimum_32_characters';

export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
export const RATE_LIMIT_MAX_REQUESTS = 180; // 180 requests per minute
