'use client';

import React, { useState } from 'react';
import { Zap, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@veltrix.ai');
  const [password, setPassword] = useState('veltrix2026');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Authentication failed');

      // Full window navigation forces cookie refresh in middleware
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
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
        <div className="flex items-center gap-3 relative z-10">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #fb7185)' }}
          >
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Veltrix</span>
        </div>

        <div className="relative z-10 space-y-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-rose-500">AI-Powered Analytics</p>
          <h1 className="text-5xl font-bold leading-[1.1] text-white" style={{ letterSpacing: '-0.03em' }}>
            See the signal.<br />
            <span className="text-rose-500">Understand</span><br />
            the story.
          </h1>
          <p className="text-base text-gray-400 max-w-sm">
            Explore datasets, monitor KPIs, detect anomalies, and surface AI-generated insights — all in one command center.
          </p>
        </div>

        <div
          className="relative z-10 rounded-2xl p-5 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
        >
          <p className="text-sm leading-relaxed mb-3 text-gray-200">
            &ldquo;Veltrix surfaced an anomaly that would have cost us $200K in lost revenue — before our team even noticed the alert.&rdquo;
          </p>
          <div className="text-xs font-semibold text-white">Segun Arulogun Gabriel · Head of Data</div>
        </div>
      </div>

      {/* Right Column Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-1" style={{ letterSpacing: '-0.02em' }}>Welcome back</h2>
          <p className="text-sm text-muted-foreground mb-8">Sign in to your analytics command center</p>

          {error && (
            <div className="p-3 mb-4 rounded-xl text-xs bg-rose-500/10 border border-rose-500/20 text-rose-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl outline-none"
                style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)' }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 text-sm rounded-xl outline-none"
                  style={{ background: 'var(--secondary)', border: '1.5px solid var(--border)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/30"
            >
              {loading ? 'Authenticating...' : <>Sign in <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
