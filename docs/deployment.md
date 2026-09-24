# Deployment Guide ($0 Tier)

## Target Platform
- **Frontend & API**: Vercel (Hobby Tier: $0)
- **Database**: Neon Serverless PostgreSQL (Free Tier: $0)

## Steps
1. Push repository to GitHub.
2. Create free database on [Neon.tech](https://neon.tech) and copy `DATABASE_URL`.
3. Import project into Vercel and supply:
   - `DATABASE_URL`
   - `JWT_SECRET`
4. Deploy. Database schema migrations run automatically via `prisma migrate deploy`.
