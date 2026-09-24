import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Lock, Volume2, X } from "lucide-react";
import { WorldMap } from "@/components/atlas/world-map";
import { Button } from "@/components/ui/button";
import { speak } from "@/lib/atlas/speak";
import { cn } from "@/lib/utils";

type Place = { id: string; name: string; region?: string };

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const COUNTABLES = [
  { noun: "chickens", word: "chicken", src: "/kids/pictures/chicken.jpg" },
  { noun: "cows", word: "cow", src: "/kids/pictures/cow.jpg" },
  { noun: "fish", word: "fish", src: "/kids/pictures/fish.jpg" },
  { noun: "bananas", word: "banana", src: "/kids/pictures/banana.jpg" },
  { noun: "frogs", word: "frog", src: "/kids/pictures/frog.jpg" },
  { noun: "birds", word: "bird", src: "/kids/pictures/bird.jpg" },
  { noun: "pigs", word: "pig", src: "/kids/pictures/pig.jpg" },
  { noun: "trees", word: "tree", src: "/kids/pictures/tree.jpg" },
];

const PLUS_ANIMALS = [
  { noun: "dogs", word: "dog", src: "/kids/pictures/dog.jpg" },
  { noun: "cats", word: "cat", src: "/kids/pictures/cat.jpg" },
  { noun: "horses", word: "horse", src: "/kids/pictures/horse.jpg" },
  { noun: "sheep", word: "sheep", src: "/kids/pictures/sheep.jpg" },
  { noun: "ducks", word: "duck", src: "/kids/pictures/duck.jpg" },
  { noun: "elephants", word: "elephant", src: "/kids/pictures/elephant.jpg" },
  { noun: "whales", word: "whale", src: "/kids/pictures/whale.jpg" },
  { noun: "butterflies", word: "butterfly", src: "/kids/pictures/butterfly.jpg" },
];

type PictureWord = { word: string; src: string; plus?: boolean };

const SAY_ITEMS: PictureWord[] = [
  ...COUNTABLES.map((item) => ({ word: item.word, src: item.src })),
  { word: "cocoa", src: "/kids/pictures/cocoa.jpg" },
  { word: "rice", src: "/kids/pictures/rice.jpg" },
  { word: "farm", src: "/kids/pictures/farm.jpg" },
  { word: "people", src: "/kids/pictures/people.jpg" },
  { word: "forest", src: "/kids/pictures/tree.jpg" },
  ...PLUS_ANIMALS.map((item) => ({ word: item.word, src: item.src, plus: true })),
];

const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const ALPHABETS = [
  { id: "en", label: "English", locale: "en-US", letters: LATIN },
  { id: "es", label: "Spanish", locale: "es-ES", letters: [...LATIN, "Ñ"] },
  { id: "fr", label: "French", locale: "fr-FR", letters: LATIN },
  { id: "pt", label: "Portuguese", locale: "pt-BR", letters: LATIN },
  { id: "de", label: "German", locale: "de-DE", letters: [...LATIN, "Ä", "Ö", "Ü"] },
  { id: "it", label: "Italian", locale: "it-IT", letters: LATIN },
  { id: "sw", label: "Swahili", locale: "sw-KE", letters: LATIN },
  { id: "ru", label: "Russian", locale: "ru-RU", letters: "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split("") },
  { id: "ar", label: "Arabic", locale: "ar-SA", letters: "ابتثجحخدذرزسشصضطظعغفقكلمنهوي".split("") },
  { id: "hi", label: "Hindi", locale: "hi-IN", letters: "अआइईउऊएऐओऔकखगघचछजझटठडढतथदधनपफबभमयरलवशसह".split("") },
];

const SHOWS = [
  { id: "288", name: "Ghana", prompt: "This country grows a lot of the world’s cocoa. Find it on the globe." },
  { id: "076", name: "Brazil", prompt: "Jaguars live in the Amazon here. Find the country that holds most of that forest." },
  { id: "156", name: "China", prompt: "Wild giant pandas live only in this country’s mountains. Find it." },
  { id: "036", name: "Australia", prompt: "Kangaroos hop here, on a country that is also its own continent. Find it." },
  { id: "404", name: "Kenya", prompt: "The equator crosses this country, and lions roam its savanna. Find it." },
  { id: "818", name: "Egypt", prompt: "The Great Pyramid stands beside the Nile in this country. Find it." },
  { id: "392", name: "Japan", prompt: "Mount Fuji rises on this island country. Find it." },
  { id: "356", name: "India", prompt: "Bengal tigers live here, and this country grows more bananas than any other. Find it." },
  { id: "250", name: "France", prompt: "The Eiffel Tower stands in Paris, in this country. Find it." },
  { id: "484", name: "Mexico", prompt: "Corn was first grown in this country. Find it." },
  { id: "124", name: "Canada", prompt: "Polar bears live in the north of this country, which has the longest coastline. Find it." },
  { id: "710", name: "South Africa", prompt: "Penguins nest near the Cape in this country. Find it." },
  { id: "450", name: "Madagascar", prompt: "Lemurs live almost nowhere else but this island. Find it." },
  { id: "604", name: "Peru", prompt: "Machu Picchu sits in the mountains of this country. Find it." },
  { id: "554", name: "New Zealand", prompt: "The kiwi bird lives on these islands. Find the country." },
  { id: "380", name: "Italy", prompt: "This country is shaped like a boot. Ancient Rome is here. Find it." },
  { id: "578", name: "Norway", prompt: "Deep sea fjords cut the coast of this country. Find it." },
  { id: "352", name: "Iceland", prompt: "Hot springs and volcanoes cover this island country. Find it." },
  { id: "724", name: "Spain", prompt: "This country touches both the Atlantic Ocean and the Mediterranean Sea. Find it." },
];

type SeekStart = { countryId: string; name: string; prompt: string };
type SeekReport = { id: string; ok: boolean; nonce: number } | null;

function pick<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)]!;
}

