import type { MetricId } from "./types";

export type KidsWord = {
  metricId: MetricId;
  word: string;
  plural: string;
  phonics: string;
  speak: string;
  image: string;
  hint: string;
  sentence: (country: string, spokenValue: string) => string;
};

export const KIDS_WORDS: Record<string, KidsWord> = {
  cattle: {
    metricId: "cattle",
    word: "Cow",
    plural: "cows",
    phonics: "kow",
    speak: "Cow",
    image: "/kids/pictures/cow.jpg",
    hint: "A farm animal that gives milk.",
    sentence: (c, v) => `${c} has ${v} cows.`,
  },
  chickens: {
    metricId: "chickens",
    word: "Chicken",
    plural: "chickens",
    phonics: "CHIK-en",
    speak: "Chicken",
    image: "/kids/pictures/chicken.jpg",
    hint: "A bird that lives on farms.",
    sentence: (c, v) => `${c} has ${v} chickens.`,
  },
  pigs: {
    metricId: "pigs",
    word: "Pig",
    plural: "pigs",
    phonics: "pig",
    speak: "Pig",
    image: "/kids/pictures/pig.jpg",
    hint: "A pink farm animal with a snout.",
    sentence: (c, v) => `${c} has ${v} pigs.`,
  },
  cereal: {
    metricId: "cereal",
    word: "Grain",
    plural: "grain",
    phonics: "grayn",
    speak: "Grain",
    image: "/kids/pictures/grain.jpg",
    hint: "Wheat and other seeds we grind for food.",
    sentence: (c, v) => `${c} grew ${v} tonnes of grain.`,
  },
  rice: {
    metricId: "rice",
    word: "Rice",
    plural: "rice",
    phonics: "rys",
    speak: "Rice",
    image: "/kids/pictures/rice.jpg",
    hint: "A grain that grows in wet fields.",
    sentence: (c, v) => `${c} grew ${v} tonnes of rice.`,
  },
  bananas: {
    metricId: "bananas",
    word: "Banana",
    plural: "bananas",
    phonics: "ba-NA-na",
    speak: "Banana",
    image: "/kids/pictures/banana.jpg",
    hint: "A yellow fruit that grows in bunches.",
    sentence: (c, v) => `${c} grew ${v} tonnes of bananas.`,
  },
  cocoa: {
    metricId: "cocoa",
    word: "Cocoa",
    plural: "cocoa",
    phonics: "KOH-koh",
    speak: "Cocoa",
    image: "/kids/pictures/cocoa.jpg",
    hint: "Beans that become chocolate.",
    sentence: (c, v) => `${c} grew ${v} tonnes of cocoa.`,
  },
  fish: {
    metricId: "fish",
    word: "Fish",
    plural: "fish",
    phonics: "fish",
    speak: "Fish",
    image: "/kids/pictures/fish.jpg",
    hint: "An animal that lives in water.",
    sentence: (c, v) => `${c} caught ${v} tonnes of wild fish.`,
  },
  farms: {
    metricId: "farms",
    word: "Farm",
    plural: "fish farms",
    phonics: "farm",
    speak: "Farm",
    image: "/kids/pictures/farm.jpg",
    hint: "A place where people grow food or fish.",
    sentence: (c, v) => `${c} grew ${v} tonnes of farmed fish.`,
  },
  forest: {
    metricId: "forest",
    word: "Tree",
    plural: "trees",
    phonics: "tree",
    speak: "Tree",
    image: "/kids/pictures/tree.jpg",
    hint: "A tall plant with a trunk and leaves.",
    sentence: (c, v) => `${c} is ${v} percent forest.`,
  },
  birds: {
    metricId: "birds",
    word: "Bird",
    plural: "birds",
    phonics: "burd",
    speak: "Bird",
    image: "/kids/pictures/bird.jpg",
    hint: "An animal with wings and feathers.",
    sentence: (c, v) => `${c} has ${v} special birds that live mainly there.`,
  },
  mammals: {
    metricId: "mammals",
    word: "Mammal",
    plural: "mammals",
    phonics: "MAM-ul",
    speak: "Mammal",
    image: "/kids/pictures/mammal.jpg",
    hint: "Animals like kangaroos, dogs, and people.",
    sentence: (c, v) => `${c} has ${v} special mammals that live mainly there.`,
  },
  frogs: {
    metricId: "frogs",
    word: "Frog",
    plural: "frogs",
    phonics: "frog",
    speak: "Frog",
    image: "/kids/pictures/frog.jpg",
    hint: "A jumping animal that likes wet places.",
    sentence: (c, v) => `${c} has ${v} special frogs that live mainly there.`,
  },
  pop: {
    metricId: "pop",
    word: "People",
    plural: "people",
    phonics: "PEE-pul",
    speak: "People",
    image: "/kids/pictures/people.jpg",
    hint: "Human beings. Kids, grown-ups, everyone.",
    sentence: (c, v) => `${c} has ${v} people.`,
  },
  life: {
    metricId: "life",
    word: "Years",
    plural: "years",
    phonics: "yeerz",
    speak: "Years",
    image: "/kids/pictures/years.jpg",
    hint: "How long something lasts.",
    sentence: (c, v) => `In ${c}, people live about ${v} years.`,
  },
};

export function kidsWordFor(id: MetricId): KidsWord | undefined {
  return KIDS_WORDS[id];
}

export function spokenAmount(value: number): string {
  const abs = Math.abs(value);
  const format = (n: number, unit: string) => {
    const digits = n >= 10 ? 0 : 1;
    const text = n.toFixed(digits).replace(/\.0$/, "");
    return `${text} ${unit}`;
  };
  if (abs >= 1e9) return format(value / 1e9, "billion");
  if (abs >= 1e6) return format(value / 1e6, "million");
  if (abs >= 1e3) return format(value / 1e3, "thousand");
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1).replace(/\.0$/, "");
}

export function countrySentence(
  metricId: MetricId,
  countryName: string,
  value: number | null | undefined,
  fallbackLabel: string,
): string {
  const card = kidsWordFor(metricId);
  if (value == null) {
    return `${countryName}. We do not have a number for ${card?.word ?? fallbackLabel}.`;
  }
  if (card) return card.sentence(countryName, spokenAmount(value));
  return `${countryName}. ${spokenAmount(value)} ${fallbackLabel}.`;
}
