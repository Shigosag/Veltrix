# Database Design

## Entities
- **User & Profile**: Core account profiles with role definitions (`ADMIN`, `ANALYST`, `VIEWER`).
- **Metric**: Live analytics metrics with historical trend values for sparkline rendering.
- **Insight**: Actionable diagnostic findings with confidence metrics.
- **Dataset & DatasetColumn**: Extensible catalog with JSONB storage for ad-hoc ingestion.
