export type Region = "Africa" | "Americas" | "Asia" | "Europe" | "Oceania";

export type AtlasMode = "atlas" | "kids";
export type MapView = "map" | "globe";
export type QuizDifficulty = "easy" | "medium" | "hard";

export type MetricGroupId = "people" | "society" | "energy" | "living" | "safety" | "sport";

export type KidsGroupId = "us" | "animals" | "farms" | "wild";

export type MetricId =
  | "gdp"
  | "life"
  | "hdi"
  | "pop"
  | "co2"
  | "net"
  | "hunger"
  | "obesity"
  | "fertility"
  | "marriage"
  | "gender"
  | "labor"
  | "solar"
  | "wind"
  | "nuclear"
  | "cattle"
  | "chickens"
  | "pigs"
  | "cereal"
  | "rice"
  | "bananas"
  | "cocoa"
  | "fish"
  | "farms"
  | "forest"
  | "birds"
  | "mammals"
  | "frogs"
  | "homicide"
  | "conflict"
  | "prison"
  | "quakes"
  | "football";

export type MetricFormat = "currency" | "percent" | "compact" | "years" | "decimal";

export interface CountryRecord {
  id: string;
  iso3: string;
  name: string;
  region: Region;
  values: Partial<Record<MetricId, number | null>>;
}

export interface MetricDef {
  id: MetricId;
  group: MetricGroupId;
  kidsGroup?: KidsGroupId;
  label: string;
  short: string;
  unit: string;
  description: string;
  higherLabel: string;
  lowerLabel: string;
  scale: "linear" | "log";
  decimals: number;
  format: MetricFormat;
  suffix?: string;
  kidsLabel?: string;
  kidsShort?: string;
  kidsDescription?: string;
  kidsHigher?: string;
  kidsLower?: string;
  tier?: "free" | "plus";
  mature?: boolean;
}
