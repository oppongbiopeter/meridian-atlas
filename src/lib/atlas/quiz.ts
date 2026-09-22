import { kidsWordFor, spokenAmount } from "./kids-words";
import { metricValue } from "./metrics";
import type { CountryRecord, MetricId, QuizDifficulty, Region } from "./types";

export type QuizQuestion = {
  id: string;
  prompt: string;
  speak: string;
  word: string;
  phonics: string;
  image: string;
  hint: string;
  fact: string;
  answerId: string;
  answerName: string;
  answerIso3: string;
  metricId?: MetricId;
  region: Region;
};

export type QuizLevel = {
  id: QuizDifficulty;
  label: string;
  blurb: string;
  questions: number;
  lives: number;
  showHint: boolean;
  showNames: boolean;
};

export const QUIZ_LEVELS: QuizLevel[] = [
  {
    id: "easy",
    label: "Easy",
    blurb: "Big countries. A hint. Country names on hover.",
    questions: 5,
    lives: 3,
    showHint: true,
    showNames: true,
  },
  {
    id: "medium",
    label: "Medium",
    blurb: "Spin farther. Continent hint only.",
    questions: 7,
    lives: 2,
    showHint: true,
    showNames: false,
  },
  {
    id: "hard",
    label: "Hard",
    blurb: "Smaller countries. No names. One miss.",
    questions: 8,
    lives: 1,
    showHint: false,
    showNames: false,
  },
];

const FIND: Array<{
  iso3: string;
  word: string;
  phonics: string;
  speak: string;
  image: string;
  hint: string;
  difficulty: QuizDifficulty;
}> = [
  { iso3: "BRA", word: "Brazil", phonics: "bra-ZIL", speak: "Brazil", image: "/kids/pictures/frog.jpg", hint: "A huge country in South America.", difficulty: "easy" },
  { iso3: "AUS", word: "Australia", phonics: "aw-STRAY-lee-uh", speak: "Australia", image: "/kids/pictures/mammal.jpg", hint: "The big island continent.", difficulty: "easy" },
  { iso3: "IND", word: "India", phonics: "IN-dee-uh", speak: "India", image: "/kids/pictures/people.jpg", hint: "A large triangle in South Asia.", difficulty: "easy" },
  { iso3: "USA", word: "United States", phonics: "you-NY-ted STATES", speak: "United States", image: "/kids/pictures/people.jpg", hint: "A wide country in North America.", difficulty: "easy" },
  { iso3: "EGY", word: "Egypt", phonics: "EE-jipt", speak: "Egypt", image: "/kids/pictures/years.jpg", hint: "In north Africa, along a long river.", difficulty: "easy" },
  { iso3: "CAN", word: "Canada", phonics: "KAN-uh-duh", speak: "Canada", image: "/kids/pictures/tree.jpg", hint: "The big country north of the United States.", difficulty: "easy" },
  { iso3: "JPN", word: "Japan", phonics: "juh-PAN", speak: "Japan", image: "/kids/pictures/fish.jpg", hint: "An island chain east of Asia.", difficulty: "medium" },
  { iso3: "MEX", word: "Mexico", phonics: "MEK-sih-koh", speak: "Mexico", image: "/kids/pictures/people.jpg", hint: "South of the United States.", difficulty: "medium" },
  { iso3: "KEN", word: "Kenya", phonics: "KEN-yuh", speak: "Kenya", image: "/kids/pictures/mammal.jpg", hint: "East Africa, on the equator.", difficulty: "medium" },
  { iso3: "MDG", word: "Madagascar", phonics: "mad-uh-GAS-kar", speak: "Madagascar", image: "/kids/pictures/frog.jpg", hint: "A long island off east Africa.", difficulty: "medium" },
  { iso3: "FRA", word: "France", phonics: "frans", speak: "France", image: "/kids/pictures/farm.jpg", hint: "Western Europe, hexagon-shaped.", difficulty: "medium" },
  { iso3: "IDN", word: "Indonesia", phonics: "in-doh-NEE-zhuh", speak: "Indonesia", image: "/kids/pictures/bird.jpg", hint: "Many islands between Asia and Australia.", difficulty: "medium" },
  { iso3: "ECU", word: "Ecuador", phonics: "EK-wuh-dor", speak: "Ecuador", image: "/kids/pictures/banana.jpg", hint: "South America, on the equator.", difficulty: "hard" },
  { iso3: "BGD", word: "Bangladesh", phonics: "bang-luh-DESH", speak: "Bangladesh", image: "/kids/pictures/rice.jpg", hint: "A crowded country next to India.", difficulty: "hard" },
  { iso3: "GAB", word: "Gabon", phonics: "gah-BON", speak: "Gabon", image: "/kids/pictures/tree.jpg", hint: "Central Africa, on the Atlantic.", difficulty: "hard" },
  { iso3: "SUR", word: "Suriname", phonics: "SUR-ih-nahm", speak: "Suriname", image: "/kids/pictures/tree.jpg", hint: "A small country on the north of South America.", difficulty: "hard" },
  { iso3: "PHL", word: "Philippines", phonics: "FIL-uh-peenz", speak: "Philippines", image: "/kids/pictures/bird.jpg", hint: "Islands in Southeast Asia.", difficulty: "hard" },
  { iso3: "CIV", word: "Ivory Coast", phonics: "EYE-vree coast", speak: "Ivory Coast", image: "/kids/pictures/cocoa.jpg", hint: "West Africa, on the ocean.", difficulty: "hard" },
];

