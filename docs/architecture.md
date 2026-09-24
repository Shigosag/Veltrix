# Veltrix Architecture

## Overview
Veltrix is constructed as a Next.js App Router modular monolith. It provides high-throughput analytics, statistical insight generation, and telemetry exploration.

## Layers & Boundaries
1. **Frontend Presentation**: Client components with Recharts, Framer Motion, and Tailwind CSS.
2. **API Layer**: Edge/Node.js App Router route handlers with Zod schema validation.
3. **Application Services**: Encapsulated business logic (`DashboardService`, `DatasetService`, `AnalyticsService`).
4. **Insight Engine**: Deterministic statistical calculations (Z-Score anomaly detection, cohort tracking) isolated behind an extensible `InsightProvider` interface.
5. **Database**: Prisma ORM with connection pooling for PostgreSQL (e.g. Neon Serverless).
