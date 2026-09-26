import { describe, it, expect } from 'vitest';
import { calculateGrowthRate, detectAnomalies, calculateZScore, calculateRollingAverage } from '../../server/src/lib/analytics';

describe('Analytics Calculations Engine', () => {
  it('correctly calculates percentage changes', () => {
    expect(calculateGrowthRate(150, 100)).toBe(50.0);
    expect(calculateGrowthRate(80, 100)).toBe(-20.0);
    expect(calculateGrowthRate(100, 0)).toBe(100.0);
    expect(calculateGrowthRate(0, 0)).toBe(0.0);
  });

  it('computes Z-Scores and flags statistical outliers correctly', () => {
    const series = [10, 10, 11, 10, 12, 10, 95]; // 95 is a massive anomaly
    const anomalies = detectAnomalies(series, 2.0);
    expect(anomalies).toContain(6); // Index 6 is 95
  });

  it('computes rolling averages accurately', () => {
    const series = [10, 20, 30, 40];
    const rolling = calculateRollingAverage(series, 2);
    expect(rolling[0]).toBe(10.0);
    expect(rolling[1]).toBe(15.0);
    expect(rolling[2]).toBe(25.0);
    expect(rolling[3]).toBe(35.0);
  });
});