const METRIC_PROMPTS: Array<{
  metric: MetricId;
  difficulty: QuizDifficulty;
  prompt: (name: string) => string;
  speak: (name: string) => string;
}> = [
  { metric: "bananas", difficulty: "easy", prompt: () => "Spin the globe. Who grows the most bananas?", speak: () => "Who grows the most bananas?" },
  { metric: "cattle", difficulty: "easy", prompt: () => "Who has the most cows?", speak: () => "Who has the most cows?" },
  { metric: "pop", difficulty: "easy", prompt: () => "Which country has the most people?", speak: () => "Which country has the most people?" },
  { metric: "frogs", difficulty: "easy", prompt: () => "Who has the most special frogs?", speak: () => "Who has the most special frogs?" },
  { metric: "chickens", difficulty: "medium", prompt: () => "Who has the most chickens on farms?", speak: () => "Who has the most chickens?" },
  { metric: "rice", difficulty: "medium", prompt: () => "Who grows the most rice?", speak: () => "Who grows the most rice?" },
  { metric: "birds", difficulty: "medium", prompt: () => "Who has the most special birds?", speak: () => "Who has the most special birds?" },
  { metric: "cocoa", difficulty: "medium", prompt: () => "Who grows the most cocoa for chocolate?", speak: () => "Who grows the most cocoa?" },
  { metric: "mammals", difficulty: "hard", prompt: () => "Who has the most special mammals?", speak: () => "Who has the most special mammals?" },
  { metric: "fish", difficulty: "hard", prompt: () => "Who catches the most wild fish?", speak: () => "Who catches the most wild fish?" },
  { metric: "pigs", difficulty: "hard", prompt: () => "Who has the most pigs?", speak: () => "Who has the most pigs?" },
  { metric: "forest", difficulty: "hard", prompt: () => "Which country is covered most in forest?", speak: () => "Which country is covered most in forest?" },
];

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = next[i];
    const b = next[j];
    if (a === undefined || b === undefined) continue;
    next[i] = b;
    next[j] = a;
  }
  return next;
}

function byIso3(countries: CountryRecord[], iso3: string) {
  return countries.find((c) => c.iso3 === iso3);
}

function topByMetric(countries: CountryRecord[], metric: MetricId) {
  let best: CountryRecord | null = null;
  let score = -Infinity;
  for (const country of countries) {
    const value = metricValue(country, metric);
    if (value == null || value <= 0) continue;
    if (value > score) {
      best = country;
      score = value;
    }
  }
  return best ? { country: best, value: score } : null;
}

function findQuestion(row: (typeof FIND)[number], country: CountryRecord): QuizQuestion {
  return {
    id: `find-${row.iso3}`,
    prompt: `Find ${row.word} on the globe.`,
    speak: `Find ${row.speak}. Spin the globe and tap it.`,
    word: row.word,
    phonics: row.phonics,
    image: row.image,
    hint: row.hint,
    fact: `${row.word} is in ${country.region}.`,
    answerId: country.id,
    answerName: country.name,
    answerIso3: country.iso3,
    region: country.region,
  };
}

function metricQuestion(
  spec: (typeof METRIC_PROMPTS)[number],
  country: CountryRecord,
  value: number,
): QuizQuestion | null {
  const word = kidsWordFor(spec.metric);
  if (!word) return null;
  const amount = spokenAmount(value);
  return {
    id: `metric-${spec.metric}`,
    prompt: spec.prompt(country.name),
    speak: `${spec.speak(country.name)} Look at the picture, then find the country.`,
    word: word.word,
    phonics: word.phonics,
    image: word.image,
    hint: `${word.hint} Look in ${country.region}.`,
    fact: word.sentence(country.name, amount),
    answerId: country.id,
    answerName: country.name,
    answerIso3: country.iso3,
    metricId: spec.metric,
    region: country.region,
  };
}

export function quizLevel(id: QuizDifficulty): QuizLevel {
  return QUIZ_LEVELS.find((level) => level.id === id) ?? {
    id: "easy",
    label: "Easy",
    blurb: "Big countries.",
    questions: 5,
    lives: 3,
    showHint: true,
    showNames: true,
  };
}

export function buildQuizRound(countries: CountryRecord[], difficulty: QuizDifficulty): QuizQuestion[] {
  const level = quizLevel(difficulty);
  const allowed: QuizDifficulty[] =
    difficulty === "easy" ? ["easy"] : difficulty === "medium" ? ["easy", "medium"] : ["easy", "medium", "hard"];

  const finds = shuffle(
    FIND.filter((row) => allowed.includes(row.difficulty))
      .map((row) => {
        const country = byIso3(countries, row.iso3);
        return country ? findQuestion(row, country) : null;
      })
      .filter((q): q is QuizQuestion => q != null),
  );

  const metrics = shuffle(
    METRIC_PROMPTS.filter((row) => allowed.includes(row.difficulty))
      .map((row) => {
        const top = topByMetric(countries, row.metric);
        return top ? metricQuestion(row, top.country, top.value) : null;
      })
      .filter((q): q is QuizQuestion => q != null),
  );

  const mixed = shuffle([...finds.slice(0, Math.ceil(level.questions / 2)), ...metrics]);
  const unique: QuizQuestion[] = [];
  const seen = new Set<string>();
  for (const question of mixed) {
    if (seen.has(question.id) || seen.has(question.answerId + question.word)) continue;
    seen.add(question.id);
    seen.add(question.answerId + question.word);
    unique.push(question);
    if (unique.length >= level.questions) break;
  }
  return unique;
}
