# Veltrix API Documentation

## Base URL
`/api`

## Authentication
All protected routes require an `HttpOnly` cryptographically signed cookie (`veltrix_session_token`) issued upon valid credentials verification or supplied via `Authorization: Bearer <token>`.

---

## Endpoints

### 1. Authentication
* `POST /api/auth`: Validate email & password. Sets session cookie.
* `GET /api/auth/me`: Inspect authenticated token session.
* `DELETE /api/auth`: Invalidate session and clear authentication cookie.

### 2. Dashboard & Telemetry
* `GET /api/dashboard`: Aggregated telemetry payload:
  * `kpis`: Revenue, DAU, Avg Duration, Conversion Rate with SVG sparkline arrays.
  * `revenueData`: Monthly revenue vs projection.
  * `userGrowthData`: Weekly DAU and new acquisition trend.
  * `channelData`: Traffic source attribution.
  * `conversionData`: Funnel stage throughput.
  * `anomalyData`: Outlier monitoring metrics.
* `PATCH /api/dashboard/anomalies/:id`: Triage anomaly status (`active` | `investigating` | `resolved`).

### 3. Datasets
* `GET /api/datasets?search=&status=`: Search and filter ingested dataset metadata.
* `POST /api/datasets`: Ingest ad-hoc JSON array payload into PostgreSQL JSONB with automatic schema inference.
* `PATCH /api/datasets/:id/archive`: Toggle dataset lifecycle between `READY` and `ARCHIVED`.
* `DELETE /api/datasets/:id`: Tenant-scoped removal of dataset records.

### 4. Diagnostics & AI Insights
* `GET /api/insights?category=`: Retrieve active diagnostics with confidence intervals.
* `POST /api/insights/analyze`: Trigger real-time statistical evaluation and Z-score outlier detection.
* `PATCH /api/insights/:id/dismiss`: Dismiss active insight finding.

### 5. User & Workspace
* `GET /api/user/profile`: Retrieve user profile, activity audit, and preferences.
* `PUT /api/user/profile`: Update allowlisted profile metadata.
* `PUT /api/user/preferences`: Synchronize theme, density, and alert settings.
