export interface CohortRow {
  cohort: string;
  values: (number | null)[];
}

export interface PerformanceMetricPoint {
  hour: string;
  latency: number;
  errors: number;
  throughput: number;
}