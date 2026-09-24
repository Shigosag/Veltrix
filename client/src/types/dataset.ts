export type DatasetStatus = 'live' | 'ready' | 'processing' | 'archived';

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
}
