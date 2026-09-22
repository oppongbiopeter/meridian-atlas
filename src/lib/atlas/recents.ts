import { isKidsMetric, METRIC_BY_ID } from "./metrics";
import type { AtlasMode, MetricId } from "./types";

const METRIC_KEY = "meridian.recent.metrics";
const STAR_KEY = "meridian.star.metrics";
const PLACE_KEY = "meridian.recent.places";

const SEED: MetricId[] = ["gdp", "life", "pop", "forest", "solar"];
const KIDS_SEED: MetricId[] = ["chickens", "bananas", "frogs", "pop", "forest"];

function readList(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeList(key: string, ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(ids));
}

export function readRecentMetrics(mode: AtlasMode): MetricId[] {
  const seed = mode === "kids" ? KIDS_SEED : SEED;
  const stored = readList(METRIC_KEY).filter((id) => id in METRIC_BY_ID) as MetricId[];
  const merged = [...stored, ...seed.filter((id) => !stored.includes(id))];
  return merged.filter((id) => (mode === "kids" ? isKidsMetric(id) : true)).slice(0, 8);
}

export function readStars(): MetricId[] {
  return readList(STAR_KEY).filter((id) => id in METRIC_BY_ID) as MetricId[];
}

export function readRecentPlaces(): string[] {
  return readList(PLACE_KEY).slice(0, 6);
}

export function rememberMetric(id: MetricId) {
  const next = [id, ...readList(METRIC_KEY).filter((x) => x !== id)].slice(0, 12);
  writeList(METRIC_KEY, next);
}

export function toggleStar(id: MetricId): MetricId[] {
  const current = readStars();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [id, ...current].slice(0, 8);
  writeList(STAR_KEY, next);
  return next;
}

export function rememberPlace(id: string) {
  const next = [id, ...readList(PLACE_KEY).filter((x) => x !== id)].slice(0, 8);
  writeList(PLACE_KEY, next);
}
