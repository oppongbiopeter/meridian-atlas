import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, Gamepad2, Library, Shapes, Sparkles, X } from "lucide-react";
import { WorldMap, type MapHandle } from "@/components/atlas/world-map";
import { CountryPanel } from "@/components/atlas/country-panel";
import { DailyTipCard } from "@/components/atlas/daily-tip";
import { PlusGate } from "@/components/atlas/plus-gate";
import { KidsQuiz, speakQuestion } from "@/components/atlas/kids-quiz";
import { Legend } from "@/components/atlas/legend";
import { MapControls } from "@/components/atlas/map-controls";
import { MapTooltip } from "@/components/atlas/map-tooltip";
import { MetricSwitcher } from "@/components/atlas/metric-switcher";
import { MetricRail } from "@/components/atlas/metric-rail";
import { KidsStudio } from "@/components/atlas/kids-studio";
import { LibraryPanel } from "@/components/atlas/library-panel";
import { Button } from "@/components/ui/button";
import {
  choroStops,
  createColorScale,
  EMPTY_FILL,
  legendTicks,
} from "@/lib/atlas/colors";
import { loadCountryFeatures } from "@/lib/atlas/geo";
import { METRIC_BY_ID, metricValue, isKidsMetric, isPlusMetric } from "@/lib/atlas/metrics";
import { readPlus, writePlus } from "@/lib/atlas/plus";
import { buildAtlas, metricSource, observationYear } from "@/lib/atlas/owid";
import { buildQuizRound, quizLevel, type QuizQuestion } from "@/lib/atlas/quiz";
import { speakSentence, stopSpeaking } from "@/lib/atlas/speak";
import { computeStats } from "@/lib/atlas/stats";
import { tipForToday, todayKey } from "@/lib/atlas/tips";
import {
  readRecentMetrics,
  readRecentPlaces,
  readStars,
  rememberMetric,
  rememberPlace,
  toggleStar,
} from "@/lib/atlas/recents";
import type { AtlasMode, MapView, MetricId, QuizDifficulty } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

const MODE_KEY = "meridian.mode";
const METRIC_KEY = "meridian.metric";
const VIEW_KEY = "meridian.view";
const TIP_KEY = "meridian.tip.day";

type QuizState =
  | { phase: "off" }
  | { phase: "pick" }
  | {
      phase: "play";
      difficulty: QuizDifficulty;
      questions: QuizQuestion[];
      index: number;
      lives: number;
      score: number;
      verdict: "yes" | "no" | null;
    }
  | { phase: "done"; score: number; total: number };

function readStoredMode(): AtlasMode {
  if (typeof window === "undefined") return "atlas";
  return window.localStorage.getItem(MODE_KEY) === "kids" ? "kids" : "atlas";
}

function readStoredMetric(): MetricId {
  if (typeof window === "undefined") return "gdp";
  const raw = window.localStorage.getItem(METRIC_KEY);
  if (raw && raw in METRIC_BY_ID) return raw as MetricId;
  return "gdp";
}

function readStoredView(): MapView {
  if (typeof window === "undefined") return "map";
  return window.localStorage.getItem(VIEW_KEY) === "globe" ? "globe" : "map";
}

