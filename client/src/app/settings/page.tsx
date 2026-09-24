'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { useTheme } from 'next-themes';
import { Palette, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, setTheme } = useTheme();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Settings" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-[900px] mx-auto w-full">
          <div className="rounded-2xl p-5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <h3 className="text-sm font-semibold mb-4">Appearance</h3>
            <div className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Toggle application theme</p>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20"
              >
                Switch to {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>

            <div className="flex justify-end mt-5">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600"
              >
                <Save className="w-3.5 h-3.5" />
                {saved ? 'Saved!' : 'Save changes'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
