import snapshotJson from "@/data/owid-snapshot.json";
import { COUNTRIES } from "./countries";
import { METRIC_IDS } from "./metrics";
import type { CountryRecord, MetricId } from "./types";

export type OwidObs = { v: number; y: number };

export type OwidMetricBlock = {
  slug: string;
  title: string;
  citation: string;
  citationShort: string;
  unit: string;
  updated: string;
  sourceUrl: string;
  column: string;
  latestYear: number | null;
  minYear: number | null;
  n: number;
  values: Record<string, OwidObs>;
};

export type OwidSnapshot = {
  fetchedAt: string;
  attribution: string;
  metrics: Record<MetricId, OwidMetricBlock>;
};

export const OWID_SNAPSHOT = snapshotJson as OwidSnapshot;

export function applyOwid(
  base: CountryRecord[] = COUNTRIES,
  snap: OwidSnapshot = OWID_SNAPSHOT,
): CountryRecord[] {
  return base.map((country) => {
    const values: CountryRecord["values"] = {};
    for (const id of METRIC_IDS) {
      const obs = snap.metrics[id]?.values[country.iso3];
      values[id] = obs ? obs.v : null;
    }
    return { ...country, values };
  });
}

export function buildAtlas(
  base: CountryRecord[] = COUNTRIES,
  snap: OwidSnapshot = OWID_SNAPSHOT,
) {
  const countries = applyOwid(base, snap);
  const byId = new Map(countries.map((c) => [c.id, c]));
  return {
    countries,
    byId,
    snapshot: snap,
    get(id: string | null | undefined) {
      if (!id) return undefined;
      return byId.get(id);
    },
  };
}

export function metricSource(
  metric: MetricId,
  snap: OwidSnapshot = OWID_SNAPSHOT,
): OwidMetricBlock {
  return (
    snap.metrics[metric] ?? {
      slug: metric,
      title: metric,
      citation: "Our World in Data",
      citationShort: "Our World in Data",
      unit: "",
      updated: "",
      sourceUrl: "https://ourworldindata.org",
      column: "",
      latestYear: null,
      minYear: null,
      n: 0,
      values: {},
    }
  );
}

export function observationYear(
  iso3: string,
  metric: MetricId,
  snap: OwidSnapshot = OWID_SNAPSHOT,
): number | null {
  return snap.metrics[metric]?.values[iso3]?.y ?? null;
}
