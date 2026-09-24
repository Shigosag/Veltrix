import type { CohortRow, PerformanceMetricPoint } from '../types/analytics.js';

export class AnalyticsService {
  static getRetentionCohorts(): CohortRow[] {
    return [
      { cohort: 'Jun 2025', values: [100, 68, 52, 41, 35, 31, 28] },
      { cohort: 'Jul 2025', values: [100, 71, 55, 44, 38, 34, null] },
      { cohort: 'Aug 2025', values: [100, 73, 57, 47, 40, null, null] },
      { cohort: 'Sep 2025', values: [100, 76, 60, 49, null, null, null] },
      { cohort: 'Oct 2025', values: [100, 79, 63, null, null, null, null] },
      { cohort: 'Nov 2025', values: [100, 82, null, null, null, null, null] },
    ];
  }

  static getPerformanceTelemetry(): PerformanceMetricPoint[] {
    return [
      { hour: '00:00', latency: 42, errors: 0.1, throughput: 1240 },
      { hour: '03:00', latency: 38, errors: 0.08, throughput: 980 },
      { hour: '06:00', latency: 45, errors: 0.12, throughput: 1680 },
      { hour: '09:00', latency: 68, errors: 0.22, throughput: 3840 },
      { hour: '12:00', latency: 89, errors: 0.31, throughput: 4920 },
      { hour: '15:00', latency: 94, errors: 0.28, throughput: 5100 },
      { hour: '18:00', latency: 76, errors: 0.19, throughput: 4200 },
      { hour: '21:00', latency: 55, errors: 0.14, throughput: 2800 },
    ];
  }
}
