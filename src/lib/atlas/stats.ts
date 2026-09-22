import { metricValue } from "./metrics";
import type { CountryRecord, MetricId } from "./types";

export interface MetricStats {
  values: { country: CountryRecord; value: number }[];
  min: number;
  max: number;
  mean: number;
  median: number;
  n: number;
}

export function computeStats(
  countries: CountryRecord[],
  metric: MetricId,
): MetricStats {
  const values = countries
    .map((country) => {
      const value = metricValue(country, metric);
      return value == null ? null : { country, value };
    })
    .filter((row): row is { country: CountryRecord; value: number } => row !== null)
    .sort((a, b) => b.value - a.value);

  const nums = values.map((v) => v.value);
  const n = nums.length;
  const min = n ? nums[n - 1] : 0;
  const max = n ? nums[0] : 0;
  const mean = n ? nums.reduce((s, v) => s + v, 0) / n : 0;
  const mid = Math.floor(n / 2);
  const median = n
    ? n % 2
      ? nums[mid]
      : (nums[mid - 1] + nums[mid]) / 2
    : 0;

  return { values, min, max, mean, median, n };
}

export function rankOf(
  stats: MetricStats,
  id: string,
): { rank: number; value: number; percentile: number } | null {
  const index = stats.values.findIndex((row) => row.country.id === id);
  if (index < 0) return null;
  const rank = index + 1;
  const percentile = stats.n <= 1 ? 100 : ((stats.n - index - 1) / (stats.n - 1)) * 100;
  return { rank, value: stats.values[index].value, percentile };
}
