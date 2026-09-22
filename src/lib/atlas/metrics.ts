import type {
  AtlasMode,
  CountryRecord,
  KidsGroupId,
  MetricDef,
  MetricGroupId,
  MetricId,
} from "./types";

export const METRIC_GROUPS: { id: MetricGroupId; label: string }[] = [
  { id: "people", label: "People" },
  { id: "society", label: "Society" },
  { id: "energy", label: "Energy" },
  { id: "living", label: "Living world" },
  { id: "safety", label: "Safety" },
  { id: "sport", label: "Sport" },
];

export const KIDS_GROUPS: { id: KidsGroupId; label: string }[] = [
  { id: "animals", label: "Animals" },
  { id: "farms", label: "Farms" },
  { id: "wild", label: "Wild" },
  { id: "us", label: "Us" },
];

export const METRICS: MetricDef[] = [
  {
    id: "pop",
    group: "people",
    kidsGroup: "us",
    label: "Population",
    short: "Pop.",
    unit: "people",
    description:
      "Estimated residents. The map uses a log color scale so both small and very large countries remain readable.",
    higherLabel: "More people",
    lowerLabel: "Fewer people",
    kidsLabel: "How many people",
    kidsShort: "People",
    kidsDescription: "How many humans live in each country. Bigger countries glow brighter.",
    kidsHigher: "More people",
    kidsLower: "Fewer people",
    scale: "log",
    decimals: 0,
    format: "compact",
  },
  {
    id: "life",
    group: "people",
    kidsGroup: "us",
    label: "Life expectancy",
    short: "Life",
    unit: "years",
    description:
      "Period life expectancy at birth: years a newborn would live if current mortality patterns held.",
    higherLabel: "Longer lives",
    lowerLabel: "Shorter lives",
    kidsLabel: "How long people live",
    kidsShort: "Years",
    kidsDescription: "How many years a baby born today would live, on average, in that country.",
    kidsHigher: "Longer lives",
    kidsLower: "Shorter lives",
    scale: "linear",
    decimals: 1,
    format: "years",
  },
  {
    id: "hunger",
    group: "people",
    label: "Undernourishment",
    short: "Hunger",
    unit: "% of population",
    description:
      "Share of people whose habitual food consumption is insufficient to provide the dietary energy required for a normal, active life (FAO).",
    higherLabel: "More hungry",
    lowerLabel: "Less hungry",
    scale: "linear",
    decimals: 1,
    format: "percent",
  },
  {
    id: "obesity",
    group: "people",
    label: "Adult obesity",
    short: "Obesity",
    unit: "% of adults",
    description:
      "Share of adults with a body-mass index of 30 or above, both sexes, age 18+ (WHO).",
    higherLabel: "Higher obesity",
    lowerLabel: "Lower obesity",
    scale: "linear",
    decimals: 1,
    format: "percent",
  },
  {
    id: "fertility",
    group: "people",
    label: "Fertility",
    short: "Births",
    unit: "births per woman",
    description:
      "Average number of live births a woman would have over her lifetime if current age-specific fertility rates held.",
    higherLabel: "More births",
    lowerLabel: "Fewer births",
    scale: "linear",
    decimals: 2,
    format: "decimal",
  },
  {
    id: "marriage",
    group: "people",
    label: "Marriage rate",
    short: "Weddings",
    unit: "per 1,000 people",
    description:
      "Crude marriage rate: new marriages per thousand people. Coverage is thin — mostly OECD and a handful of others.",
    higherLabel: "More marriages",
    lowerLabel: "Fewer marriages",
    scale: "linear",
    decimals: 1,
    format: "decimal",
  },
  {
    id: "gdp",
    group: "society",
    label: "GDP per capita",
    short: "GDP",
    unit: "2021 intl-$",
    description:
      "Output per person, adjusted for inflation and living costs (World Bank PPP). A snapshot of average material living standards.",
    higherLabel: "Higher income",
    lowerLabel: "Lower income",
    scale: "linear",
    decimals: 0,
    format: "currency",
  },
  {
    id: "hdi",
    group: "society",
    label: "Human development",
    short: "HDI",
    unit: "index 0–1",
    description:
      "UNDP composite of life expectancy, education, and income. Closer to 1 means higher human development.",
    higherLabel: "More developed",
    lowerLabel: "Less developed",
    scale: "linear",
    decimals: 3,
    format: "decimal",
  },
  {
    id: "net",
    group: "society",
    label: "Internet access",
    short: "Net",
    unit: "% of population",
    description:
      "Share of people who used the internet in the past three months, any device.",
    higherLabel: "More connected",
    lowerLabel: "Less connected",
    scale: "linear",
    decimals: 0,
    format: "percent",
  },
  {
    id: "gender",
    group: "society",
    label: "Gender inequality",
    short: "Gender",
    unit: "index 0–1",
    description:
      "UNDP Gender Inequality Index: reproductive health, empowerment, and labor-market gaps. Higher means greater disparity between women and men.",
    higherLabel: "More unequal",
    lowerLabel: "More equal",
    scale: "linear",
    decimals: 3,
    format: "decimal",
  },
  {
    id: "labor",
    group: "society",
    label: "Female / male labor",
    short: "Labor",
    unit: "female rate as % of male",
    description:
      "Women’s labor-force participation as a percentage of men’s. 100 means equal participation; lower means fewer women in work relative to men.",
    higherLabel: "Closer parity",
    lowerLabel: "Wider gap",
    scale: "linear",
    decimals: 0,
    format: "percent",
  },
  {
    id: "co2",
    group: "energy",
    label: "CO₂ per capita",
    short: "CO₂",
    unit: "tonnes / person",
    description:
      "Annual carbon dioxide from fossil fuels and industry, divided by population (production-based).",
    higherLabel: "Higher emissions",
    lowerLabel: "Lower emissions",
    scale: "linear",
    decimals: 1,
    format: "decimal",
    suffix: " t",
  },
  {
    id: "solar",
    group: "energy",
    label: "Solar capacity",
    short: "Solar",
    unit: "gigawatts",
    description:
      "Installed solar electricity capacity (IRENA). Total gigawatts, not per person — large countries dominate. Log color so smaller fleets still read.",
    higherLabel: "More solar",
    lowerLabel: "Less solar",
    scale: "log",
    decimals: 1,
    format: "decimal",
    suffix: " GW",
  },
  {
    id: "wind",
    group: "energy",
    label: "Wind capacity",
    short: "Wind",
    unit: "gigawatts",
    description:
      "Installed wind electricity capacity, onshore and offshore (IRENA). Total gigawatts, log-colored.",
    higherLabel: "More wind",
    lowerLabel: "Less wind",
    scale: "log",
    decimals: 1,
    format: "decimal",
    suffix: " GW",
  },
  {
    id: "nuclear",
    group: "energy",
    label: "Nuclear electricity",
    short: "Nuclear",
    unit: "terawatt-hours",
    description:
      "Annual electricity generated from nuclear plants (Ember). OWID does not publish a country plant-count series; generation is the working proxy for the fleet in operation.",
    higherLabel: "More nuclear",
    lowerLabel: "Less nuclear",
    scale: "log",
    decimals: 0,
    format: "compact",
    suffix: " TWh",
  },
  {
    id: "cattle",
    group: "living",
    kidsGroup: "animals",
    label: "Cattle",
    short: "Cows",
    unit: "animals",
    description: "Live cattle on farms — cows, bulls, and calves counted in a given year (FAO).",
    higherLabel: "More cattle",
    lowerLabel: "Fewer cattle",
    kidsLabel: "Cows and bulls",
    kidsShort: "Cows",
    kidsDescription: "How many cows, bulls, and calves live on farms. India and Brazil have giant herds.",
    kidsHigher: "More cows",
    kidsLower: "Fewer cows",
    scale: "log",
    decimals: 0,
    format: "compact",
  },
  {
    id: "chickens",
    group: "living",
    kidsGroup: "animals",
    label: "Chickens",
    short: "Chickens",
    unit: "animals",
    description: "Live chickens counted on farms in a given year (FAO, via OWID’s animal-welfare explorer).",
    higherLabel: "More chickens",
    lowerLabel: "Fewer chickens",
    kidsLabel: "Chickens",
    kidsShort: "Chickens",
    kidsDescription: "How many chickens are alive on farms. There are more chickens than people on Earth.",
    kidsHigher: "More chickens",
    kidsLower: "Fewer chickens",
    scale: "log",
    decimals: 0,
    format: "compact",
  },
  {
    id: "pigs",
    group: "living",
    kidsGroup: "animals",
    label: "Pigs",
    short: "Pigs",
    unit: "animals",
    description: "Live pigs counted on farms in a given year (FAO).",
    higherLabel: "More pigs",
    lowerLabel: "Fewer pigs",
    kidsLabel: "Pigs",
    kidsShort: "Pigs",
    kidsDescription: "How many pigs live on farms. China raises the most.",
    kidsHigher: "More pigs",
    kidsLower: "Fewer pigs",
    scale: "log",
    decimals: 0,
    format: "compact",
  },
  {
    id: "cereal",
    group: "living",
    kidsGroup: "farms",
    label: "Cereal harvest",
    short: "Grain",
    unit: "tonnes",
    description: "Annual production of cereals — wheat, rice, maize, barley, and the rest (FAO).",
    higherLabel: "Bigger harvest",
    lowerLabel: "Smaller harvest",
    kidsLabel: "Grain harvest",
    kidsShort: "Grain",
    kidsDescription: "How much wheat, rice, corn, and other grains farmers grew this year, in tonnes.",
    kidsHigher: "More grain",
    kidsLower: "Less grain",
    scale: "log",
    decimals: 0,
    format: "compact",
    suffix: " t",
  },
  {
    id: "rice",
    group: "living",
    kidsGroup: "farms",
    label: "Rice harvest",
    short: "Rice",
    unit: "tonnes",
    description: "Annual rice production (FAO).",
    higherLabel: "More rice",
    lowerLabel: "Less rice",
    kidsLabel: "Rice",
    kidsShort: "Rice",
    kidsDescription: "Tonnes of rice grown in a year. Look for the bright countries in Asia.",
    kidsHigher: "More rice",
    kidsLower: "Less rice",
    scale: "log",
    decimals: 0,
    format: "compact",
    suffix: " t",
  },
  {
    id: "bananas",
    group: "living",
    kidsGroup: "farms",
    label: "Banana harvest",
    short: "Bananas",
    unit: "tonnes",
    description: "Annual banana production (FAO).",
    higherLabel: "More bananas",
    lowerLabel: "Fewer bananas",
    kidsLabel: "Bananas",
    kidsShort: "Bananas",
    kidsDescription: "Tonnes of bananas grown in a year. India and tropical countries glow.",
    kidsHigher: "More bananas",
    kidsLower: "Fewer bananas",
    scale: "log",
    decimals: 0,
    format: "compact",
    suffix: " t",
  },
  {
    id: "cocoa",
    group: "living",
    kidsGroup: "farms",
    label: "Cocoa harvest",
    short: "Cocoa",
    unit: "tonnes",
    description: "Annual cocoa-bean production — the raw ingredient for chocolate (FAO).",
    higherLabel: "More cocoa",
    lowerLabel: "Less cocoa",
    kidsLabel: "Chocolate beans",
    kidsShort: "Cocoa",
    kidsDescription: "Cocoa beans that become chocolate. West Africa grows most of the world’s supply.",
    kidsHigher: "More cocoa",
    kidsLower: "Less cocoa",
    scale: "log",
    decimals: 0,
    format: "compact",
    suffix: " t",
  },
  {
    id: "fish",
    group: "living",
    kidsGroup: "wild",
    label: "Wild fish catch",
    short: "Wild fish",
    unit: "tonnes",
    description:
      "Wild-caught fish and seafood from oceans, rivers, and lakes — not farmed (World Bank / FAO).",
    higherLabel: "Bigger catch",
    lowerLabel: "Smaller catch",
    kidsLabel: "Wild fish",
    kidsShort: "Fish",
    kidsDescription:
      "Fish caught in the wild from seas, rivers, and lakes. We don’t have a map of every whale or coral — this is the catch.",
    kidsHigher: "More fish",
    kidsLower: "Fewer fish",
    scale: "log",
    decimals: 0,
    format: "compact",
    suffix: " t",
  },
  {
    id: "farms",
    group: "living",
    kidsGroup: "farms",
    label: "Farmed fish",
    short: "Fish farms",
    unit: "tonnes",
    description: "Aquaculture: fish and seafood grown on farms rather than caught wild.",
    higherLabel: "More farmed fish",
    lowerLabel: "Less farmed fish",
    kidsLabel: "Fish farms",
    kidsShort: "Farms",
    kidsDescription: "Fish and seafood grown on farms, like underwater gardens. China leads by a lot.",
    kidsHigher: "More farmed",
    kidsLower: "Less farmed",
    scale: "log",
    decimals: 0,
    format: "compact",
    suffix: " t",
  },
  {
    id: "forest",
    group: "living",
    kidsGroup: "wild",
    label: "Forest cover",
    short: "Forest",
    unit: "% of land",
    description:
      "Share of a country’s land covered by forest. There is no country-level bamboo map, so this is all trees.",
    higherLabel: "More forest",
    lowerLabel: "Less forest",
    kidsLabel: "Trees and forests",
    kidsShort: "Trees",
    kidsDescription:
      "How much of the country is still forest. We don’t have a bamboo-only map yet, so this counts all trees.",
    kidsHigher: "More trees",
    kidsLower: "Fewer trees",
    scale: "linear",
    decimals: 0,
    format: "percent",
  },
  {
    id: "birds",
    group: "living",
    kidsGroup: "wild",
    label: "Endemic birds",
    short: "Birds",
    unit: "species",
    description:
      "Bird species found in this country and almost nowhere else. Not a migration map — a count of unique residents.",
    higherLabel: "More unique birds",
    lowerLabel: "Fewer unique birds",
    kidsLabel: "Special birds",
    kidsShort: "Birds",
    kidsDescription:
      "Birds that live in this country and almost nowhere else. Australia and tropical islands light up.",
    kidsHigher: "More special birds",
    kidsLower: "Fewer special birds",
    scale: "log",
    decimals: 0,
    format: "compact",
  },
  {
    id: "mammals",
    group: "living",
    kidsGroup: "wild",
    label: "Endemic mammals",
    short: "Mammals",
    unit: "species",
    description:
      "Mammal species found in this country and almost nowhere else — from lemurs in Madagascar to kangaroos in Australia.",
    higherLabel: "More unique mammals",
    lowerLabel: "Fewer unique mammals",
    kidsLabel: "Special mammals",
    kidsShort: "Mammals",
    kidsDescription:
      "Mammals that live mainly in this country: lemurs, kangaroos, and other one-of-a-kind animals.",
    kidsHigher: "More special mammals",
    kidsLower: "Fewer special mammals",
    scale: "log",
    decimals: 0,
    format: "compact",
  },
  {
    id: "frogs",
    group: "living",
    kidsGroup: "wild",
    label: "Endemic amphibians",
    short: "Frogs",
    unit: "species",
    description:
      "Amphibian species — frogs, toads, salamanders — found in this country and almost nowhere else.",
    higherLabel: "More unique amphibians",
    lowerLabel: "Fewer unique amphibians",
    kidsLabel: "Frogs and toads",
    kidsShort: "Frogs",
    kidsDescription: "Frogs, toads, and salamanders that live mainly in this country. Rainforests win.",
    kidsHigher: "More frogs",
    kidsLower: "Fewer frogs",
    scale: "log",
    decimals: 0,
    format: "compact",
  },
  {
    id: "homicide",
    group: "safety",
    label: "Homicide rate",
    short: "Homicide",
    unit: "per 100,000 people",
    description:
      "Intentional homicides per 100,000 people (UNODC). Coverage lags; many countries last report two or three years back.",
    higherLabel: "More homicides",
    lowerLabel: "Fewer homicides",
    scale: "log",
    decimals: 1,
    format: "decimal",
    tier: "plus",
    mature: true,
  },
  {
    id: "conflict",
    group: "safety",
    label: "Conflict deaths",
    short: "Conflict",
    unit: "per 100,000 people",
    description:
      "Death rate in armed conflicts based on where they occurred (UCDP, via OWID). Combatants and civilians, best estimate.",
    higherLabel: "More conflict deaths",
    lowerLabel: "Fewer conflict deaths",
    scale: "log",
    decimals: 2,
    format: "decimal",
    tier: "plus",
    mature: true,
  },
  {
    id: "prison",
    group: "safety",
    label: "Prison population",
    short: "Prison",
    unit: "per 100,000 people",
    description: "People in prison per 100,000 residents. A stock, not an annual flow of convictions.",
    higherLabel: "Higher imprisonment",
    lowerLabel: "Lower imprisonment",
    scale: "linear",
    decimals: 0,
    format: "decimal",
    tier: "plus",
    mature: true,
  },
  {
    id: "quakes",
    group: "safety",
    label: "Earthquake deaths",
    short: "Quakes",
    unit: "deaths, latest year",
    description:
      "Deaths attributed to earthquakes in the latest reporting year (EM-DAT via OWID). Rare events — most countries are empty in a given year.",
    higherLabel: "More deaths that year",
    lowerLabel: "Fewer deaths that year",
    scale: "log",
    decimals: 0,
    format: "compact",
    tier: "plus",
    mature: false,
  },
  {
    id: "football",
    group: "sport",
    label: "World Cup titles",
    short: "Football",
    unit: "men’s titles",
    description:
      "FIFA World Cup wins through Qatar 2022. England’s 1966 title is drawn on the United Kingdom. Ticket and merch sales are not published as a country series — titles are the honest public proxy.",
    higherLabel: "More titles",
    lowerLabel: "Fewer titles",
    scale: "linear",
    decimals: 0,
    format: "decimal",
    tier: "plus",
    mature: false,
  },
];

