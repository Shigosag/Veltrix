import { describe, it, expect } from 'vitest';
import { calculateGrowthRate, detectAnomalies, calculateZScore } from '../../server/src/lib/analytics';

describe('Analytics Calculations Engine', () => {
  it('correctly calculates percentage changes', () => {
    expect(calculateGrowthRate(150, 100)).toBe(50.0);
    expect(calculateGrowthRate(80, 100)).toBe(-20.0);
    expect(calculateGrowthRate(100, 0)).toBe(100.0);
  });

  it('computes Z-Scores and flags outliers', () => {
    const series = [10, 10, 11, 10, 12, 10, 95]; // 95 is a massive anomaly
    const anomalies = detectAnomalies(series, 2.0);
    expect(anomalies).toContain(6); // Index 6 is 95
  });
});
