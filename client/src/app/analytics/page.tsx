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
import type { CohortRow, PerformanceMetricPoint } from '@/types/analytics';
import type { MonthlyRevenuePoint, UserGrowthPoint } from '@/types/dashboard';

export default function AnalyticsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [range, setRange] = useState('30D');
  const [tab, setTab] = useState<'trend' | 'performance' | 'cohorts'>('trend');
  const [cohorts, setCohorts] = useState<CohortRow[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetricPoint[]>([]);
  const [revenueData, setRevenueData] = useState<MonthlyRevenuePoint[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTelemetry = async () => {
    try {
      setLoading(true);
      const [analyticsRes, dashRes] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/dashboard'),
      ]);

      const analyticsJson = await analyticsRes.json();
      const dashJson = await dashRes.json();

      if (analyticsJson.success) {
        setCohorts(analyticsJson.data.cohorts);
        setPerformance(analyticsJson.data.performance);
      }
      if (dashJson.success) {
        setRevenueData(dashJson.data.revenueData);
        setUserGrowthData(dashJson.data.userGrowthData);
      }
    } catch (e) {
      console.error('Failed loading telemetry:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const handleExport = () => {
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
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Analytics Explorer" onRefresh={fetchTelemetry} refreshing={loading} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 w-full">
          <FilterBar selectedRange={range} onRangeChange={setRange} onExport={handleExport} />

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

          {/* TREND TAB (Visual Source of Truth) */}
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
                <ResponsiveContainer width="100%" height={260}>
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
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#f43f5e" strokeWidth={2} fill="url(#aGrad)" />
                    <Line type="monotone" dataKey="target" name="Target" stroke="#818cf8" strokeWidth={1.5} dot={false} strokeDasharray="6 3" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>User Growth</h3>
                <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>DAU, MAU and new acquisitions</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={userGrowthData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={36} />
                    <Tooltip contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="dau" name="DAU" stroke="#f43f5e" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="new" name="New users" stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="mau" name="MAU" stroke="#818cf8" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* PERFORMANCE TAB */}
          {tab === 'performance' && (
            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>System Performance</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Latency, error rate, and throughput — 24h view</p>
              <ResponsiveContainer width="100%" height={280}>
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
