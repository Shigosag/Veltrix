'use client';

import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--background)' }}>
      <div className="max-w-md w-full rounded-2xl p-6 text-center" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-rose-500/10 text-rose-500">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold mb-1">Telemetry Interrupted</h2>
        <p className="text-xs text-muted-foreground mb-6">{error.message || 'An unexpected runtime error occurred.'}</p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600"
        >
          <RefreshCcw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      </div>
    </div>
  );
}
