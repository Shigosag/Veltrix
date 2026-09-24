'use client';

import React from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md p-6 flex flex-col shadow-2xl"
          style={{ background: 'var(--card)', borderLeft: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>{title}</h2>
            <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:opacity-70">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pt-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