export function AtlasApp() {
  const mapRef = useRef<MapHandle>(null);
  const atlas = useMemo(() => buildAtlas(), []);
  const [mode, setMode] = useState<AtlasMode>("atlas");
  const [view, setView] = useState<MapView>("map");
  const [metricId, setMetricId] = useState<MetricId>("gdp");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quiz, setQuiz] = useState<QuizState>({ phase: "off" });
  const [pulse, setPulse] = useState<{ id: string; kind: "yes" | "no" } | null>(null);
  const [tipOpen, setTipOpen] = useState(false);
  const [recentMetrics, setRecentMetrics] = useState<MetricId[]>(["gdp", "life", "pop", "forest", "solar"]);
  const [stars, setStars] = useState<MetricId[]>([]);
  const [recentPlaceIds, setRecentPlaceIds] = useState<string[]>([]);
  const [plus, setPlus] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [story, setStory] = useState(false);
  const [studio, setStudio] = useState(false);
  const [seek, setSeek] = useState<{
    countryId: string;
    name: string;
    prompt: string;
    triesLeft: number;
    note: string;
  } | null>(null);
  const [seekReport, setSeekReport] = useState<{ id: string; ok: boolean; nonce: number } | null>(null);

  const features = useMemo(() => loadCountryFeatures(), []);
  const mappedCountries = useMemo(() => {
    const ids = new Set(features.map((f) => f.id));
    return atlas.countries.filter((c) => ids.has(c.id));
  }, [atlas.countries, features]);

  useEffect(() => {
    setMode(readStoredMode());
    setMetricId(readStoredMetric());
    setView(readStoredView());
    setRecentMetrics(readRecentMetrics(readStoredMode()));
    setStars(readStars());
    setRecentPlaceIds(readRecentPlaces());
    setPlus(readPlus());
    const seen = window.localStorage.getItem(TIP_KEY);
    if (seen !== todayKey()) setTipOpen(true);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(MODE_KEY, mode);
    window.localStorage.setItem(METRIC_KEY, metricId);
    window.localStorage.setItem(VIEW_KEY, view);
    rememberMetric(metricId);
    setRecentMetrics(readRecentMetrics(mode));
  }, [mode, metricId, view]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedId(null);
        setMobileOpen(false);
        setQuery("");
        if (quiz.phase !== "off") setQuiz({ phase: "off" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quiz.phase]);

  const metric = METRIC_BY_ID[metricId];
  const source = metricSource(metricId, atlas.snapshot);
  const stops = choroStops(mode);
  const stats = useMemo(
    () => computeStats(mappedCountries, metricId),
    [mappedCountries, metricId],
  );
  const colorScale = useMemo(() => {
    const values = stats.values.map((v) => v.value);
    return createColorScale(metric, values, stops);
  }, [metric, stats, stops]);
  const ticks = useMemo(
    () => legendTicks(metric, stats.values.map((row) => row.value)),
    [metric, stats],
  );

  const quizPlay = quiz.phase === "play";
  const kids = mode === "kids";
  const locked = !kids && isPlusMetric(metricId) && !plus;
  const level = quizPlay ? quizLevel(quiz.difficulty) : null;
  const question = quizPlay ? quiz.questions[quiz.index] : undefined;

  const fillOf = (id: string) => {
    if (story) return id === selectedId ? stops[4] : stops[1];
    if (quiz.phase !== "off") return EMPTY_FILL[mode];
    if (locked) return EMPTY_FILL[mode];
    const country = atlas.get(id);
    if (!country || !colorScale) return EMPTY_FILL[mode];
    const value = metricValue(country, metricId);
    if (value == null) return EMPTY_FILL[mode];
    if (metric.scale === "log" && value <= 0) return stops[0];
    return colorScale(value);
  };

  const selected = atlas.get(selectedId) ?? null;
  const hoveredCountry = hover ? atlas.get(hover.id) : undefined;
  const hoverYear = hoveredCountry
    ? observationYear(hoveredCountry.iso3, metricId, atlas.snapshot)
    : null;

  const railItems = useMemo(() => {
    const starred = stars.filter((id) => (kids ? isKidsMetric(id) : true));
    const rest = recentMetrics.filter((id) => !starred.includes(id));
    return [...starred, ...rest].slice(0, 8).map((metricId) => ({
      metricId,
      starred: starred.includes(metricId),
    }));
  }, [stars, recentMetrics, kids]);

  const railPlaces = useMemo(
    () =>
      recentPlaceIds
        .map((id) => atlas.get(id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .slice(0, 4),
    [recentPlaceIds, atlas],
  );

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return mappedCountries
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.iso3.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q),
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [mappedCountries, query]);

  const selectCountry = (id: string | null) => {
    if (seek) {
      guessSeek(id);
      return;
    }
    setSelectedId(id);
    if (id) {
      setMobileOpen(true);
      rememberPlace(id);
      setRecentPlaceIds(readRecentPlaces());
    }
  };

  const guessSeek = (id: string | null) => {
    if (!id || !seek) return;
    if (id === seek.countryId) {
      speakSentence(`Yes. ${seek.name}.`);
      setPulse({ id, kind: "yes" });
      const countryId = seek.countryId;
      window.setTimeout(() => {
        setPulse(null);
        setSeek(null);
        setSeekReport((current) => ({ id: countryId, ok: true, nonce: (current?.nonce ?? 0) + 1 }));
      }, 900);
      return;
    }
    const left = seek.triesLeft - 1;
    if (left <= 0) {
      speakSentence(`It was ${seek.name}.`);
      setPulse({ id: seek.countryId, kind: "yes" });
      const countryId = seek.countryId;
      window.setTimeout(() => {
        setPulse(null);
        setSeek(null);
        setSeekReport((current) => ({ id: countryId, ok: false, nonce: (current?.nonce ?? 0) + 1 }));
      }, 1200);
      return;
    }
    speakSentence("Not that one.");
    setPulse({ id, kind: "no" });
    setSeek({ ...seek, triesLeft: left, note: "Not that one." });
  };

  const beginSeek = (round: { countryId: string; name: string; prompt: string }) => {
    setSelectedId(null);
    setMobileOpen(false);
    setHover(null);
    setView("globe");
    setPulse(null);
    setSeek({ ...round, triesLeft: 3, note: "Tap the country." });
    speakSentence(round.prompt);
  };

  const startQuiz = (difficulty: QuizDifficulty) => {
    const questions = buildQuizRound(mappedCountries, difficulty);
    const spec = quizLevel(difficulty);
    setView("globe");
    setSelectedId(null);
    setMobileOpen(false);
    setHover(null);
    setPulse(null);
    mapRef.current?.reset();
    const first = questions[0];
    setQuiz({
      phase: "play",
      difficulty,
      questions,
      index: 0,
      lives: spec.lives,
      score: 0,
      verdict: null,
    });
    if (first) window.setTimeout(() => speakQuestion(first), 350);
  };

  const finishRound = (score: number, total: number) => {
    setPulse(null);
    setQuiz({ phase: "done", score, total });
  };

  const handleQuizGuess = (id: string | null) => {
    if (!quizPlay || !question || quiz.verdict) return;
    if (!id) return;
    const correct = id === question.answerId;
    setPulse({ id, kind: correct ? "yes" : "no" });
    if (correct) {
      speakSentence(`Yes. ${question.answerName}. ${question.fact}`);
      mapRef.current?.focusCountry(id);
      setQuiz({ ...quiz, verdict: "yes", score: quiz.score + 1 });
      window.setTimeout(() => {
        const nextIndex = quiz.index + 1;
        if (nextIndex >= quiz.questions.length) {
          finishRound(quiz.score + 1, quiz.questions.length);
          return;
        }
        const next = quiz.questions[nextIndex];
        setPulse(null);
        setQuiz({ ...quiz, index: nextIndex, verdict: null, score: quiz.score + 1 });
        mapRef.current?.reset();
        if (next) speakQuestion(next);
      }, 1600);
      return;
    }
    const lives = quiz.lives - 1;
    speakSentence("Not that country. Keep looking.");
    setQuiz({ ...quiz, lives, verdict: "no" });
    window.setTimeout(() => {
      if (lives <= 0) {
        speakSentence(`It was ${question.answerName}. ${question.fact}`);
        mapRef.current?.focusCountry(question.answerId);
        setPulse({ id: question.answerId, kind: "yes" });
        window.setTimeout(() => {
          const nextIndex = quiz.index + 1;
          if (nextIndex >= quiz.questions.length) {
            finishRound(quiz.score, quiz.questions.length);
            return;
          }
          const next = quiz.questions[nextIndex];
          setPulse(null);
          setQuiz({ ...quiz, index: nextIndex, lives: quizLevel(quiz.difficulty).lives, verdict: null });
          mapRef.current?.reset();
          if (next) speakQuestion(next);
        }, 1800);
        return;
      }
      setPulse(null);
      setQuiz((current) => (current.phase === "play" ? { ...current, verdict: null } : current));
    }, 900);
  };

  const switchMode = (next: AtlasMode) => {
    if (next === "atlas") stopSpeaking();
    setMode(next);
    if (next === "atlas") setQuiz({ phase: "off" });
    if (next === "kids" && !isKidsMetric(metricId)) setMetricId("chickens");
  };

  const pickMetric = (id: MetricId) => {
    if (kids && !isKidsMetric(id)) return;
    setStory(false);
    setMetricId(id);
  };

  const dismissTip = () => {
    window.localStorage.setItem(TIP_KEY, todayKey());
    setTipOpen(false);
  };

  const quizOn = quiz.phase !== "off";
  const playing = studio && kids;
  const sheetOpen = !quizOn && !playing && (Boolean(selectedId) || mobileOpen);
  const tip = tipForToday(kids);
  const showTooltip = hoveredCountry && hover && (!quizPlay || Boolean(level?.showNames));

  return (
    <div
      data-mode={mode}
      className="flex h-dvh min-h-0 flex-col bg-background text-foreground"
    >
      <header className="relative z-20 flex shrink-0 items-center gap-2 border-b border-border px-3 py-2 sm:gap-3 sm:px-5">
        <div className="hidden min-w-0 shrink-0 md:block">
          <p className="font-display text-lg leading-none font-medium tracking-tight sm:text-xl">
            Meridian
          </p>
          <p className="mt-0.5 text-2xs tracking-caps text-muted-foreground uppercase">
            {quizOn ? "Kids · Hunt" : kids ? "Atlas · Kids" : "Atlas"}
          </p>
        </div>
        <div className="min-w-0 flex-1">
          {quizOn ? (
            <p className="truncate text-sm font-medium">Spin the globe. Tap the country.</p>
          ) : (
            <MetricSwitcher
              value={metricId}
              mode={mode}
              plus={plus}
              onChange={pickMetric}
              countries={mappedCountries}
              onPickCountry={selectCountry}
            />
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant={story ? "default" : "secondary"}
            size="sm"
            aria-pressed={story}
            onClick={() => {
              setStory((on) => !on);
              setStudio(false);
            }}
          >
            <BookOpen className="size-3.5" />
            <span className="hidden sm:inline">Facts</span>
          </Button>
          {kids ? (
            <Button
              type="button"
              variant={studio ? "default" : "secondary"}
              size="sm"
              aria-pressed={studio}
              onClick={() => setStudio((on) => !on)}
            >
              <Shapes className="size-3.5" />
              <span className="hidden sm:inline">Play</span>
            </Button>
          ) : null}
          <Button
            type="button"
            variant={libraryOpen ? "default" : "secondary"}
            size="sm"
            aria-pressed={libraryOpen}
            aria-label="Open library"
            onClick={() => setLibraryOpen(true)}
            className="gap-1.5"
          >
            <Library className="size-3.5" />
            <span className="hidden sm:inline">Library</span>
          </Button>
          {kids ? (
            <Button
              type="button"
              variant={quizOn ? "default" : "secondary"}
              size="sm"
              aria-pressed={quizOn}
              onClick={() => {
                if (quizOn) {
                  stopSpeaking();
                  setQuiz({ phase: "off" });
                  setPulse(null);
                } else {
                  setQuiz({ phase: "pick" });
                  setView("globe");
                  setSelectedId(null);
                  setMobileOpen(false);
                }
              }}
              className="gap-1.5"
            >
              <Gamepad2 className="size-3.5" />
              Quiz
            </Button>
          ) : null}
          <Button
            type="button"
            variant={kids ? "default" : "secondary"}
            size="sm"
            aria-pressed={kids}
            aria-label={kids ? "Switch to atlas mode" : "Switch to kids mode"}
            onClick={() => switchMode(kids ? "atlas" : "kids")}
            className="gap-1.5"
          >
            <Sparkles className="size-3.5" />
            Kids
          </Button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <section className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          {quizOn ? null : (
            <MetricRail
              mode={mode}
              active={metricId}
              items={railItems}
              places={railPlaces}
              selected={selected}
              onMetric={pickMetric}
              onStar={(id) => setStars(toggleStar(id))}
              onPlace={selectCountry}
            />
          )}
          <div className="relative min-h-0 flex-1">
          <WorldMap
            ref={mapRef}
            view={view}
            mode={mode}
            fillOf={fillOf}
            selectedId={quizOn ? null : selectedId}
            hoveredId={hover?.id ?? null}
            pulse={pulse}
            autoFocus={!quizOn}
            onSelect={quizPlay ? handleQuizGuess : selectCountry}
            onHover={setHover}
          />
          {quiz.phase === "pick" ? (
            <KidsQuiz phase="pick" onPick={startQuiz} onClose={() => setQuiz({ phase: "off" })} />
          ) : null}
          {quiz.phase === "play" && question && level ? (
            <KidsQuiz
              phase="play"
              question={question}
              index={quiz.index}
              total={quiz.questions.length}
              lives={quiz.lives}
              maxLives={level.lives}
              showHint={level.showHint}
              verdict={quiz.verdict}
              onSpeak={() => speakQuestion(question)}
              onClose={() => {
                stopSpeaking();
                setQuiz({ phase: "off" });
                setPulse(null);
              }}
            />
          ) : null}
          {quiz.phase === "done" ? (
            <KidsQuiz
              phase="done"
              score={quiz.score}
              total={quiz.total}
              onAgain={() => setQuiz({ phase: "pick" })}
              onClose={() => setQuiz({ phase: "off" })}
            />
          ) : null}
          {!quizOn && !locked && !story ? (
            <Legend metric={metric} mode={mode} ticks={ticks} year={source.latestYear} />
          ) : null}
          {tipOpen && !quizOn ? (
            <DailyTipCard tip={tip} onDismiss={dismissTip} />
          ) : null}
          <MapControls
            view={view}
            onView={setView}
            onZoomIn={() => mapRef.current?.zoomBy(1.45)}
            onZoomOut={() => mapRef.current?.zoomBy(1 / 1.45)}
            onReset={() => {
              setSelectedId(null);
              mapRef.current?.reset();
            }}
            onOpenList={() => {
              setSelectedId(null);
              setMobileOpen(true);
            }}
            hideList={quizOn}
          />
          {libraryOpen ? <LibraryPanel onClose={() => setLibraryOpen(false)} /> : null}
          {seek && kids ? (
            <div className="absolute top-3 right-3 left-3 z-20 rounded-2xl bg-card p-3 shadow-[var(--shadow-overlay)] sm:left-auto sm:max-w-sm">
              <p className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">Show and tell</p>
              <p className="font-display mt-1 text-lg leading-snug font-medium tracking-tight">{seek.prompt}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {seek.note} Tries left: {seek.triesLeft}.
              </p>
              <Button type="button" size="sm" variant="secondary" className="mt-2" onClick={() => setSeek(null)}>
                Back to the game
              </Button>
            </div>
          ) : null}
          {studio && kids ? (
            <KidsStudio
              countries={mappedCountries.map((c) => ({ id: c.id, name: c.name, region: c.region }))}
              plus={plus}
              parked={Boolean(seek)}
              seekReport={seekReport}
              onClose={() => {
                setStudio(false);
                setSeek(null);
              }}
              onUnlock={() => {
                writePlus(true);
                setPlus(true);
              }}
              onSeek={beginSeek}
            />
          ) : null}
          </div>
        </section>

        {quizOn || playing ? null : (
          <aside className="hidden w-[340px] shrink-0 border-l border-border bg-card lg:flex lg:flex-col">
            <CountryPanel
              metric={metric}
              mode={mode}
              source={source}
              snapshot={atlas.snapshot}
              stats={stats}
              selected={selected}
              query={query}
              onQueryChange={setQuery}
              matches={matches}
              onSelect={selectCountry}
              onMetricChange={pickMetric}
              plus={plus}
              onUnlock={() => {
                writePlus(true);
                setPlus(true);
              }}
              story={story}
            />
          </aside>
        )}
      </div>

      {showTooltip ? (
        <MapTooltip
          country={hoveredCountry}
          metric={metricId}
          year={hoverYear}
          x={hover.x}
          y={hover.y}
          nameOnly={quizPlay || locked}
        />
      ) : null}

      <div className={cn("lg:hidden", sheetOpen ? "pointer-events-auto" : "pointer-events-none")}>
        <button
          type="button"
          aria-label="Dismiss panel"
          className={cn(
            "fixed inset-0 z-20 bg-background/40 transition-opacity duration-(--motion-fast) ease-(--ease-smooth-out)",
            sheetOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => {
            setSelectedId(null);
            setMobileOpen(false);
          }}
        />
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-30 flex max-h-[72vh] flex-col rounded-t-2xl bg-card shadow-[var(--shadow-overlay)] transition-transform duration-(--motion-slow) ease-(--ease-smooth-out)",
            sheetOpen ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="flex items-center justify-center pt-2">
            <span className="h-1 w-10 rounded-full bg-foreground/20" />
          </div>
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close panel"
              onClick={() => {
                setSelectedId(null);
                setMobileOpen(false);
              }}
            >
              <X />
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden">
            <CountryPanel
              metric={metric}
              mode={mode}
              source={source}
              snapshot={atlas.snapshot}
              stats={stats}
              selected={selected}
              query={query}
              onQueryChange={setQuery}
              matches={matches}
              onSelect={selectCountry}
              onMetricChange={pickMetric}
              plus={plus}
              onUnlock={() => {
                writePlus(true);
                setPlus(true);
              }}
              story={story}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
