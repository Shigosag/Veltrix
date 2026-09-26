'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Modal } from '@/components/ui/modal';
import { MapPin, Calendar, Clock, BarChart3, Edit3 } from 'lucide-react';
import { useToast } from '@/context/toast-context';

export default function ProfilePage() {
  const [collapsed, setCollapsed] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Segun Arulogun Gabriel',
    title: 'Head of Analytics',
    company: 'Acme Corporation',
    location: 'San Francisco, CA',
    bio: 'Data architect specializing in modern high-throughput streaming analytics and predictive modeling.',
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetch('/api/user/profile', { credentials: 'include' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setProfile({
            name: json.data.name || 'Segun Arulogun Gabriel',
            title: json.data.profile?.title || 'Head of Analytics',
            company: json.data.profile?.company || 'Acme Corporation',
            location: json.data.profile?.location || 'San Francisco, CA',
            bio: json.data.profile?.bio || '',
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profile),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('Profile Updated', { type: 'success', message: 'Your user profile details have been saved.' });
      setIsEditModalOpen(false);
    } catch (err: any) {
      showToast('Update Failed', { type: 'error', message: err.message });
    }
  };

  const activities = [
    { action: 'Ran cohort retention analysis', dataset: 'User Events — Production', time: '12 min ago' },
    { action: 'Reviewed AI insight', dataset: 'APAC Segment LTV', time: '2 hr ago' },
    { action: 'Exported revenue report', dataset: 'Revenue Transactions Q4', time: '5 hr ago' },
    { action: 'Created dashboard snapshot', dataset: 'Command Center', time: '1 day ago' },
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="User Profile" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 w-full">
          <div className="rounded-2xl overflow-hidden border border-border" style={{ background: 'var(--card)' }}>
            <div className="h-28 relative bg-gradient-to-r from-rose-950/60 via-purple-950/50 to-slate-900 border-b border-border" />
            <div className="px-5 pb-5">
              <div className="flex items-end justify-between -mt-10 mb-4">
                <div className="flex items-end gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white border-4 border-card bg-gradient-to-br from-rose-500 to-indigo-500 shadow-xl">
                    SA
                  </div>
                  <div className="mb-1">
                    <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>{profile.name}</h2>
                    <p className="text-xs text-muted-foreground">{profile.title} · {profile.company}</p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              </div>

              <div className="flex flex-wrap gap-4 mb-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {profile.location}</div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Joined March 2024</div>
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Last active: just now</div>
              </div>

              {profile.bio && (
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed bg-secondary/50 p-3 rounded-xl border border-border">
                  {profile.bio}
                </p>
              )}

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Datasets accessed', value: '48' },
                  { label: 'Queries run', value: '1,284' },
                  { label: 'Reports shared', value: '32' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 text-center bg-secondary border border-border">
                    <p className="text-xl font-bold font-mono-data text-rose-500">{s.value}</p>
                    <p className="text-[10px] mt-0.5 text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-5 border border-border" style={{ background: 'var(--card)' }}>
            <h3 className="text-sm font-semibold mb-4 text-foreground">Recent Audit Activity</h3>
            <div className="space-y-3">
              {activities.map((act, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-rose-500/10 text-rose-500">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{act.action}</p>
                    <p className="text-[10px] text-muted-foreground">{act.dataset}</p>
                  </div>
                  <span className="text-[10px] font-mono-data text-muted-foreground">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Profile Details">
        <form onSubmit={handleUpdate} className="space-y-3 text-xs">
          <div>
            <label className="block mb-1 font-semibold text-foreground">Full Name</label>
            <input
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl outline-none bg-secondary text-foreground border border-border"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-foreground">Job Title</label>
            <input
              required
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl outline-none bg-secondary text-foreground border border-border"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-foreground">Company</label>
            <input
              required
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              className="w-full px-3 py-2 rounded-xl outline-none bg-secondary text-foreground border border-border"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-foreground">Location</label>
            <input
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              className="w-full px-3 py-2 rounded-xl outline-none bg-secondary text-foreground border border-border"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-foreground">Bio</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-xl outline-none bg-secondary text-foreground border border-border"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl font-semibold text-white bg-rose-500 hover:bg-rose-600">
              Save Profile
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
