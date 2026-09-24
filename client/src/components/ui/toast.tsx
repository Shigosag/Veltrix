'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error';
  message: string;
}

export function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all"
          style={{
            background: 'var(--card)',
            borderColor: t.type === 'success' ? '#10b981' : '#f43f5e',
          }}
        >
          {t.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          )}
          <p className="text-xs font-medium flex-1 text-foreground">{t.message}</p>
          <button onClick={() => onDismiss(t.id)} className="p-1 rounded text-muted-foreground hover:opacity-70">
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
