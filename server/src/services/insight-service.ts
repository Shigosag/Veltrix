import { db } from '../lib/db.js';
import type { InsightItem, InsightCategory } from '../types/insights.js';

export class InsightService {
  static async getInsights(category?: string): Promise<InsightItem[]> {
    const where: any = { dismissed: false };
    if (category && category !== 'All') {
      where.category = category;
    }

    const records = await db.insight.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });

    return records.map((r) => ({
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

  static async dismissInsight(id: string) {
    return db.insight.update({
      where: { id },
      data: { dismissed: true },
    });
  }
}
