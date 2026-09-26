'use client';

import React, { useState } from 'react';
import type { AnomalyRecord } from '@/types/dashboard';
import { Modal } from '@/components/ui/modal';
import { useToast } from '@/context/toast-context';

export function DataTable({
  anomalies,
  onStatusChange,
}: {
  anomalies: AnomalyRecord[];
  onStatusChange?: (id: string, nextStatus: 'active' | 'investigating' | 'resolved') => void;
}) {
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(null);
  const { showToast } = useToast();

  const severityColors: Record<string, string> = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#f59e0b',
    low: '#10b981',
  };

  const handleUpdateStatus = async (status: 'active' | 'investigating' | 'resolved') => {
    if (!selectedAnomaly) return;
    try {
      const res = await fetch(`/api/dashboard/anomalies/${selectedAnomaly.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      if (onStatusChange) onStatusChange(selectedAnomaly.id, status);
      showToast('Anomaly Status Updated', {
        type: 'success',
        message: `${selectedAnomaly.metric} set to ${status}.`,
      });
      setSelectedAnomaly(null);
    } catch (err: any) {
      showToast('Update Failed', { type: 'error', message: err.message });
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-xs" style={{ borderCollapse: 'separate', borderSpacing: '0 4px' }}>
          <thead>
            <tr>
              {['Time', 'Metric', 'Value', 'Expected', 'Severity', 'Status'].map((h) => (
                <th key={h} className="text-left px-3 py-1.5 font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {anomalies.map((row) => (
              <tr
                key={row.id}
                onClick={() => setSelectedAnomaly(row)}
                className="transition-all hover:opacity-80 cursor-pointer"
                title="Click to triage anomaly"
              >
                <td className="px-3 py-2.5 font-mono-data rounded-l-lg" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                  {row.time}
                </td>
                <td className="px-3 py-2.5 font-semibold" style={{ background: 'var(--muted)', color: 'var(--foreground)' }}>
                  {row.metric}
                </td>
                <td className="px-3 py-2.5 font-mono-data font-semibold" style={{ background: 'var(--muted)', color: severityColors[row.severity] || '#ef4444' }}>
                  {row.value}
                </td>
                <td className="px-3 py-2.5 font-mono-data" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                  {row.expected}
                </td>
                <td className="px-3 py-2.5" style={{ background: 'var(--muted)' }}>
                  <span
                    className="px-2 py-0.5 rounded-md font-semibold capitalize"
                    style={{
                      background: `${severityColors[row.severity] || '#ef4444'}20`,
                      color: severityColors[row.severity] || '#ef4444',
                    }}
                  >
                    {row.severity}
                  </span>
                </td>
                <td className="px-3 py-2.5 rounded-r-lg" style={{ background: 'var(--muted)' }}>
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize"
                    style={{
                      background:
                        row.status === 'active'
                          ? 'rgba(239,68,68,0.1)'
                          : row.status === 'investigating'
                          ? 'rgba(245,158,11,0.1)'
                          : 'rgba(16,185,129,0.1)',
                      color:
                        row.status === 'active'
                          ? '#ef4444'
                          : row.status === 'investigating'
                          ? '#f59e0b'
                          : '#10b981',
                    }}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Anomaly Triage Modal */}
      <Modal
        isOpen={!!selectedAnomaly}
        onClose={() => setSelectedAnomaly(null)}
        title={selectedAnomaly ? `Triage Anomaly: ${selectedAnomaly.metric}` : 'Anomaly Details'}
      >
        {selectedAnomaly && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-secondary">
              <div>
                <p className="text-muted-foreground">Observed Value</p>
                <p className="text-base font-bold font-mono-data text-rose-500">{selectedAnomaly.value}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expected Baseline</p>
                <p className="text-base font-bold font-mono-data text-foreground">{selectedAnomaly.expected}</p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Statistical variance exceeded $|Z| \ge 2.0$. Modify the triage lifecycle to coordinate with engineering or dismiss resolved incidents.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => handleUpdateStatus('investigating')}
                className="px-3 py-1.5 rounded-xl font-semibold bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
              >
                Mark Investigating
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('resolved')}
                className="px-3 py-1.5 rounded-xl font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
              >
                Mark Resolved
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('active')}
                className="px-3 py-1.5 rounded-xl font-semibold bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
              >
                Keep Active
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
