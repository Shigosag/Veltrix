'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Zap,
  LayoutDashboard,
  TrendingUp,
  Database,
  BrainCircuit,
  Bell,
  Settings,
  ChevronLeft,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  notifCount?: number;
}

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/analytics', icon: TrendingUp, label: 'Analytics' },
  { href: '/datasets', icon: Database, label: 'Datasets' },
  { href: '/insights', icon: BrainCircuit, label: 'AI Insights' },
];

const bottomItems = [
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ collapsed, setCollapsed, notifCount = 3 }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col h-screen sticky top-0 transition-all duration-300 shrink-0 z-30"
      style={{
        width: collapsed ? 64 : 240,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
      }}
    >
      <div className="flex items-center gap-3 px-4 h-14 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)' }}
        >
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-base font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Veltrix
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {!collapsed && (
          <p className="text-xs font-semibold tracking-widest uppercase px-3 mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Workspace
          </p>
        )}
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative"
              style={{
                background: active ? 'var(--rose-subtle)' : 'transparent',
                color: active ? '#f43f5e' : 'var(--muted-foreground)',
              }}
            >
              {active && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: '#f43f5e' }}
                />
              )}
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}

        {!collapsed && (
          <p className="text-xs font-semibold tracking-widest uppercase px-3 mt-5 mb-2" style={{ color: 'var(--muted-foreground)' }}>
            Account
          </p>
        )}
        {bottomItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative"
              style={{
                background: active ? 'var(--rose-subtle)' : 'transparent',
                color: active ? '#f43f5e' : 'var(--muted-foreground)',
              }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg transition-all hover:opacity-70"
          style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className="w-4 h-4 transition-transform"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }}
          />
        </button>
      </div>
    </aside>
  );
}
