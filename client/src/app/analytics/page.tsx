'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { FilterBar } from '@/components/dashboard/filter-bar';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { exportToCsv } from '@/lib/csv';
import { useToast } from '@/context/toast-context';
import type { CohortRow, PerformanceMetricPoint } from '@/types/analytics';
import type { MonthlyRevenuePoint, UserGrowthPoint } from '@/types/dashboard';

const AVAILABLE_METRICS = [
  { name: 'Revenue', color: '#f43f5e' },
  { name: 'DAU', color: '#818cf8' },
  { name: 'Sessions', color: '#34d399' },
  { name: 'Conversions', color: '#fbbf24' },
  { name: 'Latency', color: '#60a5fa' },
  { name: 'Errors', color: '#f97316' },
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

const INITIAL_COHORTS: CohortRow[] = [
  { cohort: 'Jun 2025', values: [100, 68, 52, 41, 35, 31, 28] },
  { cohort: 'Jul 2025', values: [100, 71, 55, 44, 38, 34, null] },
  { cohort: 'Aug 2025', values: [100, 73, 57, 47, 40, null, null] },
  { cohort: 'Sep 2025', values: [100, 76, 60, 49, null, null, null] },
  { cohort: 'Oct 2025', values: [100, 79, 63, null, null, null, null] },
  { cohort: 'Nov 2025', values: [100, 82, null, null, null, null, null] },
];

const INITIAL_PERFORMANCE: PerformanceMetricPoint[] = [
  { hour: '00:00', latency: 42, errors: 0.1, throughput: 1240 },
  { hour: '03:00', latency: 38, errors: 0.08, throughput: 980 },
  { hour: '06:00', latency: 45, errors: 0.12, throughput: 1680 },
  { hour: '09:00', latency: 68, errors: 0.22, throughput: 3840 },
  { hour: '12:00', latency: 89, errors: 0.31, throughput: 4920 },
  { hour: '15:00', latency: 94, errors: 0.28, throughput: 5100 },
  { hour: '18:00', latency: 76, errors: 0.19, throughput: 4200 },
  { hour: '21:00', latency: 55, errors: 0.14, throughput: 2800 },
];

export default function AnalyticsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [range, setRange] = useState('30D');
  const [activeMetrics, setActiveMetrics] = useState<string[]>(['Revenue', 'DAU']);
  const [tab, setTab] = useState<'trend' | 'performance' | 'cohorts'>('trend');
  const [cohorts, setCohorts] = useState<CohortRow[]>(INITIAL_COHORTS);
  const [performance, setPerformance] = useState<PerformanceMetricPoint[]>(INITIAL_PERFORMANCE);
  const [revenueData, setRevenueData] = useState<MonthlyRevenuePoint[]>(INITIAL_REVENUE);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthPoint[]>(INITIAL_USER_GROWTH);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const [analyticsRes, dashRes] = await Promise.all([
        fetch('/api/analytics', { credentials: 'include' }),
        fetch('/api/dashboard', { credentials: 'include' }),
      ]);

      if (analyticsRes.ok) {
        const analyticsJson = await analyticsRes.json();
        if (analyticsJson.success && analyticsJson.data) {
          if (analyticsJson.data.cohorts?.length) setCohorts(analyticsJson.data.cohorts);
          if (analyticsJson.data.performance?.length) setPerformance(analyticsJson.data.performance);
        }
      }

      if (dashRes.ok) {
        const dashJson = await dashRes.json();
        if (dashJson.success && dashJson.data) {
          if (dashJson.data.revenueData?.length) setRevenueData(dashJson.data.revenueData);
          if (dashJson.data.userGrowthData?.length) setUserGrowthData(dashJson.data.userGrowthData);
        }
      }
    } catch {
      // Retain baseline data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const toggleMetric = (m: string) => {
    setActiveMetrics((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const handleExport = () => {
    try {
      if (tab === 'trend') {
        exportToCsv('revenue_trend_export.csv', revenueData as unknown as Record<string, unknown>[]);
      } else if (tab === 'performance') {
        exportToCsv('system_performance_export.csv', performance as unknown as Record<string, unknown>[]);
      } else {
        const flattened = cohorts.map((c) => ({
          cohort: c.cohort,
          ...c.values.reduce((acc, v, idx) => ({ ...acc, [`M${idx}`]: v ?? '' }), {}),
        }));
        exportToCsv('retention_cohorts_export.csv', flattened);
      }
      showToast('CSV Exported', { type: 'success', message: `Exported ${tab} dataset successfully.` });
    } catch (err: any) {
      showToast('Export Failed', { type: 'error', message: err.message });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Analytics Explorer" onRefresh={fetchTelemetry} refreshing={loading} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 w-full">
          <FilterBar selectedRange={range} onRangeChange={setRange} onExport={handleExport} />

          {/* Metric Toggle Filters */}
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_METRICS.map((m) => {
              const active = activeMetrics.includes(m.name);
              return (
                <button
                  key={m.name}
                  onClick={() => toggleMetric(m.name)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: active ? `${m.color}18` : 'var(--card)',
                    color: active ? m.color : 'var(--muted-foreground)',
                    border: active ? `1px solid ${m.color}40` : '1px solid var(--border)',
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: active ? m.color : 'var(--muted-foreground)' }} />
                  {m.name}
                </button>
              );
            })}
          </div>

          <div className="flex gap-1 rounded-xl p-1" style={{ background: 'var(--muted)', width: 'fit-content' }}>
            {(['trend', 'performance', 'cohorts'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                style={{
                  background: tab === t ? 'var(--card)' : 'transparent',
                  color: tab === t ? 'var(--foreground)' : 'var(--muted-foreground)',
                  boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* TREND TAB */}
          {tab === 'trend' && (
            <div className="space-y-4">
              <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Revenue Trend</h3>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>30-day rolling — includes target baseline</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono-data text-rose-500">$312K</div>
                    <div className="text-xs text-emerald-500 font-semibold">↑ 18.4% vs prior period</div>
                  </div>
                </div>

                <div className="w-full h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} width={48} />
                      <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                      <ReferenceLine y={250000} stroke="#818cf8" strokeDasharray="4 4" strokeWidth={1} />
                      {activeMetrics.includes('Revenue') && (
                        <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#f43f5e" strokeWidth={2} fill="url(#aGrad)" />
                      )}
                      <Line type="monotone" dataKey="target" name="Target" stroke="#818cf8" strokeWidth={1.5} dot={false} strokeDasharray="6 3" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>User Growth</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>DAU, MAU and new acquisitions</p>

                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userGrowthData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                      <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={36} />
                      <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                      {activeMetrics.includes('DAU') && (
                        <Line type="monotone" dataKey="dau" name="DAU" stroke="#f43f5e" strokeWidth={2} dot={false} />
                      )}
                      <Line type="monotone" dataKey="new" name="New users" stroke="#10b981" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="mau" name="MAU" stroke="#818cf8" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* PERFORMANCE TAB */}
          {tab === 'performance' && (
            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>System Performance</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Latency, error rate, and throughput — 24h view</p>
              <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performance} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                    <XAxis dataKey="hour" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="lat" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}ms`} width={44} />
                    <YAxis yAxisId="thr" orientation="right" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(1)}K`} width={40} />
                    <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                    <ReferenceLine yAxisId="lat" y={120} stroke="#ef4444" strokeDasharray="4 4" strokeWidth={1} />
                    <Area yAxisId="lat" type="monotone" dataKey="latency" name="Latency (ms)" stroke="#818cf8" strokeWidth={2} fill="url(#latGrad)" dot={false} />
                    <Bar yAxisId="thr" dataKey="throughput" name="Throughput" fill="#f43f5e" fillOpacity={0.5} radius={[2, 2, 0, 0]} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-px border-t-2 border-dashed border-rose-500" />
                  <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>SLA threshold (120ms)</span>
                </div>
              </div>
            </div>
          )}

          {/* COHORTS TAB */}
          {tab === 'cohorts' && (
            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>Cohort Retention</h3>
              <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>User retention by acquisition month — % returning</p>
              <div className="overflow-x-auto">
                <table className="text-xs" style={{ borderCollapse: 'separate', borderSpacing: '3px' }}>
                  <thead>
                    <tr>
                      <th className="text-left px-3 py-2 font-semibold" style={{ color: 'var(--muted-foreground)' }}>Cohort</th>
                      {['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'].map((m) => (
                        <th key={m} className="text-center px-3 py-2 font-semibold" style={{ color: 'var(--muted-foreground)' }}>{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cohorts.map((row) => (
                      <tr key={row.cohort}>
                        <td className="px-3 py-2 font-medium whitespace-nowrap" style={{ color: 'var(--foreground)' }}>{row.cohort}</td>
                        {row.values.map((v, i) => (
                          <td
                            key={i}
                            className="px-3 py-2 rounded-lg text-center font-mono-data font-semibold"
                            style={{
                              background:
                                v == null
                                  ? 'transparent'
                                  : v === 100
                                  ? 'rgba(244,63,94,0.85)'
                                  : v >= 60
                                  ? `rgba(244,63,94,${v / 130})`
                                  : v >= 40
                                  ? `rgba(129,140,248,${v / 130})`
                                  : `rgba(129,140,248,${v / 200})`,
                              color: v == null ? 'transparent' : v >= 60 ? '#fff' : 'var(--foreground)',
                            }}
                          >
                            {v == null ? '—' : `${v}%`}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
