# Security Standards

1. **Authentication**: Stateless HS256 JWT tokens transmitted exclusively via `SameSite=Lax`, `HttpOnly` cookies.
2. **Password Security**: Passwords hashed with `bcryptjs` using 10 salt rounds.
3. **Input Validation**: All incoming requests strictly parsed using Zod schemas.
4. **Database Protection**: Parameterized queries via Prisma to eliminate SQL injection.
5. **Security Headers**: HSTS, CSP, X-Frame-Options, and Content-Type enforcement configured in `next.config.ts`.
