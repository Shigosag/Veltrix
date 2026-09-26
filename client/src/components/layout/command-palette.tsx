'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, LayoutDashboard, TrendingUp, Database, BrainCircuit, Bell, Settings, User, X, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'Command Center', icon: LayoutDashboard, href: '/', category: 'Navigation' },
    { label: 'Analytics Explorer', icon: TrendingUp, href: '/analytics', category: 'Navigation' },
    { label: 'Dataset Manager', icon: Database, href: '/datasets', category: 'Navigation' },
    { label: 'Statistical AI Insights', icon: BrainCircuit, href: '/insights', category: 'Navigation' },
    { label: 'System Notifications', icon: Bell, href: '/notifications', category: 'Navigation' },
    { label: 'Workspace Settings', icon: Settings, href: '/preferences', category: 'Navigation' },
    { label: 'User Profile', icon: User, href: '/profile', category: 'Navigation' },
  ];

  const filtered = query.trim()
    ? quickActions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()))
    : quickActions;

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center pt-24 p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border animate-fade-in-up"
        style={{ background: 'var(--card)', borderColor: 'var(--rose-subtle-border)' }}
      >
        <div className="flex items-center px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <Search className="w-4 h-4 text-rose-500 mr-2 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to page..."
            className="w-full bg-transparent text-xs outline-none text-foreground placeholder:text-muted-foreground"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {filtered.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.href}
                onClick={() => handleSelect(action.href)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors hover:bg-rose-500/10 text-foreground group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-secondary text-muted-foreground group-hover:text-rose-500 group-hover:bg-rose-500/20">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">{action.label}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground group-hover:text-rose-500">
                  <span className="text-[10px] uppercase font-semibold">{action.category}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