function shuffle<T>(list: T[]): T[] {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j]!, next[i]!];
  }
  return next;
}

export function KidsStudio({
  countries,
  plus,
  parked,
  seekReport,
  onClose,
  onUnlock,
  onSeek,
}: {
  countries: Place[];
  plus: boolean;
  parked: boolean;
  seekReport: SeekReport;
  onClose: () => void;
  onUnlock: () => void;
  onSeek: (round: SeekStart) => void;
}) {
  const [tab, setTab] = useState<"learn" | "games">("learn");

  return (
    <div className={cn("fixed inset-0 z-40 flex flex-col bg-background", parked && "hidden")}>
      <header className="flex items-center gap-2 border-b border-border px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">Kids</p>
          <h2 className="font-display text-lg font-medium tracking-tight">Learn and play</h2>
        </div>
        <div className="flex gap-1">
          <Button type="button" size="sm" variant={tab === "learn" ? "default" : "secondary"} onClick={() => setTab("learn")}>
            Learn
          </Button>
          <Button type="button" size="sm" variant={tab === "games" ? "default" : "secondary"} onClick={() => setTab("games")}>
            Games
          </Button>
        </div>
        <Button type="button" size="icon-sm" variant="ghost" aria-label="Close studio" onClick={onClose}>
          <X />
        </Button>
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        {tab === "learn" ? (
          <LearnDesk plus={plus} onUnlock={onUnlock} />
        ) : (
          <GameHub countries={countries} plus={plus} onUnlock={onUnlock} onSeek={onSeek} seekReport={seekReport} />
        )}
      </div>
    </div>
  );
}

function LearnDesk({ plus, onUnlock }: { plus: boolean; onUnlock: () => void }) {
  const [mode, setMode] = useState<"letters" | "numbers" | "say" | "write">("letters");
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["letters", "Letters"],
            ["numbers", "Numbers"],
            ["say", "Say it"],
            ["write", "Write"],
          ] as const
        ).map(([id, label]) => (
          <Button key={id} type="button" size="sm" variant={mode === id ? "default" : "secondary"} onClick={() => setMode(id)}>
            {label}
          </Button>
        ))}
      </div>
      {mode === "letters" ? <LetterLesson /> : null}
      {mode === "numbers" ? <NumberLesson plus={plus} onUnlock={onUnlock} /> : null}
      {mode === "say" ? <SayLesson plus={plus} onUnlock={onUnlock} /> : null}
      {mode === "write" ? <WriteLesson plus={plus} onUnlock={onUnlock} /> : null}
    </div>
  );
}