export const METRIC_BY_ID: Record<MetricId, MetricDef> = Object.fromEntries(
  METRICS.map((m) => [m.id, m]),
) as Record<MetricId, MetricDef>;

export const METRIC_IDS = METRICS.map((m) => m.id);

export const DEFAULT_METRIC: Record<AtlasMode, MetricId> = {
  atlas: "gdp",
  kids: "chickens",
};

export function metricsInGroup(group: MetricGroupId): MetricDef[] {
  return METRICS.filter((m) => m.group === group);
}

export function metricsInKidsGroup(group: KidsGroupId): MetricDef[] {
  return METRICS.filter((m) => m.kidsGroup === group);
}

export function isKidsMetric(id: MetricId): boolean {
  const def = METRIC_BY_ID[id];
  return def?.kidsGroup != null && !def.mature;
}

export function isPlusMetric(id: MetricId): boolean {
  return METRIC_BY_ID[id]?.tier === "plus";
}

export function isMatureMetric(id: MetricId): boolean {
  return Boolean(METRIC_BY_ID[id]?.mature);
}

export function visibleMetrics(mode: AtlasMode): MetricDef[] {
  if (mode === "kids") return METRICS.filter((m) => m.kidsGroup && !m.mature);
  return METRICS;
}

export function searchMetrics(query: string, mode: AtlasMode): MetricDef[] {
  const q = query.trim().toLowerCase();
  const pool = visibleMetrics(mode);
  if (!q) return pool;
  return pool.filter((m) => {
    const copy = resolveMetric(m, mode);
    return [m.id, copy.label, copy.short, copy.description, m.unit]
      .filter(Boolean)
      .some((s) => s.toLowerCase().includes(q));
  });
}

