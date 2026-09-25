import { db } from '../lib/db.js';
import { formatCompactNumber } from '../lib/utils.js';
import type { DatasetItem, DatasetStatus } from '../types/dataset.js';

export class DatasetService {
  static async listDatasets(userId: string, search?: string, status?: string): Promise<DatasetItem[]> {
    const where: any = { userId };

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    if (search && search.trim()) {
      const term = search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { tags: { has: term.toLowerCase() } },
      ];
    }

    const items = await db.dataset.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: { columns: true },
    });

    return items.map((d: any) => {
      const sizeBytesNum = Number(d.sizeBytes);
      const sizeFormatted =
        sizeBytesNum >= 1024 * 1024 * 1024
          ? `${(sizeBytesNum / (1024 * 1024 * 1024)).toFixed(1)} GB`
          : `${(sizeBytesNum / (1024 * 1024)).toFixed(1)} MB`;

      return {
        id: d.id,
        name: d.name,
        description: d.description,
        rows: formatCompactNumber(d.rowsCount),
        rawRows: d.rowsCount,
        size: sizeFormatted,
        status: d.status.toLowerCase() as DatasetStatus,
        updated: 'Recently',
        tags: d.tags,
        columns: d.columns.map((c: any) => ({
          name: c.name,
          dataType: c.dataType,
          isMetric: c.isMetric,
          isTime: c.isTime,
        })),
        dataPreview: Array.isArray(d.data) ? d.data.slice(0, 5) : [],
      };
    });
  }

  static async createDataset(userId: string, name: string, rows: Record<string, unknown>[], tags: string[] = []) {
    const approximateSize = Buffer.byteLength(JSON.stringify(rows));

    // Profile schema columns dynamically from rows
    const firstRow = rows[0] || {};
    const columnsToCreate = Object.keys(firstRow).map((key) => {
      const val = firstRow[key];
      const isNum = typeof val === 'number';
      const isDate = typeof val === 'string' && !isNaN(Date.parse(val)) && (key.includes('time') || key.includes('date'));

      return {
        name: key,
        dataType: isNum ? 'NUMBER' : isDate ? 'DATE' : typeof val === 'boolean' ? 'BOOLEAN' : 'STRING',
        isMetric: isNum,
        isTime: isDate,
      };
    });

    const created = await db.dataset.create({
      data: {
        userId,
        name,
        rowsCount: rows.length,
        sizeBytes: BigInt(approximateSize),
        status: 'READY',
        tags: tags.length ? tags.map((t) => t.toLowerCase()) : ['custom', 'ingested'],
        data: rows as any,
        columns: {
          create: columnsToCreate,
        },
      },
      include: {
        columns: true,
      },
    });

    return {
      ...created,
      sizeBytes: Number(created.sizeBytes),
    };
  }

  static async toggleArchive(userId: string, datasetId: string) {
    const dataset = await db.dataset.findFirst({
      where: { id: datasetId, userId },
    });

    if (!dataset) {
      throw new Error('Dataset not found or access denied');
    }

    const nextStatus = dataset.status === 'ARCHIVED' ? 'READY' : 'ARCHIVED';

    const updated = await db.dataset.update({
      where: { id: datasetId },
      data: { status: nextStatus },
    });

    return {
      ...updated,
      sizeBytes: Number(updated.sizeBytes),
    };
  }

  static async deleteDataset(userId: string, datasetId: string) {
    const dataset = await db.dataset.findFirst({
      where: { id: datasetId, userId },
    });

    if (!dataset) {
      throw new Error('Dataset not found or access denied');
    }

    await db.datasetColumn.deleteMany({ where: { datasetId } });
    await db.dataset.delete({ where: { id: datasetId } });
    return { success: true };
  }
}
