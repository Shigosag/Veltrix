import { db } from '../lib/db.js';
import { formatCompactNumber } from '../lib/utils.js';
import type { DatasetItem, DatasetStatus } from '../types/dataset.js';

export class DatasetService {
  static async listDatasets(search?: string, status?: string): Promise<DatasetItem[]> {
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } },
      ];
    }

    const items = await db.dataset.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return items.map((d: any) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      rows: formatCompactNumber(d.rowsCount),
      rawRows: d.rowsCount,
      size: `${(Number(d.sizeBytes) / (1024 * 1024 * 1024)).toFixed(1)} GB`,
      status: d.status.toLowerCase() as DatasetStatus,
      updated: 'Recently',
      tags: d.tags,
    }));
  }

  static async createDataset(userId: string, name: string, rows: Record<string, unknown>[], tags: string[] = []) {
    const approximateSize = Buffer.byteLength(JSON.stringify(rows));
    return db.dataset.create({
      data: {
        userId,
        name,
        rowsCount: rows.length,
        sizeBytes: BigInt(approximateSize),
        status: 'READY',
        tags,
        data: rows as any,
      },
    });
  }
}
