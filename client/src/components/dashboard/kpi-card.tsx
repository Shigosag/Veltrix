'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  change: number;
  trend: number[];
  color: string;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 80;
    const y = 24 - ((v - min) / (max - min || 1)) * 22;
    return `${x},${y}`;
  });

  const lastPt = pts[pts.length - 1].split(',');

  return (
    <svg
      viewBox="0 0 80 26"
      fill="none"
      className="w-14 sm:w-20 h-5 sm:h-[26px] shrink-0"
      aria-hidden="true"
    >
      <polyline
        points={pts.join(' ')}
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="2.5" fill={color} />
    </svg>
  );
}

export function KpiCard({ label, value, change, trend, color }: KpiCardProps) {
  const isPositive = change >= 0;

  return (
    <div
      className="rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: 'linear-gradient(145deg, var(--card), var(--kpi-gradient-to))',
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <p className="text-[11px] sm:text-xs font-semibold truncate" style={{ color: 'var(--muted-foreground)' }}>
          {label}
        </p>
        <Sparkline data={trend} color={color} />
      </div>

      <div className="mt-2.5 sm:mt-3">
        <div
          className="text-lg sm:text-2xl font-bold leading-none mb-1 font-mono-data"
          style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}
        >
          {value}
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-emerald-500 shrink-0" />
          ) : (
            <TrendingDown className="w-3 h-3 text-rose-500 shrink-0" />
          )}
          <span
            className="text-[11px] sm:text-xs font-semibold font-mono-data"
            style={{ color: isPositive ? '#10b981' : '#ef4444' }}
          >
            {isPositive ? '+' : ''}
            {change}%
          </span>
          <span className="text-[10px] sm:text-xs hidden min-[380px]:inline text-muted-foreground">
            vs last mo
          </span>
        </div>
      </div>
    </div>
  );
}
