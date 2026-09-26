'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { BrainCircuit, Filter, Sparkles, ChevronDown, ChevronUp, ArrowUpRight, Check } from 'lucide-react';
import { useToast } from '@/context/toast-context';
import type { InsightItem } from '@/types/insights';

export default function InsightsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [filter, setFilter] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { showToast } = useToast();

  const loadInsights = () => {
    fetch('/api/insights', { credentials: 'include' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setInsights(json.data);
      })
      .catch((e) => showToast('Failed to load insights', { type: 'error', message: e.message }));
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const handleDismiss = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/insights/${id}/dismiss`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setInsights((prev) => prev.filter((i) => i.id !== id));
      showToast('Insight Dismissed', { type: 'info', message: 'Finding removed from active view.' });
    } catch (err: any) {
      showToast('Action Failed', { type: 'error', message: err.message });
    }
  };

  const filtered = filter ? insights.filter((i) => i.category === filter) : insights;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="AI Insights" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 w-full">
          {/* Header Banner */}
          <div
            className="rounded-2xl p-5 flex items-center gap-4 border"
            style={{
              background: 'linear-gradient(135deg, var(--rose-subtle), transparent)',
              borderColor: 'var(--rose-subtle-border)',
            }}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>Statistical Diagnostic Engine</h2>
              <p className="text-xs text-muted-foreground">{insights.length} active findings identified across live telemetry</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Sparkles className="w-3 h-3" />
              Engine v2.1 Active
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 items-center flex-wrap">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            {[null, 'Revenue', 'Anomaly', 'Opportunity', 'Trend'].map((cat) => (
              <button
                key={String(cat)}
                onClick={() => setFilter(cat)}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
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

          {/* Insights List */}
          <div className="space-y-3">
            {filtered.map((item) => {
              const isOpen = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl overflow-hidden transition-all border"
                  style={{
                    background: 'var(--card)',
                    borderColor: isOpen ? 'var(--rose-subtle-border)' : 'var(--border)',
                  }}
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
                        <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                      </div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.headline}</p>
                      <p className="text-xs font-semibold mt-1 font-mono-data text-rose-500">{item.metricBadge}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${item.confidence}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono-data font-semibold text-emerald-500">{item.confidence}%</span>
                      </div>
                      <div className="text-muted-foreground">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-xs leading-relaxed text-muted-foreground mb-4">{item.explanation}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => showToast('Action Executed', { type: 'info', message: `Navigating to ${item.actionLabel} context.` })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20"
                        >
                          {item.actionLabel} <ArrowUpRight className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => handleDismiss(item.id, e)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/70"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">
                <BrainCircuit className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-medium">No diagnostic insights under this filter.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
