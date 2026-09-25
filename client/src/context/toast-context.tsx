'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (title: string, options?: { type?: ToastType; message?: string }) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, options?: { type?: ToastType; message?: string }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastItem = {
      id,
      title,
      type: options?.type || 'info',
      message: options?.message,
    };

    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  }, [dismissToast]);

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-[9999] space-y-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all animate-slide-in-right"
            style={{
              background: 'var(--card)',
              borderColor: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#f43f5e' : 'var(--border)',
            }}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-indigo-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">{toast.title}</p>
              {toast.message && <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{toast.message}</p>}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
