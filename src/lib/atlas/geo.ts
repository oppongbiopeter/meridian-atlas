import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldJson from "@/data/world-110m.json";
import { countryById } from "./countries";
import type { CountryRecord } from "./types";

export interface CountryFeatureProperties {
  name: string;
}

export type CountryFeature = Feature<Geometry, CountryFeatureProperties> & {
  id: string;
};

const SKIP_IDS = new Set(["010", "260"]);

const NAME_KEYS: Record<string, string> = {
  Kosovo: "XKX",
  Somaliland: "SML",
  "N. Cyprus": "NCY",
};

function normalizeId(
  rawId: string | number | undefined,
  name: string | undefined,
): string | null {
  if (rawId != null && rawId !== "") {
    return String(rawId).padStart(3, "0");
  }
  if (name && NAME_KEYS[name]) return NAME_KEYS[name];
  return null;
}

export function loadCountryFeatures(): CountryFeature[] {
  const topology = worldJson as unknown as Topology<{
    countries: GeometryCollection<{ name: string }>;
  }>;
  const fc = feature(
    topology,
    topology.objects.countries,
  ) as FeatureCollection<Geometry, CountryFeatureProperties>;

  const out: CountryFeature[] = [];
  for (const f of fc.features) {
    const name = f.properties?.name ?? "Unknown";
    const id = normalizeId(f.id as string | number | undefined, name);
    if (!id || SKIP_IDS.has(id)) continue;
    out.push({ ...f, id, properties: { name } });
  }
  return out;
}

export function recordForFeature(feature: CountryFeature): CountryRecord | undefined {
  return countryById(feature.id);
}

export function displayName(feature: CountryFeature): string {
  return countryById(feature.id)?.name ?? feature.properties.name;
}
