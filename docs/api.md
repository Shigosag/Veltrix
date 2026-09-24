# Veltrix API Documentation

## Endpoints

### Auth
- `POST /api/auth`: Authenticates credentials and issues `veltrix_session_token` HTTP-only cookie.
- `DELETE /api/auth`: Clears session token.

### Dashboard
- `GET /api/dashboard`: Aggregated telemetry payload (KPIs, revenue series, distributions).

### Datasets
- `GET /api/datasets`: Search, filter, and list metadata.
- `POST /api/datasets`: Ingest JSON records into the dataset repository.

### Analytics
- `GET /api/analytics`: Returns cohort retention matrices and performance graphs.

### Insights
- `GET /api/insights`: Returns active statistical and anomaly insights.
