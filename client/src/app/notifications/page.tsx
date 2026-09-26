'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Bell, AlertTriangle, BrainCircuit, Database, Check, Trash2, Filter } from 'lucide-react';
import { useToast } from '@/context/toast-context';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'anomaly'>('all');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/notifications', { credentials: 'include' });
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch (e: any) {
      showToast('Notification sync failed', { type: 'error', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH', credentials: 'include' });
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      showToast('Notifications Updated', { type: 'success', message: 'All notifications marked as read.' });
    } catch (e: any) {
      showToast('Action Failed', { type: 'error', message: e.message });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: 'DELETE', credentials: 'include' });
      setItems((prev) => prev.filter((n) => n.id !== id));
      showToast('Notification Dismissed', { type: 'info' });
    } catch (e: any) {
      showToast('Delete Failed', { type: 'error', message: e.message });
    }
  };

  const filtered = items.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'anomaly') return n.type === 'anomaly';
    return true;
  });

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} notifCount={unreadCount} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Notifications" onRefresh={loadNotifications} refreshing={loading} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-[750px] mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
                Alerts & Activity
              </h2>
              <p className="text-xs text-muted-foreground">{unreadCount} unread · {items.length} total events</p>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-1.5">
            {(['all', 'unread', 'anomaly'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filter === f ? 'bg-rose-500 text-white' : 'bg-card text-muted-foreground border border-border'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            {filtered.map((notif) => (
              <div
                key={notif.id}
                className="flex items-start gap-3 p-4 rounded-2xl transition-all border group"
                style={{
                  background: notif.read ? 'var(--card)' : 'var(--rose-subtle)',
                  borderColor: notif.read ? 'var(--border)' : 'var(--rose-subtle-border)',
                }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-rose-500/10 text-rose-500">
                  {notif.type === 'anomaly' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  ) : notif.type === 'insight' ? (
                    <BrainCircuit className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Database className="w-4 h-4 text-emerald-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {notif.title}
                    </p>
                    <div className="flex items-center gap-2">
                      {!notif.read && <div className="w-2 h-2 rounded-full bg-rose-500" />}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-500 transition-all p-1"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs mt-0.5 leading-relaxed text-muted-foreground">{notif.body}</p>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">
                <Bell className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs opacity-60">No pending notifications</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
