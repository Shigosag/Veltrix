'use client';

import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import type { InsightItem } from '@/types/insights';
import Link from 'next/link';

export function InsightsPanel({ insights }: { insights: InsightItem[] }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col justify-between"
      style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
    >
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--rose-subtle)' }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#f43f5e' }} />
          </div>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>AI Insights</h2>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{insights.length} active findings</p>
          </div>
        </div>

        <div className="space-y-3">
          {insights.slice(0, 2).map((ins) => (
            <div
              key={ins.id}
              className="p-3 rounded-xl transition-all hover:scale-[1.01]"
              style={{
                background: 'var(--rose-subtle)',
                border: '1px solid var(--rose-subtle-border)',
              }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                  style={{ background: 'var(--rose-subtle-border)', color: '#f43f5e' }}
                >
                  {ins.category}
                </span>
                <span className="text-[10px] font-mono-data" style={{ color: 'var(--muted-foreground)' }}>
                  {ins.confidence}% conf
                </span>
              </div>
              <p className="text-xs font-semibold leading-snug mb-1" style={{ color: 'var(--foreground)' }}>
                {ins.headline}
              </p>
              <p className="text-xs font-semibold font-mono-data" style={{ color: '#f43f5e' }}>
                {ins.metricBadge}
              </p>
            </div>
          ))}
        </div>
      </div>

      <Link
        href="/insights"
        className="mt-4 w-full py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all hover:opacity-80"
        style={{
          background: 'var(--rose-subtle)',
          color: '#f43f5e',
          border: '1px solid var(--rose-subtle-border)',
        }}
      >
        View all insights <ArrowUpRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
