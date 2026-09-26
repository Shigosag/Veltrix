export interface ZScoreResult {
  index: number;
  value: number;
  zScore: number;
}

export function calculateZScore(values: number[]): ZScoreResult[] {
  if (!values || values.length < 3) return [];
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance) || 1e-6;

  return values.map((value, index) => ({
    index,
    value,
    zScore: Number(((value - mean) / stdDev).toFixed(2)),
  }));
}

export function detectAnomalies(values: number[], threshold = 2.0): number[] {
  const scores = calculateZScore(values);
  return scores.filter((s) => Math.abs(s.zScore) >= threshold).map((s) => s.index);
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Number((((current - previous) / Math.abs(previous)) * 100).toFixed(1));
}

export function calculateRollingAverage(values: number[], windowSize = 3): number[] {
  if (!values || values.length === 0) return [];
  return values.map((_, idx, arr) => {
    const start = Math.max(0, idx - windowSize + 1);
    const subset = arr.slice(start, idx + 1);
    const avg = subset.reduce((a, b) => a + b, 0) / subset.length;
    return Number(avg.toFixed(2));
  });
}
