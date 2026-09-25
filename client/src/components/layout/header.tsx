'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Sun,
  Moon,
  Bell,
  RefreshCw,
  Zap,
  Search,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  TrendingUp,
  Database,
  BrainCircuit,
  Settings,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Drawer } from '@/components/ui/drawer';

interface HeaderProps {
  title?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}

const workspaceItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/analytics', icon: TrendingUp, label: 'Analytics' },
  { href: '/datasets', icon: Database, label: 'Datasets' },
  { href: '/insights', icon: BrainCircuit, label: 'AI Insights' },
];

const accountItems = [
  { href: '/preferences', icon: Settings, label: 'Settings' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function Header({ title = 'Command Center', onRefresh, refreshing }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [secondsAgo, setSecondsAgo] = useState(0);

  useEffect(() => {
    setMounted(true);
    fetch('/api/notifications', { credentials: 'include' })
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setNotifs(j.data);
      })
      .catch(() => {});

    const interval = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshClick = () => {
    setSecondsAgo(0);
    if (onRefresh) onRefresh();
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE', credentials: 'include' });
    router.push('/login');
    router.refresh();
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  return (
    <header
      className="sticky top-0 z-20 h-14 flex items-center px-4 gap-3"
      style={{
        background: 'var(--header-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Mobile Menu Hamburger Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden p-1.5 -ml-1 rounded-lg text-muted-foreground hover:text-foreground"
        aria-label="Open mobile navigation menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Logo */}
      <div
        className="md:hidden flex items-center gap-2 cursor-pointer"
        onClick={() => setMobileMenuOpen(true)}
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)' }}
        >
          <Zap className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
          Veltrix
        </span>
      </div>

      <h1 className="hidden md:block text-base font-semibold" style={{ color: 'var(--foreground)' }}>
        {title}
      </h1>

      <div className="flex-1" />

      {/* Interactive Search Bar */}
      <div className="relative hidden sm:block">
        {searchOpen ? (
          <input
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onBlur={() => !searchQuery && setSearchOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery) {
                router.push(`/datasets?search=${encodeURIComponent(searchQuery)}`);
              }
            }}
            placeholder="Search datasets, insights..."
            className="w-56 px-3 py-1.5 text-xs rounded-lg outline-none transition-all"
            style={{
              background: 'var(--secondary)',
              color: 'var(--foreground)',
              border: '1.5px solid #f43f5e',
              boxShadow: '0 0 0 3px rgba(244,63,94,0.12)',
            }}
          />
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all hover:opacity-80"
            style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden md:inline text-[10px] px-1 py-0.5 rounded bg-muted">⌘K</kbd>
          </button>
        )}
      </div>

      {/* Live Refresh Counter */}
      {onRefresh && (
        <button
          onClick={handleRefreshClick}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs hover:opacity-80"
          style={{ background: 'var(--secondary)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin text-rose-500' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : `${secondsAgo}s ago`}</span>
        </button>
      )}

      {/* Notifications Drawer Toggle */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="relative p-1.5 rounded-lg hover:opacity-70 text-muted-foreground"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white bg-rose-500 animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Theme Toggle */}
      {mounted && (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-1.5 rounded-lg text-muted-foreground hover:opacity-70"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      )}

      {/* User Avatar & Profile Navigation */}
      <Link
        href="/profile"
        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 bg-gradient-to-br from-rose-500 to-indigo-500"
        title="View Profile"
      >
        SA
      </Link>

      <button
        onClick={handleLogout}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500"
        title="Sign Out"
        aria-label="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </button>

      {/* Notifications Slide-out Drawer */}
      <Drawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} title="Notification Feed">
        <div className="space-y-3">
          {notifs.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-xl border text-xs"
              style={{
                background: n.read ? 'var(--card)' : 'var(--rose-subtle)',
                borderColor: n.read ? 'var(--border)' : 'var(--rose-subtle-border)',
              }}
            >
              <p className="font-semibold text-foreground mb-1">{n.title}</p>
              <p className="text-muted-foreground leading-snug">{n.body}</p>
            </div>
          ))}
          <Link
            href="/notifications"
            onClick={() => setDrawerOpen(false)}
            className="block w-full py-2 text-center text-xs font-semibold rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          >
            Open All Notifications
          </Link>
        </div>
      </Drawer>

      {/* Mobile Navigation Drawer Portal */}
      {mounted &&
        mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[110] md:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div
              className="fixed top-0 left-0 bottom-0 w-64 p-5 flex flex-col shadow-2xl z-10"
              style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
            >
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)' }}
                  >
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-base font-bold" style={{ color: 'var(--foreground)' }}>
                    Veltrix
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                <p className="text-xs font-semibold tracking-widest uppercase px-3 mb-2 text-muted-foreground">
                  Workspace
                </p>
                {workspaceItems.map(({ href, icon: Icon, label }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: active ? 'var(--rose-subtle)' : 'transparent',
                        color: active ? '#f43f5e' : 'var(--muted-foreground)',
                      }}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  );
                })}

                <p className="text-xs font-semibold tracking-widest uppercase px-3 mt-5 mb-2 text-muted-foreground">
                  Account
                </p>
                {accountItems.map(({ href, icon: Icon, label }) => {
                  const active = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: active ? 'var(--rose-subtle)' : 'transparent',
                        color: active ? '#f43f5e' : 'var(--muted-foreground)',
                      }}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t" style={{ borderColor: 'var(--sidebar-border)' }}>
                <div className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'var(--secondary)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 bg-gradient-to-br from-rose-500 to-indigo-500">
                    SA
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                      Segun Arulogun Gabriel
                    </p>
                    <p className="text-[10px] truncate" style={{ color: 'var(--muted-foreground)' }}>
                      demo@veltrix.ai
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
