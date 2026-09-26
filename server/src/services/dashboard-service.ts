import { db } from '../lib/db.js';
import { calculateGrowthRate } from '../lib/analytics.js';
import type { KpiItem, MonthlyRevenuePoint, UserGrowthPoint, ChannelMixPoint, FunnelStagePoint, AnomalyRecord } from '../types/dashboard.js';

export const BASELINE_KPIS: KpiItem[] = [
  {
    id: 'kpi-rev',
    label: 'Monthly Revenue',
    value: '$312,480',
    rawValue: 312480,
    change: 18.4,
    trend: [82, 91, 88, 97, 104, 112, 121, 128, 137, 146, 158, 168],
    color: '#f43f5e',
  },
  {
    id: 'kpi-dau',
    label: 'Active Users (DAU)',
    value: '18,124',
    rawValue: 18124,
    change: 7.2,
    trend: [68, 72, 69, 75, 81, 84, 88, 91, 87, 94, 98, 102],
    color: '#818cf8',
  },
  {
    id: 'kpi-dur',
    label: 'Avg Session Duration',
    value: '8m 42s',
    rawValue: 522,
    change: 12.0,
    trend: [64, 68, 71, 70, 74, 77, 79, 82, 80, 85, 88, 91],
    color: '#10b981',
  },
  {
    id: 'kpi-conv',
    label: 'Conversion Rate',
    value: '5.19%',
    rawValue: 5.19,
    change: -1.9,
    trend: [62, 58, 61, 64, 60, 57, 59, 62, 58, 54, 57, 60],
    color: '#fbbf24',
  },
];

export const BASELINE_REVENUE: MonthlyRevenuePoint[] = [
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

export const BASELINE_USER_GROWTH: UserGrowthPoint[] = [
  { week: 'W1', dau: 12400, mau: 48200, new: 1840 },
  { week: 'W2', dau: 13100, mau: 49800, new: 2100 },
  { week: 'W3', dau: 14200, mau: 51400, new: 2380 },
  { week: 'W4', dau: 13800, mau: 52900, new: 1920 },
  { week: 'W5', dau: 15100, mau: 54600, new: 2650 },
  { week: 'W6', dau: 16400, mau: 56800, new: 2980 },
  { week: 'W7', dau: 17200, mau: 58900, new: 3150 },
  { week: 'W8', dau: 18100, mau: 61200, new: 3420 },
];

export const BASELINE_CHANNELS: ChannelMixPoint[] = [
  { name: 'Organic Search', value: 38.4, color: '#f43f5e' },
  { name: 'Direct', value: 24.1, color: '#818cf8' },
  { name: 'Paid Ads', value: 19.8, color: '#34d399' },
  { name: 'Referral', value: 11.2, color: '#fbbf24' },
  { name: 'Social', value: 6.5, color: '#60a5fa' },
];

export const BASELINE_CONVERSION: FunnelStagePoint[] = [
  { stage: 'Visitors', value: 82400, pct: 100 },
  { stage: 'Sign-ups', value: 18920, pct: 22.96 },
  { stage: 'Activated', value: 11340, pct: 13.76 },
  { stage: 'Subscribed', value: 4280, pct: 5.19 },
  { stage: 'Enterprise', value: 847, pct: 1.03 },
];

export const BASELINE_ANOMALIES: AnomalyRecord[] = [
  { id: 'anom-1', time: '09:14', metric: 'API Latency', value: '847ms', expected: '< 120ms', severity: 'critical', status: 'active' },
  { id: 'anom-2', time: '11:32', metric: 'Error Rate', value: '3.8%', expected: '< 0.5%', severity: 'high', status: 'active' },
  { id: 'anom-3', time: '14:07', metric: 'Drop-off Rate', value: '+142%', expected: 'baseline', severity: 'medium', status: 'investigating' },
  { id: 'anom-4', time: '16:55', metric: 'Revenue/Session', value: '-34%', expected: 'baseline', severity: 'medium', status: 'resolved' },
];

export class DashboardService {
  static async getOverviewData() {
    let kpis = BASELINE_KPIS;
    let anomalyData = BASELINE_ANOMALIES;

    try {
      const rawMetrics = await db.metric.findMany({ orderBy: { category: 'asc' } });
      if (rawMetrics && rawMetrics.length > 0) {
        kpis = rawMetrics.map((m: any) => {
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
            color: m.name.includes('revenue') ? '#f43f5e' : m.name.includes('dau') ? '#818cf8' : m.name.includes('duration') ? '#10b981' : '#fbbf24',
          };
        });
      }
    } catch {
      // Fallback gracefully to BASELINE_KPIS
    }

    try {
      const dbAnomalies = await (db as any).anomaly?.findMany({ orderBy: { createdAt: 'desc' }, take: 10 });
      if (dbAnomalies && dbAnomalies.length > 0) {
        anomalyData = dbAnomalies.map((a: any) => ({
          id: a.id,
          time: a.time,
          metric: a.metric,
          value: a.value,
          expected: a.expected,
          severity: a.severity.toLowerCase() as 'critical' | 'high' | 'medium' | 'low',
          status: a.status.toLowerCase() as 'active' | 'investigating' | 'resolved',
        }));
      }
    } catch {
      // Fallback gracefully to BASELINE_ANOMALIES
    }

    return {
      kpis,
      revenueData: BASELINE_REVENUE,
      userGrowthData: BASELINE_USER_GROWTH,
      channelData: BASELINE_CHANNELS,
      conversionData: BASELINE_CONVERSION,
      anomalyData,
    };
  }

  static async updateAnomalyStatus(id: string, status: 'active' | 'investigating' | 'resolved', userId?: string) {
    try {
      const updated = await (db as any).anomaly?.update({
        where: { id },
        data: {
          status: status.toUpperCase(),
          userId: userId || undefined,
        },
      });

      if (updated) {
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
    } catch {
      // Table may not exist yet
    }

    return {
      id,
      time: 'Just now',
      metric: 'Telemetry Anomaly',
      value: 'Updated',
      expected: 'baseline',
      severity: 'medium',
      status,
    };
  }
}
