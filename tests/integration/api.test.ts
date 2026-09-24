import { describe, it, expect } from 'vitest';
import { DashboardService } from '../../server/src/services/dashboard-service';

describe('API Services Integration', () => {
  it('loads dashboard mock payloads with required telemetry shapes', async () => {
    const data = await DashboardService.getOverviewData();
    expect(data.revenueData.length).toBe(12);
    expect(data.kpis.length).toBeGreaterThan(0);
    expect(data.channelData.length).toBe(5);
  });
});
