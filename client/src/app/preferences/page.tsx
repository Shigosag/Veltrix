'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useTheme } from 'next-themes';
import { Palette, Bell, Shield, Users, Plug, Save } from 'lucide-react';
import { useToast } from '@/context/toast-context';

const tabs = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'integrations', label: 'Integrations', icon: Plug },
];

function SettingToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative inline-flex w-9 h-5 rounded-full transition-all duration-200 shrink-0"
      style={{ background: checked ? '#f43f5e' : 'var(--muted)' }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: checked ? 'translateX(16px)' : 'translateX(0)' }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');
  const { theme, setTheme } = useTheme();
  const { showToast } = useToast();

  const [prefs, setPrefs] = useState({
    compactDensity: false,
    reducedMotion: false,
    monoFont: 'JetBrains Mono',
    emailAlerts: true,
    insightDigest: true,
    weeklyReport: false,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/user/profile', { credentials: 'include' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.preferences) {
          setPrefs((p) => ({ ...p, ...json.data.preferences }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...prefs, theme }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('Settings Saved', { type: 'success', message: 'Preferences synced to your account.' });
    } catch (err: any) {
      showToast('Save Failed', { type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const integrations = [
    { name: 'Slack', description: 'Stream telemetry anomaly triggers into incident channels', connected: true },
    { name: 'PostgreSQL Direct', description: 'Stream external data warehouse connections', connected: true },
    { name: 'dbt Lineage', description: 'Sync transformation dependency models', connected: false },
    { name: 'Jira Software', description: 'Create bug tickets directly from critical anomalies', connected: false },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Settings" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-[900px] mx-auto w-full">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Settings Navigation Tabs */}
            <nav className="w-full md:w-44 shrink-0 flex md:flex-col gap-1 overflow-x-auto">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    background: activeTab === id ? 'var(--rose-subtle)' : 'transparent',
                    color: activeTab === id ? '#f43f5e' : 'var(--muted-foreground)',
                  }}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            {/* Panel Content */}
            <div className="flex-1 rounded-2xl p-5 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              {activeTab === 'appearance' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Appearance & Layout</h3>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Dark Theme</p>
                      <p className="text-[11px] text-muted-foreground">Cyberpunk low-light palette (#09090f)</p>
                    </div>
                    <SettingToggle checked={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Compact Density</p>
                      <p className="text-[11px] text-muted-foreground">Maximize visible metrics on high-res monitors</p>
                    </div>
                    <SettingToggle checked={prefs.compactDensity} onChange={(v) => setPrefs({ ...prefs, compactDensity: v })} />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Numeric Monospace Font</p>
                      <p className="text-[11px] text-muted-foreground">Font family used for metrics & charts</p>
                    </div>
                    <select
                      value={prefs.monoFont}
                      onChange={(e) => setPrefs({ ...prefs, monoFont: e.target.value })}
                      className="text-xs px-2 py-1.5 rounded-lg outline-none bg-secondary text-foreground border border-border"
                    >
                      <option>JetBrains Mono</option>
                      <option>Fira Code</option>
                      <option>Courier New</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Notification Preferences</h3>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Anomaly Alerts</p>
                      <p className="text-[11px] text-muted-foreground">Alert immediately when Z-Score variance &gt; 2.0</p>
                    </div>
                    <SettingToggle checked={prefs.emailAlerts} onChange={(v) => setPrefs({ ...prefs, emailAlerts: v })} />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Daily Insight Digest</p>
                      <p className="text-[11px] text-muted-foreground">Morning summary of statistical opportunity findings</p>
                    </div>
                    <SettingToggle checked={prefs.insightDigest} onChange={(v) => setPrefs({ ...prefs, insightDigest: v })} />
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Security & Authorization</h3>
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Session Integrity</p>
                      <p className="text-[11px] text-muted-foreground">HS256 Cryptographic cookie verification</p>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <div>
                      <p className="text-xs font-semibold text-foreground">API Keys</p>
                      <p className="text-[11px] text-muted-foreground">Bearer token used for programmatic telemetry ingest</p>
                    </div>
                    <button
                      onClick={() => showToast('API Key Generated', { type: 'success', message: 'vel_live_9a87bf9102c776de' })}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Data Integrations</h3>
                  {integrations.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">{item.description}</p>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${item.connected ? 'text-emerald-500 bg-emerald-500/10' : 'text-muted-foreground bg-muted'}`}>
                        {item.connected ? 'Connected' : 'Offline'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'team' && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Workspace Members</h3>
                  <div className="p-3 rounded-xl bg-secondary border border-border flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground">Segun Arulogun Gabriel</p>
                      <p className="text-[11px] text-muted-foreground">demo@veltrix.ai · Workspace Administrator</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">
                      Owner
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-5 border-t border-border mt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
