'use client';

import React from 'react';
import type { AnomalyRecord } from '@/types/dashboard';

export function DataTable({ anomalies }: { anomalies: AnomalyRecord[] }) {
  const severityColors: Record<string, string> = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#f59e0b',
    low: '#10b981',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
        <thead>
          <tr>
            {['Time', 'Metric', 'Value', 'Expected', 'Severity', 'Status'].map((h) => (
              <th key={h} className="text-left px-3 py-1.5 font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {anomalies.map((row) => (
            <tr key={row.id} className="transition-all hover:opacity-80">
              <td className="px-3 py-2.5 font-mono-data rounded-l-lg" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                {row.time}
              </td>
              <td className="px-3 py-2.5 font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
                {row.metric}
              </td>
              <td className="px-3 py-2.5 font-mono-data font-semibold" style={{ background: 'var(--muted)', color: severityColors[row.severity] }}>
                {row.value}
              </td>
              <td className="px-3 py-2.5 font-mono-data" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                {row.expected}
              </td>
              <td className="px-3 py-2.5" style={{ background: 'var(--muted)' }}>
                <span
                  className="px-2 py-0.5 rounded-md font-semibold capitalize"
                  style={{
                    background: `${severityColors[row.severity]}20`,
                    color: severityColors[row.severity],
                  }}
                >
                  {row.severity}
                </span>
              </td>
              <td className="px-3 py-2.5 rounded-r-lg" style={{ background: 'var(--muted)' }}>
                <span
                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize"
                  style={{
                    background: row.status === 'active' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                    color: row.status === 'active' ? '#ef4444' : '#10b981',
                  }}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
