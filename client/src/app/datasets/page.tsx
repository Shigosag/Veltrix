'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Modal } from '@/components/ui/modal';
import { Search, Plus, Database, Archive, Trash2, Download, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/context/toast-context';
import { exportToCsv } from '@/lib/csv';
import type { DatasetItem, DatasetStats } from '@/types/dataset';

type SortKey = 'name' | 'rows' | 'size' | 'updated';

export default function DatasetsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [stats, setStats] = useState<DatasetStats>({
    totalDatasets: 6,
    totalRows: '1.09B',
    storageUsed: '172 GB',
    liveConnections: 1,
  });

  const [sortKey, setSortKey] = useState<SortKey>('updated');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedDataset, setSelectedDataset] = useState<DatasetItem | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDatasetName, setNewDatasetName] = useState('');
  const [newDatasetTags, setNewDatasetTags] = useState('events, telemetry');
  const [newDatasetJson, setNewDatasetJson] = useState('[\n  {"metric": "api_latency", "value_ms": 42, "user_id": "usr_991"},\n  {"metric": "api_latency", "value_ms": 78, "user_id": "usr_992"}\n]');
  const { showToast } = useToast();

  const loadDatasets = () => {
    let url = `/api/datasets?search=${encodeURIComponent(search)}`;
    if (statusFilter) url += `&status=${encodeURIComponent(statusFilter)}`;

    fetch(url, { credentials: 'include' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setDatasets(json.data);
          if (json.stats) setStats(json.stats);
        }
      })
      .catch((e) => showToast('Failed to load datasets', { type: 'error', message: e.message }));
  };

  useEffect(() => {
    loadDatasets();
  }, [search, statusFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedDatasets = [...datasets].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortKey === 'rows') cmp = a.rawRows - b.rawRows;
    else if (sortKey === 'size') cmp = a.size.localeCompare(b.size);
    else cmp = a.updated.localeCompare(b.updated);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = JSON.parse(newDatasetJson);
      if (!Array.isArray(parsed) || !parsed.length) {
        throw new Error('Payload must be a non-empty array of JSON records');
      }

      const tags = newDatasetTags.split(',').map((t) => t.trim()).filter(Boolean);

      const res = await fetch('/api/datasets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: newDatasetName, jsonData: parsed, tags }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Failed to ingest dataset');

      showToast('Dataset Created', { type: 'success', message: `${newDatasetName} ingested with ${parsed.length} rows.` });
      setIsModalOpen(false);
      setNewDatasetName('');
      loadDatasets();
    } catch (err: any) {
      showToast('Invalid Payload', { type: 'error', message: err.message });
    }
  };

  const handleToggleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/datasets/${id}/archive`, {
        method: 'PATCH',
        credentials: 'include',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('Dataset Status Updated', { type: 'info', message: 'Status toggled successfully.' });
      loadDatasets();
    } catch (err: any) {
      showToast('Archive Failed', { type: 'error', message: err.message });
    }
  };

  const handleDelete = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/datasets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      showToast('Dataset Deleted', { type: 'success', message: `${name} has been removed permanently.` });
      if (selectedDataset?.id === id) setSelectedDataset(null);
      loadDatasets();
    } catch (err: any) {
      showToast('Delete Failed', { type: 'error', message: err.message });
    }
  };

  const handleExport = (ds: DatasetItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (ds.dataPreview && ds.dataPreview.length) {
      exportToCsv(`${ds.name.toLowerCase().replace(/\s+/g, '_')}_export.csv`, ds.dataPreview);
      showToast('Export Started', { type: 'success', message: `Downloaded CSV for ${ds.name}` });
    } else {
      showToast('No Exportable Preview', { type: 'info', message: 'Dataset preview rows not stored locally.' });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Dataset Manager" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 w-full">
          {/* Top 4 Stat Summary Cards matching Figma */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Datasets', value: stats.totalDatasets, color: '#f43f5e' },
              { label: 'Total Rows', value: stats.totalRows, color: '#818cf8' },
              { label: 'Storage Used', value: stats.storageUsed, color: '#34d399' },
              { label: 'Live Connections', value: stats.liveConnections, color: '#fbbf24' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>{s.label}</p>
                <p className="text-xl font-bold font-mono-data" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Top toolbar */}
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

            <div className="flex items-center gap-1.5">
              {[null, 'live', 'ready', 'processing', 'archived'].map((status) => (
                <button
                  key={String(status)}
                  onClick={() => setStatusFilter(status)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={{
                    background: statusFilter === status ? '#f43f5e' : 'var(--card)',
                    color: statusFilter === status ? '#fff' : 'var(--muted-foreground)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {status || 'All'}
                </button>
              ))}
            </div>

            <div className="flex-1" />

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-all shadow-md shadow-rose-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Dataset
            </button>
          </div>

          {/* Dataset Table with Column Sorting */}
          <div className="rounded-2xl overflow-hidden border border-border" style={{ background: 'var(--card)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-xs font-semibold text-muted-foreground" style={{ borderColor: 'var(--border)' }}>
                    <th className="px-4 py-3 cursor-pointer hover:text-foreground" onClick={() => toggleSort('name')}>
                      <div className="flex items-center gap-1">
                        <span>Name</span>
                        {sortKey === 'name' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-rose-500" /> : <ChevronDown className="w-3 h-3 text-rose-500" />)}
                      </div>
                    </th>
                    <th className="px-4 py-3">Tags</th>
                    <th className="px-4 py-3 cursor-pointer hover:text-foreground" onClick={() => toggleSort('rows')}>
                      <div className="flex items-center gap-1">
                        <span>Rows</span>
                        {sortKey === 'rows' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-rose-500" /> : <ChevronDown className="w-3 h-3 text-rose-500" />)}
                      </div>
                    </th>
                    <th className="px-4 py-3 cursor-pointer hover:text-foreground" onClick={() => toggleSort('size')}>
                      <div className="flex items-center gap-1">
                        <span>Size</span>
                        {sortKey === 'size' && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3 text-rose-500" /> : <ChevronDown className="w-3 h-3 text-rose-500" />)}
                      </div>
                    </th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDatasets.map((ds) => (
                    <tr
                      key={ds.id}
                      onClick={() => setSelectedDataset(selectedDataset?.id === ds.id ? null : ds)}
                      className="border-b text-xs cursor-pointer hover:bg-rose-500/5 transition-all"
                      style={{
                        borderColor: 'var(--border)',
                        background: selectedDataset?.id === ds.id ? 'var(--rose-subtle)' : 'transparent',
                      }}
                    >
                      <td className="px-4 py-3.5 font-semibold flex items-center gap-2">
                        <Database className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate max-w-[200px]">{ds.name}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {ds.tags.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded text-[10px] bg-muted font-medium text-muted-foreground">
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-mono-data">{ds.rows}</td>
                      <td className="px-4 py-3.5 font-mono-data text-muted-foreground">{ds.size}</td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize ${
                            ds.status === 'live'
                              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                              : ds.status === 'ready'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : ds.status === 'archived'
                              ? 'bg-gray-500/10 text-gray-400'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}
                        >
                          {ds.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleExport(ds, e)}
                          title="Export CSV"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleToggleArchive(ds.id, e)}
                          title="Archive / Unarchive"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(ds.id, ds.name, e)}
                          title="Delete Dataset"
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {sortedDatasets.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        <Database className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-xs font-medium">No datasets found matching your criteria.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dataset Detail Inspector matching Figma */}
          {selectedDataset && (
            <div className="rounded-2xl p-5 border border-rose-500/30 animate-fade-in-up" style={{ background: 'var(--card)' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">{selectedDataset.name} — Profile</h3>
                <span className="text-xs px-2 py-0.5 rounded-md font-semibold capitalize bg-rose-500/10 text-rose-500">
                  {selectedDataset.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Rows', value: selectedDataset.rows },
                  { label: 'Storage Size', value: selectedDataset.size },
                  { label: 'Last Sync', value: selectedDataset.updated },
                  { label: 'Schema Fields', value: `${selectedDataset.columns?.length || 4} Columns` },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="text-sm font-bold font-mono-data text-foreground mt-0.5">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Dataset Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Import New Dataset">
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div>
            <label className="block mb-1 font-semibold text-foreground">Dataset Name</label>
            <input
              required
              value={newDatasetName}
              onChange={(e) => setNewDatasetName(e.target.value)}
              placeholder="e.g. Q4 In-App Purchases"
              className="w-full px-3 py-2 rounded-xl outline-none"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-foreground">Tags (comma-separated)</label>
            <input
              value={newDatasetTags}
              onChange={(e) => setNewDatasetTags(e.target.value)}
              placeholder="revenue, prod, stream"
              className="w-full px-3 py-2 rounded-xl outline-none"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-foreground">JSON Records Payload (Array)</label>
            <textarea
              rows={6}
              required
              value={newDatasetJson}
              onChange={(e) => setNewDatasetJson(e.target.value)}
              className="w-full px-3 py-2 rounded-xl font-mono-data outline-none"
              style={{ background: 'var(--secondary)', border: '1px solid var(--border)', color: 'var(--foreground)' }}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-muted">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl font-semibold text-white bg-rose-500 hover:bg-rose-600">
              Ingest & Index
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
