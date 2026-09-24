import { describe, it, expect } from 'vitest';
import { StatisticalInsightEngine } from '../../server/src/lib/insights';

describe('StatisticalInsightEngine', () => {
  const engine = new StatisticalInsightEngine();

  it('generates an Anomaly insight when metric drops >= 15%', async () => {
    const insights = await engine.generate({
      kpis: [{ name: 'Latency', current: 70, previous: 100 }],
      timeSeries: [],
    });

    expect(insights.length).toBe(1);
    expect(insights[0].category).toBe('Anomaly');
  });

  it('generates an Opportunity insight when metric surges >= 15%', async () => {
    const insights = await engine.generate({
      kpis: [{ name: 'ARR', current: 150, previous: 100 }],
      timeSeries: [],
    });

    expect(insights.length).toBe(1);
    expect(insights[0].category).toBe('Revenue');
  });
});