export function resolveMetric(metric: MetricDef, mode: AtlasMode) {
  if (mode !== "kids") {
    return {
      label: metric.label,
      short: metric.short,
      description: metric.description,
      higherLabel: metric.higherLabel,
      lowerLabel: metric.lowerLabel,
    };
  }
  return {
    label: metric.kidsLabel ?? metric.label,
    short: metric.kidsShort ?? metric.short,
    description: metric.kidsDescription ?? metric.description,
    higherLabel: metric.kidsHigher ?? metric.higherLabel,
    lowerLabel: metric.kidsLower ?? metric.lowerLabel,
  };
}

export function metricValue(
  country: CountryRecord,
  metric: MetricId,
): number | null {
  const value = country.values[metric];
  return value == null ? null : value;
}

export function formatMetricValue(
  metric: MetricId,
  value: number | null | undefined,
): string {
  if (value == null || Number.isNaN(value)) return "—";
  const def = METRIC_BY_ID[metric];
  const suffix = def.suffix ?? "";

  switch (def.format) {
    case "currency":
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
    case "percent":
      return `${value.toFixed(def.decimals)}%`;
    case "years":
      return `${value.toFixed(def.decimals)} yr`;
    case "compact": {
      const compact = new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: value >= 1e6 ? 1 : 0,
      }).format(value);
      return `${compact}${suffix}`;
    }
    case "decimal": {
      if (metric === "solar" || metric === "wind") {
        return `${value.toFixed(value >= 10 ? 0 : 1)}${suffix}`;
      }
      if (metric === "fertility") return value.toFixed(2);
      if (metric === "marriage") return value.toFixed(1);
      return `${value.toFixed(def.decimals)}${suffix}`;
    }
    default:
      return String(value);
  }
}

export function formatPopulationExact(value: number): string {
  return new Intl.NumberFormat("en").format(value);
}