function LetterLesson() {
  const [scriptId, setScriptId] = useState(ALPHABETS[0]!.id);
  const script = ALPHABETS.find((item) => item.id === scriptId) ?? ALPHABETS[0]!;
  const [letter, setLetter] = useState(script.letters[0]!);

  const chooseScript = (id: string) => {
    const next = ALPHABETS.find((item) => item.id === id) ?? ALPHABETS[0]!;
    setScriptId(next.id);
    const first = next.letters[0]!;
    setLetter(first);
    speak(first, 0.7, next.locale);
  };

  return (
    <div className="grid gap-4 md:grid-cols-[auto_1fr]">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Choose a language, then a letter.</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {ALPHABETS.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant={item.id === script.id ? "default" : "secondary"}
              onClick={() => chooseScript(item.id)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 sm:grid-cols-9">
          {script.letters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setLetter(item);
                speak(item, 0.7, script.locale);
              }}
              className={cn(
                "h-11 rounded-lg text-sm font-medium",
                item === letter ? "bg-primary text-primary-foreground" : "bg-secondary",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="font-display text-5xl font-medium tracking-tight">{letter}</p>
        <p className="mt-1 text-sm text-muted-foreground">{script.label}. Hear the letter, then trace it.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={() => speak(letter, 0.7, script.locale)}>
            <Volume2 className="size-3.5" />
            Hear it
          </Button>
        </div>
        <TracePad glyph={letter} label={`Trace the letter ${letter}`} />
      </div>
    </div>
  );
}

function PlusNote({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div className="mt-3 rounded-2xl bg-secondary p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Lock className="size-4" />
        <p className="text-2xs font-medium tracking-caps uppercase">Meridian Plus</p>
      </div>
      <p className="mt-2 text-sm leading-relaxed">
        Extra animals and numbers past 10 are Plus. This demo unlocks them on this device. Kids mode still hides grown-up statistics.
      </p>
      <Button type="button" className="mt-3" onClick={onUnlock}>
        Unlock Plus (demo)
      </Button>
    </div>
  );
}

function NumberLesson({ plus, onUnlock }: { plus: boolean; onUnlock: () => void }) {
  const animals = plus ? [...COUNTABLES, ...PLUS_ANIMALS] : COUNTABLES;
  const [n, setN] = useState(3);
  const [item, setItem] = useState(animals[0]!);
  const [locked, setLocked] = useState(false);
  const max = plus ? 20 : 10;

  return (
    <div>
      <p className="font-display text-6xl font-medium tabular-nums">{n}</p>
      <div className="mt-3 flex flex-wrap gap-2" aria-label={`${n} ${item.noun}`}>
        {n === 0 ? (
          <p className="text-sm text-muted-foreground">Zero means none.</p>
        ) : (
          Array.from({ length: n }, (_, i) => (
            <img key={i} src={item.src} alt="" className={n > 10 ? "size-10 rounded-lg object-cover" : "size-14 rounded-xl object-cover sm:size-16"} />
          ))
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Count the {item.noun}, then say the number. Trace it below.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {Array.from({ length: 21 }, (_, i) => {
          const blocked = i > max;
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                if (blocked) {
                  setLocked(true);
                  return;
                }
                setLocked(false);
                setN(i);
                speak(String(i), 0.75);
              }}
              className={cn(
                "h-11 w-11 rounded-lg text-sm font-medium tabular-nums",
                i === n ? "bg-primary text-primary-foreground" : "bg-secondary",
                blocked && "opacity-45",
              )}
            >
              {i}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {animals.map((next) => (
          <button
            key={next.noun}
            type="button"
            onClick={() => {
              setLocked(false);
              setItem(next);
              speak(next.noun, 0.8);
            }}
            className={cn("overflow-hidden rounded-xl", next.noun === item.noun ? "ring-2 ring-primary" : "")}
          >
            <img src={next.src} alt={next.noun} className="size-12 object-cover" />
          </button>
        ))}
        {PLUS_ANIMALS.map((next) =>
          plus ? null : (
            <button
              key={next.noun}
              type="button"
              onClick={() => setLocked(true)}
              className="relative overflow-hidden rounded-xl opacity-60"
            >
              <img src={next.src} alt="" className="size-12 object-cover" />
              <Lock className="absolute right-1 bottom-1 size-3.5" />
            </button>
          ),
        )}
      </div>
      {locked ? <PlusNote onUnlock={onUnlock} /> : null}
      <TracePad glyph={String(n)} label={`Trace the number ${n}`} />
    </div>
  );
}

function listenForWord(onText: (text: string) => void, onFail: (message: string) => void) {
  const host = window as unknown as {
    SpeechRecognition?: new () => Listener;
    webkitSpeechRecognition?: new () => Listener;
  };
  type Listener = {
    lang: string;
    interimResults: boolean;
    start: () => void;
    onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
    onerror: ((event: { error?: string }) => void) | null;
  };
  const Ctor = host.SpeechRecognition || host.webkitSpeechRecognition;
  if (!Ctor) {
    onFail("This browser cannot hear you yet. Say the word out loud anyway.");
    return;
  }
  const run = () => {
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (event) => onText(event.results[0]?.[0]?.transcript ?? "");
    rec.onerror = (event) => {
      onFail(event.error === "not-allowed" ? "Allow the microphone, then tap the big button again." : "I could not hear that. Try again.");
    };
    rec.start();
  };
  if (!navigator.mediaDevices?.getUserMedia) {
    run();
    return;
  }
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      stream.getTracks().forEach((track) => track.stop());
      run();
    })
    .catch(() => onFail("Allow the microphone so I can hear you."));
}

function SayLesson({ plus, onUnlock }: { plus: boolean; onUnlock: () => void }) {
  const [word, setWord] = useState(SAY_ITEMS[0]!.word);
  const [heard, setHeard] = useState<string | null>(null);
  const [note, setNote] = useState("Touch a picture. Hear it, then say it.");
  const [listening, setListening] = useState(false);
  const [locked, setLocked] = useState(false);
  const current = SAY_ITEMS.find((item) => item.word === word) ?? SAY_ITEMS[0]!;

  const choose = (item: PictureWord) => {
    if (item.plus && !plus) {
      setLocked(true);
      return;
    }
    setLocked(false);
    setWord(item.word);
    setHeard(null);
    setNote("Touch a picture. Hear it, then say it.");
    speak(item.word, 0.72);
  };

  const listen = () => {
    setListening(true);
    setNote("Listening… say it now.");
    listenForWord(
      (said) => {
        setListening(false);
        setHeard(said);
        const ok = said.toLowerCase().includes(current.word.toLowerCase());
        setNote(ok ? "Yes. That sounded right." : `I heard “${said}”. Try again.`);
        speak(ok ? "Yes." : "Try again.", 0.85);
      },
      (message) => {
        setListening(false);
        setNote(message);
      },
    );
  };

  return (
    <div>
      <img src={current.src} alt="" className="size-36 rounded-2xl object-cover" />
      <p className="font-display mt-3 text-4xl font-medium tracking-tight">{current.word}</p>
      <p className="mt-2 text-sm text-muted-foreground">{note}</p>
      {heard ? <p className="mt-1 text-xs text-muted-foreground">Heard: {heard}</p> : null}
      <button
        type="button"
        onClick={listen}
        className="mt-4 flex min-h-24 w-full items-center justify-center gap-3 rounded-3xl bg-primary px-4 text-xl font-medium text-primary-foreground"
      >
        <Volume2 className="size-7" />
        {listening ? "Listening…" : "I will say it"}
      </button>
      <Button type="button" size="sm" variant="secondary" className="mt-3" onClick={() => speak(current.word, 0.72)}>
        <Volume2 className="size-3.5" />
        Hear it
      </Button>
      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
        {SAY_ITEMS.map((item) => {
          const blocked = Boolean(item.plus && !plus);
          return (
            <button
              key={item.word}
              type="button"
              onClick={() => choose(item)}
              className={cn(
                "relative overflow-hidden rounded-xl",
                item.word === current.word && !blocked ? "ring-2 ring-primary" : "",
                blocked && "opacity-55",
              )}
            >
              <img src={item.src} alt={blocked ? "" : item.word} className="aspect-square w-full object-cover" />
              {blocked ? <Lock className="absolute right-1 bottom-1 size-3.5" /> : null}
            </button>
          );
        })}
      </div>
      {locked ? <PlusNote onUnlock={onUnlock} /> : null}
    </div>
  );
}

function WriteLesson({ plus, onUnlock }: { plus: boolean; onUnlock: () => void }) {
  const pool = SAY_ITEMS.filter((item) => plus || !item.plus);
  const [item, setItem] = useState(pool[0]!);
  const [typed, setTyped] = useState("");
  const [note, setNote] = useState("Look at the picture. Trace the word, or type it.");
  const [pad, setPad] = useState(0);
  const [locked, setLocked] = useState(false);
  const done = typed.trim().toLowerCase() === item.word;

  return (
    <div>
      <img src={item.src} alt="" className="size-28 rounded-2xl object-cover" />
      <p className="mt-3 text-sm text-muted-foreground">{done ? `Yes. ${item.word}.` : note}</p>
      <TracePad key={`${item.word}-${pad}`} glyph={item.word} label={`Trace the word ${item.word}`} />
      <div className="mt-2 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={() => setPad((n) => n + 1)}>
          Clear pad
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => speak(item.word, 0.72)}>
          <Volume2 className="size-3.5" />
          Hear a hint
        </Button>
      </div>
      <input
        value={typed}
        onChange={(event) => {
          const next = event.target.value;
          setTyped(next);
          if (next.trim().toLowerCase() === item.word) {
            setNote(`Yes. ${item.word}.`);
            speak(`Yes. ${item.word}.`, 0.8);
          }
        }}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Type the word"
        placeholder="Or type the word"
        className="mt-3 h-12 w-full max-w-xs rounded-xl border border-border bg-secondary px-3 text-lg outline-none"
      />
      <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">
        {SAY_ITEMS.map((next) => {
          const blocked = Boolean(next.plus && !plus);
          return (
            <button
              key={next.word}
              type="button"
              onClick={() => {
                if (blocked) {
                  setLocked(true);
                  return;
                }
                setLocked(false);
                setItem(next);
                setTyped("");
                setNote("Look at the picture. Trace the word, or type it.");
              }}
              className={cn(
                "relative overflow-hidden rounded-xl",
                next.word === item.word && !blocked ? "ring-2 ring-primary" : "",
                blocked && "opacity-55",
              )}
            >
              <img src={next.src} alt="" className="aspect-square w-full object-cover" />
              {blocked ? <Lock className="absolute right-1 bottom-1 size-3.5" /> : null}
            </button>
          );
        })}
      </div>
      {locked ? <PlusNote onUnlock={onUnlock} /> : null}
    </div>
  );
}

function TracePad({ glyph, label }: { glyph: string; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [wrote, setWrote] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#12151a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(236,239,243,0.18)";
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
    ctx.fillStyle = "rgba(236,239,243,0.12)";
    const size = glyph.length > 8 ? 42 : glyph.length > 2 ? 72 : 120;
    ctx.font = `${size}px Fraunces, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(glyph, canvas.width / 2, canvas.height / 2 + 8);
    setWrote(false);
  }, [glyph]);

  const paint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.fillStyle = "#f0c14a";
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    setWrote(true);
  };

  const point = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * event.currentTarget.width;
    const y = ((event.clientY - box.top) / box.height) * event.currentTarget.height;
    return { x, y };
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={480}
        height={220}
        className="mt-3 h-40 w-full touch-none rounded-2xl"
        aria-label={label}
        onPointerDown={(event) => {
          drawing.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          const p = point(event);
          paint(p.x, p.y);
        }}
        onPointerMove={(event) => {
          if (!drawing.current) return;
          const p = point(event);
          paint(p.x, p.y);
        }}
        onPointerUp={() => {
          drawing.current = false;
        }}
      />
      <p className="mt-2 text-xs text-muted-foreground">
        {wrote ? "Nice writing. Say it out loud." : "Drag on the card to write it."}
      </p>
    </div>
  );
}

type GameId = "show" | "find" | "hangman" | "count" | "memory" | "scramble";

function GameHub({
  countries,
  plus,
  onUnlock,
  onSeek,
  seekReport,
}: {
  countries: Place[];
  plus: boolean;
  onUnlock: () => void;
  onSeek: (round: SeekStart) => void;
  seekReport: SeekReport;
}) {
  const [game, setGame] = useState<GameId>("show");
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["show", "Show and tell"],
            ["find", "Find it"],
            ["hangman", "Hangman"],
            ["count", "Count"],
            ["memory", "Memory"],
            ["scramble", "Unscramble"],
          ] as const
        ).map(([id, label]) => (
          <Button key={id} type="button" size="sm" variant={game === id ? "default" : "secondary"} onClick={() => setGame(id)}>
            {label}
          </Button>
        ))}
      </div>
      {game === "show" ? <ShowTell countries={countries} onSeek={onSeek} seekReport={seekReport} /> : null}
      {game === "find" ? <FindGame countries={countries} /> : null}
      {game === "hangman" ? <HangmanGame countries={countries} /> : null}
      {game === "count" ? <CountGame plus={plus} onUnlock={onUnlock} /> : null}
      {game === "memory" ? <MemoryGame /> : null}
      {game === "scramble" ? <ScrambleGame countries={countries} /> : null}
    </div>
  );
}

function ShowTell({
  countries,
  onSeek,
  seekReport,
}: {
  countries: Place[];
  onSeek: (round: SeekStart) => void;
  seekReport: SeekReport;
}) {
  const cards = useMemo(
    () => SHOWS.filter((card) => countries.some((country) => country.id === card.id)),
    [countries],
  );
  const [index, setIndex] = useState(0);
  const card = cards[index % Math.max(cards.length, 1)];
  if (!card) return <p className="text-sm text-muted-foreground">No countries to show yet.</p>;
  const report = seekReport && seekReport.id === card.id ? seekReport : null;

  return (
    <div>
      <p className="font-display text-2xl font-medium tracking-tight">Show and tell</p>
      <p className="mt-2 text-base leading-relaxed">{card.prompt}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {report
          ? report.ok
            ? `Yes. That is ${card.name}.`
            : `It was ${card.name}.`
          : "The map opens. You get 3 tries. Then you come back here."}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={() => speak(card.prompt, 0.86)}>
          <Volume2 className="size-3.5" />
          Hear it
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => onSeek({ countryId: card.id, name: card.name, prompt: card.prompt })}
        >
          Go find it
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => setIndex((n) => n + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}

function FindGame({ countries }: { countries: Place[] }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [note, setNote] = useState("Spin the globe, then tap the country.");
  const [flash, setFlash] = useState<string | null>(null);
  const lock = useRef(false);
  const rosterKey = countries.map((country) => country.id).join("|");
  const target = useMemo(() => pick(countries), [rosterKey, round]);

  useEffect(() => {
    lock.current = false;
    setFlash(null);
    setNote(`Spin the globe. Tap ${target.name}.`);
    speak(`Spin the globe and find ${target.name}`, 0.85);
  }, [round, target.name]);

  return (
    <div>
      <p className="font-display text-2xl font-medium tracking-tight">Find {target.name}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Score {score}. {note}
      </p>
      <div className="relative mt-3 h-80 overflow-hidden rounded-2xl border border-border bg-ocean sm:h-96">
        <WorldMap
          view="globe"
          mode="kids"
          autoFocus={false}
          selectedId={flash}
          hoveredId={null}
          fillOf={(id) => {
            if (id === flash && flash === target.id) return "#fde047";
            if (id === flash) return "#fb7185";
            return "#60a5fa";
          }}
          onHover={() => {}}
          onSelect={(id) => {
            if (!id || lock.current) return;
            const name = countries.find((country) => country.id === id)?.name;
            if (id === target.id) {
              lock.current = true;
              setFlash(id);
              setScore((n) => n + 1);
              setNote(`Yes. That is ${target.name}.`);
              speak(`Yes. ${target.name}.`, 0.86);
              window.setTimeout(() => setRound((n) => n + 1), 900);
              return;
            }
            setFlash(id);
            setNote(name ? `That is ${name}. Keep spinning.` : "Not that one. Keep spinning.");
            speak("Not that one.", 0.9);
          }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={() => speak(`Find ${target.name}`, 0.85)}>
          <Volume2 className="size-3.5" />
          Hear the country
        </Button>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            const hint = target.region ? `${target.name} is in ${target.region}.` : `Look for ${target.name}.`;
            setNote(hint);
            speak(hint, 0.85);
          }}
        >
          Hint
        </Button>
      </div>
    </div>
  );
}

function HangmanSketch({ misses, lost }: { misses: number; lost: boolean }) {
  const show = (step: number) => misses >= step;
  return (
    <svg viewBox="0 0 220 230" className="mx-auto h-52 w-full max-w-xs text-foreground" aria-hidden>
      <path d="M18 214 H202" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
      {show(1) ? (
        <path d="M54 214 V36 H150" fill="none" stroke="#c4a574" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      ) : null}
      {show(2) ? <path d="M150 36 V58" stroke="#c4a574" strokeWidth="4" strokeLinecap="round" /> : null}
      {show(2) ? (
        <g>
          <circle cx="150" cy="82" r="22" fill="#fde047" stroke="#1a1440" strokeWidth="3" />
          {lost ? (
            <>
              <path d="M140 76 L148 84 M148 76 L140 84" stroke="#1a1440" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M152 76 L160 84 M160 76 L152 84" stroke="#1a1440" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M140 96 Q150 88 160 96" fill="none" stroke="#1a1440" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="142" cy="80" r="2.5" fill="#1a1440" />
              <circle cx="158" cy="80" r="2.5" fill="#1a1440" />
              <path d="M142 92 Q150 100 158 92" fill="none" stroke="#1a1440" strokeWidth="2.5" strokeLinecap="round" />
            </>
          )}
        </g>
      ) : null}
      {show(3) ? <path d="M150 104 V156" stroke="#60a5fa" strokeWidth="8" strokeLinecap="round" /> : null}
      {show(4) ? <path d="M150 118 L122 140" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" /> : null}
      {show(5) ? <path d="M150 118 L178 140" stroke="#60a5fa" strokeWidth="6" strokeLinecap="round" /> : null}
      {show(6) ? (
        <>
          <path d="M150 154 L126 190" stroke="#1a1440" strokeWidth="6" strokeLinecap="round" />
          <path d="M150 154 L174 190" stroke="#1a1440" strokeWidth="6" strokeLinecap="round" />
        </>
      ) : null}
    </svg>
  );
}

function HangmanGame({ countries }: { countries: Place[] }) {
  const words = useMemo(
    () => countries.map((c) => c.name.toUpperCase()).filter((name) => /^[A-Z ]+$/.test(name) && name.length <= 14),
    [countries],
  );
  const [word, setWord] = useState(() => pick(words.length ? words : ["GHANA"]));
  const [guessed, setGuessed] = useState<string[]>([]);
  const misses = guessed.filter((letter) => !word.includes(letter));
  const won = word.split("").every((ch) => ch === " " || guessed.includes(ch));
  const lost = misses.length >= 6;

  const guess = (letter: string) => {
    if (won || lost || guessed.includes(letter)) return;
    const next = [...guessed, letter];
    setGuessed(next);
    const done = word.split("").every((ch) => ch === " " || next.includes(ch));
    if (done) speak(word.toLowerCase(), 0.8);
  };

  return (
    <div>
      <HangmanSketch misses={misses.length} lost={lost} />
      <p className="text-center text-sm text-muted-foreground">
        A country name. {lost ? "Game over." : `${6 - misses.length} misses left.`}
      </p>
      <p className="font-display mt-3 text-center text-3xl tracking-[0.2em]">
        {word.split("").map((ch, i) => (
          <span key={`${ch}-${i}`} className="inline-block min-w-6 text-center">
            {ch === " " ? "\u00a0" : guessed.includes(ch) || lost ? ch : "_"}
          </span>
        ))}
      </p>
      {won ? <p className="mt-2 text-center text-sm">You found it.</p> : null}
      {lost ? <p className="mt-2 text-center text-sm">It was {word}.</p> : null}
      <div className="mt-4 grid grid-cols-7 gap-1 sm:grid-cols-9">
        {LETTERS.map((letter) => (
          <button
            key={letter}
            type="button"
            disabled={guessed.includes(letter) || won || lost}
            onClick={() => guess(letter)}
            className="h-11 rounded-lg bg-secondary text-sm font-medium disabled:opacity-30"
          >
            {letter}
          </button>
        ))}
      </div>
      <Button
        type="button"
        size="sm"
        className="mt-3"
        variant="secondary"
        onClick={() => {
          setWord(pick(words.length ? words : ["GHANA"]));
          setGuessed([]);
        }}
      >
        New word
      </Button>
    </div>
  );
}

function CountGame({ plus, onUnlock }: { plus: boolean; onUnlock: () => void }) {
  const pool = plus ? [...COUNTABLES, ...PLUS_ANIMALS] : COUNTABLES;
  const cap = plus ? 12 : 8;
  const [n, setN] = useState(() => 1 + Math.floor(Math.random() * 8));
  const [item, setItem] = useState(() => pick(pool));
  const [note, setNote] = useState<string | null>(null);
  const choices = useMemo(
    () => shuffle([n, ...shuffle(Array.from({ length: cap }, (_, i) => i + 1).filter((x) => x !== n)).slice(0, 3)]),
    [n, cap],
  );

  useEffect(() => {
    setNote(null);
  }, [item]);

  return (
    <div>
      <p className="font-display text-2xl font-medium tracking-tight">How many {item.noun}?</p>
      <div className="mt-3 flex flex-wrap gap-2" aria-label={`${n} ${item.noun}`}>
        {Array.from({ length: n }, (_, i) => (
          <img
            key={i}
            src={item.src}
            alt=""
            className="size-16 rounded-xl object-cover sm:size-20"
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{note ?? "Count the pictures, then tap the number."}</p>
      <div className="mt-3 flex gap-2">
        {choices.map((choice) => (
          <Button
            key={choice}
            type="button"
            onClick={() => {
              if (choice === n) {
                setNote("Yes.");
                speak(`${n} ${item.noun}`, 0.8);
                window.setTimeout(() => {
                  const nextItem = pick(pool);
                  setItem(nextItem);
                  setN(1 + Math.floor(Math.random() * cap));
                  setNote(`How many ${nextItem.noun}?`);
                }, 700);
              } else {
                setNote("Count again.");
                speak("Count again.", 0.85);
              }
            }}
          >
            {choice}
          </Button>
        ))}
      </div>
      {plus ? null : (
        <Button type="button" size="sm" variant="secondary" className="mt-3" onClick={onUnlock}>
          More animals with Plus
        </Button>
      )}
    </div>
  );
}

type MemoryCard = { uid: string; noun: string; src: string };

function makeDeck(): MemoryCard[] {
  return shuffle(
    shuffle(COUNTABLES)
      .slice(0, 6)
      .flatMap((item) => [
        { uid: `${item.noun}-a-${Math.random()}`, noun: item.noun, src: item.src },
        { uid: `${item.noun}-b-${Math.random()}`, noun: item.noun, src: item.src },
      ]),
  );
}

function MemoryGame() {
  const [deck, setDeck] = useState<MemoryCard[]>(() => makeDeck());
  const [up, setUp] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lock, setLock] = useState(false);
  const done = matched.length === 6;

  const flip = (index: number) => {
    if (lock || done) return;
    if (up.includes(index) || matched.includes(deck[index]!.noun)) return;
    const next = [...up, index];
    setUp(next);
    if (next.length < 2) return;
    const [a, b] = next;
    if (deck[a]!.noun === deck[b]!.noun) {
      setMatched((list) => [...list, deck[a]!.noun]);
      setUp([]);
      speak(deck[a]!.noun, 0.8);
      return;
    }
    setLock(true);
    window.setTimeout(() => {
      setUp([]);
      setLock(false);
    }, 700);
  };

  return (
    <div>
      <p className="font-display text-2xl font-medium tracking-tight">Match the pictures</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {done ? "You found every pair." : `Pairs found: ${matched.length} of 6.`}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {deck.map((card, index) => {
          const open = up.includes(index) || matched.includes(card.noun);
          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => flip(index)}
              className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-secondary"
              aria-label={open ? card.noun : "Hidden card"}
            >
              {open ? (
                <img src={card.src} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="font-display text-2xl text-muted-foreground">?</span>
              )}
            </button>
          );
        })}
      </div>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="mt-3"
        onClick={() => {
          setDeck(makeDeck());
          setUp([]);
          setMatched([]);
          setLock(false);
        }}
      >
        New cards
      </Button>
    </div>
  );
}

function ScrambleGame({ countries }: { countries: Place[] }) {
  const pool = useMemo(
    () => countries.map((c) => c.name.toUpperCase()).filter((name) => /^[A-Z]+$/.test(name) && name.length >= 4 && name.length <= 8),
    [countries],
  );
  const [word, setWord] = useState(() => pick(pool.length ? pool : ["GHANA"]));
  const [tiles, setTiles] = useState(() => shuffle(word.split("").map((ch, index) => ({ ch, index }))));
  const [built, setBuilt] = useState<number[]>([]);
  const spelled = built.map((index) => tiles.find((tile) => tile.index === index)?.ch ?? "").join("");
  const won = spelled === word;

  const fresh = (nextWord: string) => {
    setWord(nextWord);
    setTiles(shuffle(nextWord.split("").map((ch, index) => ({ ch, index }))));
    setBuilt([]);
  };

  useEffect(() => {
    if (won) speak(word.toLowerCase(), 0.8);
  }, [won, word]);

  return (
    <div>
      <p className="font-display text-2xl font-medium tracking-tight">Unscramble the country</p>
      <p className="mt-1 text-sm text-muted-foreground">Tap the letters in order.</p>
      <p className="font-display mt-4 min-h-12 text-center text-3xl tracking-[0.25em]">
        {word.split("").map((ch, index) => (
          <button
            key={`${ch}-${index}`}
            type="button"
            className="inline-block min-w-7"
            onClick={() => {
              if (built.length === 0) return;
              setBuilt((list) => list.slice(0, -1));
            }}
          >
            {spelled[index] ?? "_"}
          </button>
        ))}
      </p>
      {won ? <p className="text-center text-sm">Yes. {word}.</p> : null}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {tiles.map((tile) => {
          const used = built.includes(tile.index);
          return (
            <button
              key={tile.index}
              type="button"
              disabled={used || won}
              onClick={() => setBuilt((list) => [...list, tile.index])}
              className="h-12 w-12 rounded-xl bg-secondary text-lg font-medium disabled:opacity-25"
            >
              {tile.ch}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="button" size="sm" variant="secondary" onClick={() => setBuilt((list) => list.slice(0, -1))} disabled={built.length === 0 || won}>
          Undo
        </Button>
        <Button type="button" size="sm" variant="secondary" onClick={() => fresh(pick(pool.length ? pool : ["GHANA"]))}>
          New word
        </Button>
      </div>
    </div>
  );
}
