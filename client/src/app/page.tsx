'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { KpiCard } from '@/components/dashboard/kpi-card';
import { InsightsPanel } from '@/components/dashboard/insights-panel';
import { DataTable } from '@/components/dashboard/data-table';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/context/toast-context';
import type { KpiItem, MonthlyRevenuePoint, UserGrowthPoint, ChannelMixPoint, FunnelStagePoint, AnomalyRecord } from '@/types/dashboard';
import type { InsightItem } from '@/types/insights';

const INITIAL_KPIS: KpiItem[] = [
  { id: '1', label: 'Monthly Revenue', value: '$312,480', rawValue: 312480, change: 18.4, trend: [82, 91, 88, 97, 104, 112, 121, 128, 137, 146, 158, 168], color: '#f43f5e' },
  { id: '2', label: 'Active Users (DAU)', value: '18,124', rawValue: 18124, change: 7.2, trend: [68, 72, 69, 75, 81, 84, 88, 91, 87, 94, 98, 102], color: '#818cf8' },
  { id: '3', label: 'Avg Session Duration', value: '8m 42s', rawValue: 522, change: 12.0, trend: [64, 68, 71, 70, 74, 77, 79, 82, 80, 85, 88, 91], color: '#10b981' },
  { id: '4', label: 'Conversion Rate', value: '5.19%', rawValue: 5.19, change: -1.9, trend: [62, 58, 61, 64, 60, 57, 59, 62, 58, 54, 57, 60], color: '#fbbf24' },
];

