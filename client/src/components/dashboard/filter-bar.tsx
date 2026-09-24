'use client';

import React from 'react';
import { Calendar, Filter, Download } from 'lucide-react';

interface FilterBarProps {
  selectedRange: string;
  onRangeChange: (r: string) => void;
  onExport?: () => void;
}

const ranges = ['7D', '30D', '90D', '6M', '1Y', 'Custom'];

export function FilterBar({ selectedRange, onRangeChange, onExport }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => onRangeChange(r)}
            className="px-3 py-1.5 text-xs font-medium transition-all"
            style={{
              background: selectedRange === r ? '#f43f5e' : 'var(--card)',
              color: selectedRange === r ? '#fff' : 'var(--muted-foreground)',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
      >
        <Calendar className="w-3.5 h-3.5" />
        Nov 1 – Nov 30, 2025
      </button>

      <button
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
        style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
      >
        <Filter className="w-3.5 h-3.5" />
        Filters
      </button>

      <div className="flex-1" />

      {onExport && (
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      )}
    </div>
  );
}
