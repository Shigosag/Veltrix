'use client';

import React, { useState } from 'react';
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useToast } from '@/context/toast-context';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@veltrix.ai');
  const [password, setPassword] = useState('veltrix2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      showToast('Welcome back to Veltrix', { type: 'success', message: 'Signed in successfully. Launching Command Center...' });

      // Navigate to root command center
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } catch (err: any) {
      showToast('Sign in Failed', { type: 'error', message: err.message });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Visual branding left column */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 w-[52%] relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #12021a 0%, #0d0415 40%, #09090f 100%)',
        }}
      >
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #f43f5e 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-16 left-8 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }}
        />

        <div className="flex items-center gap-3 relative z-10">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)' }}
          >
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white font-sans">Veltrix</span>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-rose-500">AI-Powered Analytics</p>
            <h1 className="text-5xl font-bold leading-[1.1] mb-4 text-white" style={{ letterSpacing: '-0.03em' }}>
              See the signal.<br />
              <span className="text-rose-500">Understand</span><br />
              the story.
            </h1>
            <p className="text-base text-gray-400 max-w-sm leading-relaxed">
              Explore datasets, monitor KPIs, detect anomalies, and surface AI-generated insights — all in one command center.
            </p>
          </div>

          <div className="flex gap-8 pt-2">
            {[
              { value: '128M+', label: 'Events processed' },
              { value: '99.9%', label: 'Uptime SLA' },
              { value: '< 80ms', label: 'Query latency' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold font-mono-data text-white">{s.value}</div>
                <div className="text-xs mt-0.5 text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="relative z-10 rounded-2xl p-5 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
        >
          <p className="text-sm leading-relaxed mb-3 text-gray-200">
            &ldquo;Veltrix surfaced an anomaly that would have cost us $200K in lost revenue — before our team even noticed the alert.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-rose-500 to-indigo-500">
              SA
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Segun Arulogun Gabriel</div>
              <div className="text-xs text-gray-400">Head of Data, Meridian Labs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)' }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>Veltrix</span>
          </div>

          <h2 className="text-3xl font-bold mb-1" style={{ color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
            Welcome back
          </h2>
          <p className="text-sm text-muted-foreground mb-8">Sign in to your analytics command center</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl outline-none transition-all"
                style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--foreground)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl outline-none transition-all"
                  style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)', color: 'var(--foreground)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/25"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign in <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs text-muted-foreground">Demo Access</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          <button
            type="button"
            onClick={() => {
              setEmail('demo@veltrix.ai');
              setPassword('veltrix2026');
            }}
            className="w-full py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 border border-border hover:bg-muted/50 transition-all text-muted-foreground"
          >
            Autofill Default Credentials
          </button>
        </div>
      </div>
    </div>
  );
}
