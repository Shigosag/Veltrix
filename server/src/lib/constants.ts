export const AUTH_COOKIE = 'veltrix_session_token';
export const PORT = Number(process.env.PORT || process.env.SERVER_PORT) || 5000;
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const JWT_SECRET_STRING = process.env.JWT_SECRET || 'veltrix_production_secret_key_minimum_32_characters_long_sha256';

export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
export const RATE_LIMIT_MAX_REQUESTS = 300; // 300 requests / minute / IP
export const DEFAULT_PAGE_SIZE = 25;