const INITIAL_REVENUE: MonthlyRevenuePoint[] = [
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

const INITIAL_USER_GROWTH: UserGrowthPoint[] = [
  { week: 'W1', dau: 12400, mau: 48200, new: 1840 },
  { week: 'W2', dau: 13100, mau: 49800, new: 2100 },
  { week: 'W3', dau: 14200, mau: 51400, new: 2380 },
  { week: 'W4', dau: 13800, mau: 52900, new: 1920 },
  { week: 'W5', dau: 15100, mau: 54600, new: 2650 },
  { week: 'W6', dau: 16400, mau: 56800, new: 2980 },
  { week: 'W7', dau: 17200, mau: 58900, new: 3150 },
  { week: 'W8', dau: 18100, mau: 61200, new: 3420 },
];

const INITIAL_CHANNELS: ChannelMixPoint[] = [
  { name: 'Organic Search', value: 38.4, color: '#f43f5e' },
  { name: 'Direct', value: 24.1, color: '#818cf8' },
  { name: 'Paid Ads', value: 19.8, color: '#34d399' },
  { name: 'Referral', value: 11.2, color: '#fbbf24' },
  { name: 'Social', value: 6.5, color: '#60a5fa' },
];

const INITIAL_CONVERSION: FunnelStagePoint[] = [
  { stage: 'Visitors', value: 82400, pct: 100 },
  { stage: 'Sign-ups', value: 18920, pct: 22.96 },
  { stage: 'Activated', value: 11340, pct: 13.76 },
  { stage: 'Subscribed', value: 4280, pct: 5.19 },
  { stage: 'Enterprise', value: 847, pct: 1.03 },
];

const INITIAL_ANOMALIES: AnomalyRecord[] = [
  { id: '1', time: '09:14', metric: 'API Latency', value: '847ms', expected: '< 120ms', severity: 'critical', status: 'active' },
  { id: '2', time: '11:32', metric: 'Error Rate', value: '3.8%', expected: '< 0.5%', severity: 'high', status: 'active' },
  { id: '3', time: '14:07', metric: 'Drop-off Rate', value: '+142%', expected: 'baseline', severity: 'medium', status: 'investigating' },
  { id: '4', time: '16:55', metric: 'Revenue/Session', value: '-34%', expected: 'baseline', severity: 'medium', status: 'resolved' },
];

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [data, setData] = useState({
    kpis: INITIAL_KPIS,
    revenueData: INITIAL_REVENUE,
    userGrowthData: INITIAL_USER_GROWTH,
    channelData: INITIAL_CHANNELS,
    conversionData: INITIAL_CONVERSION,
    anomalyData: INITIAL_ANOMALIES,
  });

  const [insights, setInsights] = useState<InsightItem[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, insRes] = await Promise.all([
        fetch('/api/dashboard', { credentials: 'include' }),
        fetch('/api/insights', { credentials: 'include' }),
      ]);

      if (dashRes.ok) {
        const dashJson = await dashRes.json();
        if (dashJson.success && dashJson.data) {
          setData({
            kpis: dashJson.data.kpis?.length ? dashJson.data.kpis : INITIAL_KPIS,
            revenueData: dashJson.data.revenueData?.length ? dashJson.data.revenueData : INITIAL_REVENUE,
            userGrowthData: dashJson.data.userGrowthData?.length ? dashJson.data.userGrowthData : INITIAL_USER_GROWTH,
            channelData: dashJson.data.channelData?.length ? dashJson.data.channelData : INITIAL_CHANNELS,
            conversionData: dashJson.data.conversionData?.length ? dashJson.data.conversionData : INITIAL_CONVERSION,
            anomalyData: dashJson.data.anomalyData?.length ? dashJson.data.anomalyData : INITIAL_ANOMALIES,
          });
        }
      }

      if (insRes.ok) {
        const insJson = await insRes.json();
        if (insJson.success && insJson.data) setInsights(insJson.data);
      }
    } catch {
      // Keep baseline data visible
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAnomalyStatusChange = (id: string, nextStatus: 'active' | 'investigating' | 'resolved') => {
    setData((prev) => ({
      ...prev,
      anomalyData: prev.anomalyData.map((a) => (a.id === id ? { ...a, status: nextStatus } : a)),
    }));
  };

  const activeCount = data.anomalyData.filter((a) => a.status === 'active').length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Command Center" onRefresh={fetchData} refreshing={loading} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 w-full">
          {/* Top 4 KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {data.kpis.map((kpi) => (
              <KpiCard
                key={kpi.label}
                label={kpi.label}
                value={kpi.value}
                change={kpi.change}
                trend={kpi.trend}
                color={kpi.color}
              />
            ))}
          </section>

          {/* Revenue Area Chart & AI Insights Panel */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2 rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
                    Revenue vs Target
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                    Monthly performance — 2025 YTD
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {[
                    { label: 'Revenue', color: '#f43f5e' },
                    { label: 'Target', color: '#818cf8' },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} width={48} />
                    <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }} formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']} />
                    <Area type="monotone" dataKey="revenue" stroke="#f43f5e" strokeWidth={2} fill="url(#revGrad)" />
                    <Area type="monotone" dataKey="target" stroke="#818cf8" strokeWidth={1.5} fill="none" strokeDasharray="4 4" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <InsightsPanel insights={insights} />
          </div>

          {/* User Growth + Traffic Sources + Conversion Funnel */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>DAU Growth</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Weekly active users</p>
              <div className="w-full h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.userGrowthData} barSize={18}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={32} />
                    <Bar dataKey="dau" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="new" fill="#818cf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>Traffic Sources</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Channel attribution — 30 days</p>
              <div className="flex items-center gap-4">
                <div className="w-[130px] h-[130px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.channelData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" strokeWidth={0}>
                        {data.channelData.map((d) => (
                          <Cell key={d.name} fill={d.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1.5">
                  {data.channelData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span>{d.name}</span>
                      </div>
                      <span className="font-mono-data font-semibold">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>Conversion Funnel</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Visitor → Enterprise</p>
              <div className="space-y-2">
                {data.conversionData.map((stage) => (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-1 text-xs">
                      <span>{stage.stage}</span>
                      <span className="font-mono-data font-semibold">{stage.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--muted)' }}>
                      <div className="h-full rounded-full bg-rose-500" style={{ width: `${stage.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Anomalies Table */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Active Telemetry Anomalies</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-500">
                  {activeCount} Active
                </span>
              </div>
            </div>
            <DataTable anomalies={data.anomalyData} onStatusChange={handleAnomalyStatusChange} />
          </div>
        </main>
      </div>
    </div>
  );
}
