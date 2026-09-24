'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { BrainCircuit, Filter, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import type { InsightItem } from '@/types/insights';

export default function InsightsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/insights')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setInsights(json.data);
      });
  }, []);

  const filtered = filter ? insights.filter((i) => i.category === filter) : insights;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="AI Insights" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-[1000px] mx-auto w-full">
          <div
            className="rounded-2xl p-5 flex items-center gap-4"
            style={{
              background: 'linear-gradient(135deg, var(--rose-subtle), transparent)',
              border: '1px solid var(--rose-subtle-border)',
            }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-rose-500/10 text-rose-500">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Statistical Insight Engine</h2>
              <p className="text-xs text-muted-foreground">{insights.length} total findings identified</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              Engine v2.1 Active
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            {[null, 'Revenue', 'Anomaly', 'Opportunity', 'Trend'].map((cat) => (
              <button
                key={String(cat)}
                onClick={() => setFilter(cat)}
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: filter === cat ? '#f43f5e' : 'var(--card)',
                  color: filter === cat ? '#fff' : 'var(--muted-foreground)',
                  border: '1px solid var(--border)',
                }}
              >
                {cat || 'All'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map((item) => {
              const isOpen = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden transition-all"
                  style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
                >
                  <button
                    onClick={() => setExpandedId(isOpen ? null : item.id)}
                    className="w-full flex items-start gap-4 p-4 text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-500">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm font-semibold">{item.headline}</p>
                      <p className="text-xs font-semibold mt-1 font-mono-data text-rose-500">{item.metricBadge}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono-data font-semibold text-emerald-500">{item.confidence}% conf</span>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-xs leading-relaxed text-muted-foreground">{item.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
