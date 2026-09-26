export type DatasetStatus = 'live' | 'ready' | 'processing' | 'archived';

export interface DatasetColumn {
  name: string;
  dataType: string;
  isMetric: boolean;
  isTime: boolean;
}

export interface DatasetItem {
  id: string;
  name: string;
  description?: string | null;
  rows: string;
  rawRows: number;
  size: string;
  status: DatasetStatus;
  updated: string;
  tags: string[];
  columns?: DatasetColumn[];
  dataPreview?: Record<string, unknown>[];
}

export interface DatasetStats {
  totalDatasets: number;
  totalRows: string;
  storageUsed: string;
  liveConnections: number;
}
