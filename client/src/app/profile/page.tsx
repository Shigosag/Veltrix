'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MapPin, Calendar, Clock, BarChart3 } from 'lucide-react';

export default function ProfilePage() {
  const [collapsed, setCollapsed] = useState(false);

  const activities = [
    { action: 'Ran cohort retention analysis', dataset: 'User Events — Production', time: '12 min ago' },
    { action: 'Reviewed AI insight', dataset: 'APAC Segment LTV', time: '2 hr ago' },
    { action: 'Exported revenue report', dataset: 'Revenue Transactions Q4', time: '5 hr ago' },
    { action: 'Created dashboard snapshot', dataset: 'Command Center', time: '1 day ago' },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="User Profile" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-[800px] mx-auto w-full">
          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <div className="h-24 relative bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-900" />
            <div className="px-5 pb-5">
              <div className="flex items-end gap-4 -mt-8 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white border-4 border-card bg-gradient-to-br from-rose-500 to-indigo-500">
                  SA
                </div>
                <div className="flex-1 min-w-0 mb-1">
                  <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Segun Arulogun Gabriel</h2>
                  <p className="text-xs text-muted-foreground">Head of Analytics · Acme Corporation</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> San Francisco, CA</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined March 2024</div>
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Last active: just now</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Datasets accessed', value: '48' },
                  { label: 'Queries run', value: '1,284' },
                  { label: 'Reports shared', value: '32' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'var(--secondary)' }}>
                    <p className="text-xl font-bold font-mono-data text-rose-500">{s.value}</p>
                    <p className="text-[10px] mt-0.5 text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4">Recent Audit Activity</h3>
            <div className="space-y-3">
              {activities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-rose-500/10 text-rose-500">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{act.action}</p>
                    <p className="text-[10px] text-muted-foreground">{act.dataset}</p>
                  </div>
                  <span className="text-[10px] font-mono-data text-muted-foreground">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
