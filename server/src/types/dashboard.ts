export interface KpiItem {
  id: string;
  label: string;
  value: string;
  rawValue: number;
  change: number;
  trend: number[];
  unit?: string;
  color: string;
}

export interface MonthlyRevenuePoint {
  month: string;
  revenue: number;
  target: number;
  prev: number;
}

export interface UserGrowthPoint {
  week: string;
  dau: number;
  mau: number;
  new: number;
}

export interface ChannelMixPoint {
  name: string;
  value: number;
  color: string;
}

export interface FunnelStagePoint {
  stage: string;
  value: number;
  pct: number;
}

export interface AnomalyRecord {
  id: string;
  time: string;
  metric: string;
  value: string;
  expected: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'investigating' | 'resolved';
}