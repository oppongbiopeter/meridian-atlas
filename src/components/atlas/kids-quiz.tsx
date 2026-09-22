import { useEffect } from "react";
import { Heart, Volume2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalWordHint } from "@/components/atlas/local-speak-button";
import { QUIZ_LEVELS, type QuizQuestion } from "@/lib/atlas/quiz";
import { speakSentence, speakWord, stopSpeaking, warmVoices } from "@/lib/atlas/speak";
import type { QuizDifficulty } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

type KidsQuizProps =
  | {
      phase: "pick";
      onPick: (level: QuizDifficulty) => void;
      onClose: () => void;
    }
  | {
      phase: "play";
      question: QuizQuestion;
      index: number;
      total: number;
      lives: number;
      maxLives: number;
      showHint: boolean;
      verdict: "yes" | "no" | null;
      onSpeak: () => void;
      onClose: () => void;
    }
  | {
      phase: "done";
      score: number;
      total: number;
      onAgain: () => void;
      onClose: () => void;
    };

export function KidsQuiz(props: KidsQuizProps) {
  useEffect(() => {
    warmVoices();
    return () => stopSpeaking();
  }, []);

  if (props.phase === "pick") {
    return (
      <div className="pointer-events-auto absolute inset-x-3 top-3 z-20 mx-auto w-[min(22rem,calc(100%-1.5rem))] rounded-2xl bg-card p-4 shadow-[var(--shadow-overlay)] sm:left-5 sm:right-auto sm:mx-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">Globe hunt</p>
            <h2 className="font-display mt-1 text-2xl leading-none font-medium tracking-tight">Find it</h2>
          </div>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Close quiz" onClick={props.onClose}>
            <X />
          </Button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Hear the word, look at the picture, then spin the globe and tap the country.
        </p>
        <div className="mt-4 grid gap-2">
          {QUIZ_LEVELS.map((level) => (
            <button
              key={level.id}
              type="button"
              onClick={() => props.onPick(level.id)}
              className="rounded-xl bg-secondary px-3 py-3 text-left hover:bg-accent"
            >
              <span className="block text-sm font-medium">{level.label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{level.blurb}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (props.phase === "done") {
    return (
      <div className="pointer-events-auto absolute inset-x-3 top-3 z-20 mx-auto w-[min(22rem,calc(100%-1.5rem))] rounded-2xl bg-card p-4 shadow-[var(--shadow-overlay)] sm:left-5 sm:right-auto sm:mx-0">
        <p className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">Round over</p>
        <h2 className="font-display mt-1 text-2xl font-medium tracking-tight">
          {props.score} of {props.total}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {props.score === props.total
            ? "You found every country."
            : "Spin again whenever you want another hunt."}
        </p>
        <div className="mt-4 flex gap-2">
          <Button type="button" className="flex-1" onClick={props.onAgain}>
            Play again
          </Button>
          <Button type="button" variant="secondary" onClick={props.onClose}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-auto absolute inset-x-3 top-3 z-20 mx-auto w-[min(22rem,calc(100%-1.5rem))] rounded-2xl bg-card p-3 shadow-[var(--shadow-overlay)] sm:left-5 sm:right-auto sm:mx-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">
          {props.index + 1} / {props.total}
        </p>
        <div className="flex items-center gap-1" aria-label={`${props.lives} lives left`}>
          {Array.from({ length: props.maxLives }, (_, i) => (
            <Heart
              key={i}
              className={cn("size-3.5", i < props.lives ? "fill-primary text-primary" : "text-muted-foreground")}
            />
          ))}
        </div>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Exit quiz" onClick={props.onClose}>
          <X />
        </Button>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => speakWord(props.question.word)}
          aria-label={`Hear the word ${props.question.word}`}
          className="size-16 shrink-0 overflow-hidden rounded-xl bg-secondary shadow-[var(--shadow-border)]"
        >
          <img
            src={props.question.image}
            alt=""
            width={128}
            height={128}
            className="size-full object-cover"
          />
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl leading-none font-medium tracking-tight">{props.question.word}</p>
          <p className="mt-1 text-xs tracking-wide text-muted-foreground">{props.question.phonics}</p>
          {props.verdict === "yes" ? (
            <LocalWordHint
              metricId={props.question.metricId ?? props.question.word.toLowerCase()}
              iso3={props.question.answerIso3}
            />
          ) : null}
        </div>
        <Button type="button" variant="secondary" size="icon-sm" aria-label="Hear the question" onClick={props.onSpeak}>
          <Volume2 />
        </Button>
      </div>

      <p className="mt-3 text-sm leading-snug">{props.question.prompt}</p>
      {props.showHint ? (
        <p className="mt-1 text-xs text-muted-foreground">{props.question.hint}</p>
      ) : null}

      {props.verdict === "yes" ? (
        <p className="mt-2 text-sm font-medium text-primary">Yes — {props.question.answerName}.</p>
      ) : null}
      {props.verdict === "no" ? (
        <p className="mt-2 text-sm text-muted-foreground">Not that one. Keep spinning.</p>
      ) : null}
    </div>
  );
}

export function speakQuestion(question: QuizQuestion) {
  speakWord(question.word);
  window.setTimeout(() => speakSentence(question.speak), 700);
}
