export function calculateZScore(values: number[]): { index: number; value: number; zScore: number }[] {
  if (values.length < 3) return [];
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance) || 1;

  return values.map((value, index) => ({
    index,
    value,
    zScore: (value - mean) / stdDev,
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
