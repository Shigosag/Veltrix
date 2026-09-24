'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Modal } from '@/components/ui/modal';
import { Search, Plus, Database } from 'lucide-react';
import type { DatasetItem } from '@/types/dataset';

export default function DatasetsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDatasetName, setNewDatasetName] = useState('');
  const [newDatasetJson, setNewDatasetJson] = useState('[{"metric": "latency", "val": 42}]');

  const loadDatasets = () => {
    fetch(`/api/datasets?search=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setDatasets(json.data);
      });
  };

  useEffect(() => {
    loadDatasets();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(newDatasetJson);
      await fetch('/api/datasets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDatasetName, jsonData: parsed }),
      });
      setIsModalOpen(false);
      loadDatasets();
    } catch {
      alert('Invalid JSON provided.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Dataset Manager" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 max-w-[1400px] mx-auto w-full">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search datasets or tags..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl outline-none"
                style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
              />
            </div>
            <div className="flex-1" />
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Dataset
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs font-semibold text-muted-foreground" style={{ borderColor: 'var(--border)' }}>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Tags</th>
                  <th className="text-left px-4 py-3">Rows</th>
                  <th className="text-left px-4 py-3">Size</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map((ds) => (
                  <tr key={ds.id} className="border-b text-xs hover:bg-rose-500/5" style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3.5 font-semibold flex items-center gap-2">
                      <Database className="w-3.5 h-3.5 text-rose-500" />
                      {ds.name}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex gap-1">
                        {ds.tags.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-muted">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono-data">{ds.rows}</td>
                    <td className="px-4 py-3.5 font-mono-data text-muted-foreground">{ds.size}</td>
                    <td className="px-4 py-3.5 capitalize">{ds.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Import Dataset">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block mb-1 font-semibold">Dataset Name</label>
            <input
              required
              value={newDatasetName}
              onChange={(e) => setNewDatasetName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl outline-none"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">JSON Records Payload</label>
            <textarea
              rows={5}
              value={newDatasetJson}
              onChange={(e) => setNewDatasetJson(e.target.value)}
              className="w-full px-3 py-2 rounded-xl font-mono-data outline-none"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)' }}
            />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-xl font-semibold text-white bg-rose-500 hover:bg-rose-600">
            Create Dataset
          </button>
        </form>
      </Modal>
    </div>
  );
}
