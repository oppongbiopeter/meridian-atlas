import { interpolateRgb, piecewise } from "d3-interpolate";
import { scaleSequential, scaleSequentialLog } from "d3-scale";
import type { AtlasMode, MetricDef } from "./types";

/** Sequential teal ramp — cartographic, not UI chrome. */
export const ATLAS_CHORO = [
  "#1b3940",
  "#275c63",
  "#3b8880",
  "#7ebbae",
  "#d5f0e8",
] as const;

/** Bright luminance-ordered ramp for kids mode. */
export const KIDS_CHORO = [
  "#312e81",
  "#2563eb",
  "#06b6d4",
  "#84cc16",
  "#fde047",
] as const;

export const CHORO_STOPS = ATLAS_CHORO;

export const EMPTY_FILL: Record<AtlasMode, string> = {
  atlas: "#1a1f27",
  kids: "#24306a",
};

export function choroStops(mode: AtlasMode): readonly string[] {
  return mode === "kids" ? KIDS_CHORO : ATLAS_CHORO;
}

export function createColorScale(
  metric: MetricDef,
  values: number[],
  stops: readonly string[] = ATLAS_CHORO,
): ((value: number) => string) | null {
  const finite = values.filter((v) => Number.isFinite(v));
  if (finite.length < 2) return null;

  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const interpolator = piecewise(interpolateRgb, stops as unknown as string[]);
  if (min === max) {
    return () => stops[2] ?? stops[0];
  }

  if (metric.scale === "log") {
    const positive = finite.filter((v) => v > 0);
    if (positive.length < 2) return () => stops[2] ?? stops[0];
    const lo = Math.min(...positive);
    const hi = Math.max(...positive);
    return scaleSequentialLog(interpolator).domain([lo, hi]).clamp(true);
  }

  return scaleSequential(interpolator).domain([min, max]).clamp(true);
}

export function legendTicks(
  metric: MetricDef,
  values: number[],
  count = 5,
): number[] {
  const finite = values.filter((v) => Number.isFinite(v));
  if (finite.length === 0) return [];
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  if (min === max) return [min];

  if (metric.scale === "log") {
    const lo = Math.max(min, 1);
    const ticks: number[] = [];
    for (let i = 0; i < count; i++) {
      const t = i / (count - 1);
      ticks.push(Math.exp(Math.log(lo) + t * (Math.log(max) - Math.log(lo))));
    }
    return ticks;
  }

  const ticks: number[] = [];
  for (let i = 0; i < count; i++) {
    ticks.push(min + (i / (count - 1)) * (max - min));
  }
  return ticks;
}
