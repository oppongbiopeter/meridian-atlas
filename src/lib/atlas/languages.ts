export type CountrySpeech = {
  locale: string;
  lang: string;
  language: string;
};

const LANG: Record<string, { locale: string; language: string }> = {
  en: { locale: "en-US", language: "English" },
  es: { locale: "es-MX", language: "Spanish" },
  pt: { locale: "pt-BR", language: "Portuguese" },
  fr: { locale: "fr-FR", language: "French" },
  de: { locale: "de-DE", language: "German" },
  it: { locale: "it-IT", language: "Italian" },
  nl: { locale: "nl-NL", language: "Dutch" },
  ru: { locale: "ru-RU", language: "Russian" },
  uk: { locale: "uk-UA", language: "Ukrainian" },
  pl: { locale: "pl-PL", language: "Polish" },
  tr: { locale: "tr-TR", language: "Turkish" },
  ar: { locale: "ar-SA", language: "Arabic" },
  he: { locale: "he-IL", language: "Hebrew" },
  hi: { locale: "hi-IN", language: "Hindi" },
  bn: { locale: "bn-IN", language: "Bengali" },
  ur: { locale: "ur-PK", language: "Urdu" },
  zh: { locale: "zh-CN", language: "Chinese" },
  ja: { locale: "ja-JP", language: "Japanese" },
  ko: { locale: "ko-KR", language: "Korean" },
  th: { locale: "th-TH", language: "Thai" },
  vi: { locale: "vi-VN", language: "Vietnamese" },
  id: { locale: "id-ID", language: "Indonesian" },
  ms: { locale: "ms-MY", language: "Malay" },
  fil: { locale: "fil-PH", language: "Filipino" },
  sv: { locale: "sv-SE", language: "Swedish" },
  da: { locale: "da-DK", language: "Danish" },
  no: { locale: "nb-NO", language: "Norwegian" },
  fi: { locale: "fi-FI", language: "Finnish" },
  el: { locale: "el-GR", language: "Greek" },
  cs: { locale: "cs-CZ", language: "Czech" },
  sk: { locale: "sk-SK", language: "Slovak" },
  hu: { locale: "hu-HU", language: "Hungarian" },
  ro: { locale: "ro-RO", language: "Romanian" },
  bg: { locale: "bg-BG", language: "Bulgarian" },
  hr: { locale: "hr-HR", language: "Croatian" },
  sr: { locale: "sr-RS", language: "Serbian" },
  sl: { locale: "sl-SI", language: "Slovenian" },
  lt: { locale: "lt-LT", language: "Lithuanian" },
  lv: { locale: "lv-LV", language: "Latvian" },
  et: { locale: "et-EE", language: "Estonian" },
  fa: { locale: "fa-IR", language: "Persian" },
  sw: { locale: "sw-KE", language: "Swahili" },
  am: { locale: "am-ET", language: "Amharic" },
  ka: { locale: "ka-GE", language: "Georgian" },
  hy: { locale: "hy-AM", language: "Armenian" },
  az: { locale: "az-AZ", language: "Azerbaijani" },
  km: { locale: "km-KH", language: "Khmer" },
  lo: { locale: "lo-LA", language: "Lao" },
  my: { locale: "my-MM", language: "Burmese" },
  ne: { locale: "ne-NP", language: "Nepali" },
  si: { locale: "si-LK", language: "Sinhala" },
  mn: { locale: "mn-MN", language: "Mongolian" },
  uz: { locale: "uz-UZ", language: "Uzbek" },
  kk: { locale: "kk-KZ", language: "Kazakh" },
  ca: { locale: "ca-ES", language: "Catalan" },
  is: { locale: "is-IS", language: "Icelandic" },
  sq: { locale: "sq-AL", language: "Albanian" },
  bs: { locale: "bs-BA", language: "Bosnian" },
  mk: { locale: "mk-MK", language: "Macedonian" },
  so: { locale: "so-SO", language: "Somali" },
  dz: { locale: "dz-BT", language: "Dzongkha" },
  kl: { locale: "kl-GL", language: "Greenlandic" },
  ti: { locale: "ti-ER", language: "Tigrinya" },
  ky: { locale: "ky-KG", language: "Kyrgyz" },
  tg: { locale: "tg-TJ", language: "Tajik" },
  tk: { locale: "tk-TM", language: "Turkmen" },
};

