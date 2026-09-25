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

export default function DashboardPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const [data, setData] = useState<{
    kpis: KpiItem[];
    revenueData: MonthlyRevenuePoint[];
    userGrowthData: UserGrowthPoint[];
    channelData: ChannelMixPoint[];
    conversionData: FunnelStagePoint[];
    anomalyData: AnomalyRecord[];
  } | null>(null);

  const [insights, setInsights] = useState<InsightItem[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashRes, insRes] = await Promise.all([
        fetch('/api/dashboard', { credentials: 'include' }),
        fetch('/api/insights', { credentials: 'include' }),
      ]);

      const dashJson = await dashRes.json();
      const insJson = await insRes.json();

      if (dashJson.success) setData(dashJson.data);
      if (insJson.success) setInsights(insJson.data);
    } catch (e: any) {
      showToast('Telemetry Stream Offline', { type: 'error', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Command Center" onRefresh={fetchData} refreshing={loading} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 w-full">
          {/* KPI Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {data?.kpis.map((kpi) => (
              <KpiCard
                key={kpi.id}
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
            <div
              className="xl:col-span-2 rounded-2xl p-5"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
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

              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={data?.revenueData || []} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} width={48} />
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', borderColor: 'var(--border)', borderRadius: '12px' }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#f43f5e" strokeWidth={2} fill="url(#revGrad)" />
                  <Area type="monotone" dataKey="target" stroke="#818cf8" strokeWidth={1.5} fill="none" strokeDasharray="4 4" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <InsightsPanel insights={insights} />
          </div>

          {/* User Growth & Breakdown Distributions */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>DAU Growth</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Weekly active users</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data?.userGrowthData || []} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} width={32} />
                  <Bar dataKey="dau" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="new" fill="#818cf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
              <h3 className="text-sm font-semibold mb-0.5" style={{ color: 'var(--foreground)' }}>Traffic Sources</h3>
              <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>Channel attribution — 30 days</p>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={130} height={130}>
                  <PieChart>
                    <Pie data={data?.channelData || []} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" strokeWidth={0}>
                      {data?.channelData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1.5">
                  {data?.channelData.map((d) => (
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
                {data?.conversionData.map((stage) => (
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

          {/* Active Anomalies Alert Section */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Active Telemetry Anomalies</h3>
            </div>
            <DataTable anomalies={data?.anomalyData || []} />
          </div>
        </main>
      </div>
    </div>
  );
}
