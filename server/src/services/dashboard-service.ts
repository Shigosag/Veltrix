import { db } from '../lib/db.js';
import { calculateGrowthRate } from '../lib/analytics.js';
import type { KpiItem, MonthlyRevenuePoint, UserGrowthPoint, ChannelMixPoint, FunnelStagePoint, AnomalyRecord } from '../types/dashboard.js';

export class DashboardService {
  static async getOverviewData() {
    const [rawMetrics, dbAnomalies] = await Promise.all([
      db.metric.findMany({ orderBy: { category: 'asc' } }),
      db.anomaly.findMany({ orderBy: { createdAt: 'desc' }, take: 10 }),
    ]);

    const kpis: KpiItem[] = rawMetrics.map((m: any) => {
      const change = calculateGrowthRate(m.currentVal, m.previousVal);
      let formattedVal = m.currentVal.toLocaleString();
      if (m.type === 'CURRENCY') formattedVal = `$${m.currentVal.toLocaleString()}`;
      if (m.type === 'PERCENTAGE') formattedVal = `${m.currentVal}%`;
      if (m.type === 'DURATION') formattedVal = `${Math.floor(m.currentVal / 60)}m ${Math.floor(m.currentVal % 60)}s`;

      return {
        id: m.id,
        label: m.label,
        value: formattedVal,
        rawValue: m.currentVal,
        change,
        trend: m.trendData && m.trendData.length ? m.trendData : [80, 85, 90, 95, 100],
        unit: m.unit || undefined,
        color: m.name.includes('revenue') ? '#f43f5e' : m.name.includes('dau') ? '#818cf8' : m.name.includes('duration') ? '#34d399' : '#fbbf24',
      };
    });

    const revenueData: MonthlyRevenuePoint[] = [
      { month: 'Jan', revenue: 142000, target: 130000, prev: 98000 },
      { month: 'Feb', revenue: 158000, target: 145000, prev: 112000 },
      { month: 'Mar', revenue: 167000, target: 155000, prev: 125000 },
      { month: 'Apr', revenue: 182000, target: 168000, prev: 138000 },
      { month: 'May', revenue: 195000, target: 178000, prev: 151000 },
      { month: 'Jun', revenue: 213000, target: 192000, prev: 163000 },
      { month: 'Jul', revenue: 228000, target: 205000, prev: 175000 },
      { month: 'Aug', revenue: 241000, target: 218000, prev: 188000 },
      { month: 'Sep', revenue: 256000, target: 230000, prev: 201000 },
      { month: 'Oct', revenue: 271000, target: 244000, prev: 214000 },
      { month: 'Nov', revenue: 288000, target: 258000, prev: 227000 },
      { month: 'Dec', revenue: 312000, target: 275000, prev: 241000 },
    ];

    const userGrowthData: UserGrowthPoint[] = [
      { week: 'W1', dau: 12400, mau: 48200, new: 1840 },
      { week: 'W2', dau: 13100, mau: 49800, new: 2100 },
      { week: 'W3', dau: 14200, mau: 51400, new: 2380 },
      { week: 'W4', dau: 13800, mau: 52900, new: 1920 },
      { week: 'W5', dau: 15100, mau: 54600, new: 2650 },
      { week: 'W6', dau: 16400, mau: 56800, new: 2980 },
      { week: 'W7', dau: 17200, mau: 58900, new: 3150 },
      { week: 'W8', dau: 18100, mau: 61200, new: 3420 },
    ];

    const channelData: ChannelMixPoint[] = [
      { name: 'Organic Search', value: 38.4, color: '#f43f5e' },
      { name: 'Direct', value: 24.1, color: '#818cf8' },
      { name: 'Paid Ads', value: 19.8, color: '#34d399' },
      { name: 'Referral', value: 11.2, color: '#fbbf24' },
      { name: 'Social', value: 6.5, color: '#60a5fa' },
    ];

    const conversionData: FunnelStagePoint[] = [
      { stage: 'Visitors', value: 82400, pct: 100 },
      { stage: 'Sign-ups', value: 18920, pct: 22.96 },
      { stage: 'Activated', value: 11340, pct: 13.76 },
      { stage: 'Subscribed', value: 4280, pct: 5.19 },
      { stage: 'Enterprise', value: 847, pct: 1.03 },
    ];

    const anomalyData: AnomalyRecord[] = dbAnomalies.map((a: any) => ({
      id: a.id,
      time: a.time,
      metric: a.metric,
      value: a.value,
      expected: a.expected,
      severity: a.severity.toLowerCase() as 'critical' | 'high' | 'medium' | 'low',
      status: a.status.toLowerCase() as 'active' | 'investigating' | 'resolved',
    }));

    return {
      kpis,
      revenueData,
      userGrowthData,
      channelData,
      conversionData,
      anomalyData,
    };
  }

  static async updateAnomalyStatus(id: string, status: 'active' | 'investigating' | 'resolved', userId?: string) {
    const updated = await db.anomaly.update({
      where: { id },
      data: {
        status: status.toUpperCase() as any,
        userId: userId || undefined,
      },
    });

    if (userId) {
      await db.activityLog.create({
        data: {
          userId,
          action: `Toggled anomaly status to ${status}`,
          resource: updated.metric,
        },
      });
    }

    return {
      id: updated.id,
      time: updated.time,
      metric: updated.metric,
      value: updated.value,
      expected: updated.expected,
      severity: updated.severity.toLowerCase(),
      status: updated.status.toLowerCase(),
    };
  }
}
