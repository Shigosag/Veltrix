export type InsightCategory = 'Revenue' | 'Anomaly' | 'Opportunity' | 'Trend';

export interface InsightItem {
  id: string;
  category: InsightCategory;
  headline: string;
  metricBadge: string;
  explanation: string;
  confidence: number;
  timestamp: string;
  actionLabel: string;
  actionUrl?: string;
}

export interface InsightGeneratorContext {
  kpis: { name: string; current: number; previous: number; target?: number }[];
  timeSeries: { timestamp: string; value: number }[];
}

export interface InsightProvider {
  generate(context: InsightGeneratorContext): Promise<InsightItem[]>;
}
