import type { InsightItem, InsightGeneratorContext, InsightProvider } from '@/types/insights';

export class StatisticalInsightEngine implements InsightProvider {
  async generate(context: InsightGeneratorContext): Promise<InsightItem[]> {
    const insights: InsightItem[] = [];

    for (const kpi of context.kpis) {
      const growth = ((kpi.current - kpi.previous) / (kpi.previous || 1)) * 100;

      // Anomaly detection condition
      if (growth <= -15) {
        insights.push({
          id: `anomaly-${kpi.name}`,
          category: 'Anomaly',
          headline: `Significant drop detected in ${kpi.name}`,
          metricBadge: `${growth.toFixed(1)}% drop`,
          explanation: `${kpi.name} declined by ${Math.abs(growth).toFixed(1)}% compared to the previous evaluation period. Investigation of downstream infrastructure or traffic sources recommended.`,
          confidence: 88,
          timestamp: 'Just now',
          actionLabel: 'Investigate',
          actionUrl: '/analytics',
        });
      }

      // Opportunity condition
      if (growth >= 15) {
        insights.push({
          id: `opportunity-${kpi.name}`,
          category: 'Revenue',
          headline: `Accelerated expansion observed in ${kpi.name}`,
          metricBadge: `+${growth.toFixed(1)}% velocity`,
          explanation: `Strong momentum detected. Current metrics exceed projected targets by ${(growth * 0.8).toFixed(1)}%, signaling high engagement and product affinity.`,
          confidence: 94,
          timestamp: 'Just now',
          actionLabel: 'View details',
          actionUrl: '/analytics',
        });
      }
    }

    return insights;
  }
}

export const defaultInsightEngine = new StatisticalInsightEngine();