const ISO3_LANG: Record<string, string> = {
  AFG: "fa", ALB: "sq", DZA: "ar", AGO: "pt", ARG: "es", ARM: "hy", AUS: "en", AUT: "de",
  AZE: "az", BHS: "en", BGD: "bn", BLR: "ru", BEL: "nl", BLZ: "en", BEN: "fr", BTN: "dz",
  BOL: "es", BIH: "bs", BWA: "en", BRA: "pt", BRN: "ms", BGR: "bg", BFA: "fr", BDI: "fr",
  KHM: "km", CMR: "fr", CAN: "en", CAF: "fr", TCD: "fr", CHL: "es", CHN: "zh", COL: "es",
  COG: "fr", COD: "fr", CRI: "es", HRV: "hr", CUB: "es", CYP: "el", CZE: "cs", DNK: "da",
  DJI: "ar", DOM: "es", ECU: "es", EGY: "ar", SLV: "es", GNQ: "es", ERI: "ti", EST: "et",
  SWZ: "en", ETH: "am", FLK: "en", FJI: "en", FIN: "fi", FRA: "fr", GAB: "fr", GMB: "en",
  GEO: "ka", DEU: "de", GHA: "en", GRC: "el", GRL: "kl", GTM: "es", GIN: "fr", GNB: "pt",
  GUY: "en", HTI: "fr", HND: "es", HUN: "hu", ISL: "is", IND: "hi", IDN: "id", IRN: "fa",
  IRQ: "ar", IRL: "en", ISR: "he", ITA: "it", CIV: "fr", JAM: "en", JPN: "ja", JOR: "ar",
  KAZ: "kk", KEN: "sw", PRK: "ko", KOR: "ko", KWT: "ar", KGZ: "ky", LAO: "lo", LVA: "lv",
  LBN: "ar", LSO: "en", LBR: "en", LBY: "ar", LTU: "lt", LUX: "fr", MDG: "fr", MWI: "en",
  MYS: "ms", MLI: "fr", MRT: "ar", MEX: "es", MDA: "ro", MNG: "mn", MNE: "sr", MAR: "ar",
  MOZ: "pt", MMR: "my", NAM: "en", NPL: "ne", NLD: "nl", NCL: "fr", NZL: "en", NIC: "es",
  NER: "fr", NGA: "en", MKD: "mk", NOR: "no", OMN: "ar", PAK: "ur", PAN: "es", PNG: "en",
  PRY: "es", PER: "es", PHL: "fil", POL: "pl", PRT: "pt", PRI: "es", QAT: "ar", ROU: "ro",
  RUS: "ru", RWA: "sw", SAU: "ar", SEN: "fr", SRB: "sr", SLE: "en", SGP: "zh", SVK: "sk",
  SVN: "sl", SLB: "en", SOM: "so", ZAF: "en", SSD: "en", ESP: "es", LKA: "si", SDN: "ar",
  SUR: "nl", SWE: "sv", CHE: "de", SYR: "ar", TWN: "zh", TJK: "tg", TZA: "sw", THA: "th",
  TGO: "fr", TLS: "pt", TTO: "en", TUN: "ar", TUR: "tr", TKM: "tk", UGA: "sw", UKR: "uk", ARE: "ar",
  GBR: "en", USA: "en", URY: "es", UZB: "uz", VUT: "en", VEN: "es", VNM: "vi", ESH: "ar", YEM: "ar",
  ZMB: "en", ZWE: "en", PSE: "ar", XKX: "sq",
};

const FALLBACK: CountrySpeech = { locale: "en-US", lang: "en", language: "English" };

export function speechForCountry(iso3: string | null | undefined): CountrySpeech {
  if (!iso3) return FALLBACK;
  const key = ISO3_LANG[iso3] ?? "en";
  const row = LANG[key];
  if (!row) return FALLBACK;
  return { locale: row.locale, lang: key, language: row.language };
}

export function langTag(locale: string) {
  return locale.split("-")[0]?.toUpperCase() ?? "EN";
}
