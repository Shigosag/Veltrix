import { db } from '../lib/db.js';
import { calculateZScore } from '../lib/analytics.js';
import type { InsightItem, InsightCategory } from '../types/insights.js';

export class InsightService {
  static async getInsights(category?: string): Promise<InsightItem[]> {
    const where: any = { dismissed: false };
    if (category && category !== 'All' && category !== 'all') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    const records = await db.insight.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });

    return records.map((r: any) => ({
      id: r.id,
      category: r.category as InsightCategory,
      headline: r.headline,
      metricBadge: r.metricBadge,
      explanation: r.explanation,
      confidence: r.confidence,
      timestamp: 'Recently',
      actionLabel: r.actionLabel,
      actionUrl: r.actionUrl || undefined,
    }));
  }

  static async triggerDiagnosticScan() {
    // Scan all metrics for statistical anomalies
    const metrics = await db.metric.findMany();
    for (const m of metrics) {
      if (m.trendData && m.trendData.length >= 3) {
        const scores = calculateZScore(m.trendData);
        const latestZ = scores[scores.length - 1];
        if (Math.abs(latestZ.zScore) >= 2.0) {
          const isSpike = latestZ.zScore > 0;
          await db.anomaly.upsert({
            where: { id: `auto-${m.name}` },
            update: {
              value: `${latestZ.value}`,
              time: 'Just now',
              status: 'ACTIVE',
            },
            create: {
              id: `auto-${m.name}`,
              metric: m.label,
              time: 'Just now',
              value: `${latestZ.value}`,
              expected: `baseline (Z=${latestZ.zScore})`,
              severity: Math.abs(latestZ.zScore) >= 3.0 ? 'CRITICAL' : 'HIGH',
              status: 'ACTIVE',
              zScore: latestZ.zScore,
            },
          });
        }
      }
    }

    return this.getInsights();
  }

  static async dismissInsight(id: string) {
    return db.insight.update({
      where: { id },
      data: { dismissed: true },
    });
  }
}
