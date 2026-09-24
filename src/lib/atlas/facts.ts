import data from "./country-facts.json";
import { speechForCountry } from "./languages";
import type { CountryRecord } from "./types";

export type CountryFact = {
  title: string;
  body: string;
};

type FactRow = {
  title: string;
  body: string;
  local: string;
};

const FACTS = data as Record<string, FactRow>;

export type FactPack = {
  items: CountryFact[];
  english: string;
  local: string;
  language: string;
  locale: string;
  translated: boolean;
};

export function factsFor(country: CountryRecord): FactPack {
  const speech = speechForCountry(country.iso3);
  const row = FACTS[country.iso3];
  const items: CountryFact[] = row
    ? [{ title: row.title, body: row.body }]
    : [{ title: country.name, body: `${country.name} is in ${country.region}.` }];
  const english = `${country.name}. ${items.map((item) => item.body).join(" ")}`;
  const translated = speech.lang !== "en";
  const local = translated && row?.local?.trim() ? row.local : english;
  return {
    items,
    english,
    local,
    language: speech.language,
    locale: speech.locale,
    translated,
  };
}
