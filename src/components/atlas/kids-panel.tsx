import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocalWordHint } from "@/components/atlas/local-speak-button";
import { KIDS_GROUPS, metricsInKidsGroup } from "@/lib/atlas/metrics";
import { countrySentence, kidsWordFor } from "@/lib/atlas/kids-words";
import {
  canSpeak,
  setVoiceEnabled,
  speakSentence,
  speakWord,
  stopSpeaking,
  voiceEnabled,
  warmVoices,
} from "@/lib/atlas/speak";
import type { CountryRecord, MetricDef, MetricId } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

type KidsWordStageProps = {
  metric: MetricDef;
  selected: CountryRecord | null;
  onMetricChange: (id: MetricId) => void;
};

export function KidsWordStage({ metric, selected, onMetricChange }: KidsWordStageProps) {
  const word = kidsWordFor(metric.id);
  const [voiceOn, setVoiceOn] = useState(true);
  const label = word?.word ?? metric.short;

  useEffect(() => {
    warmVoices();
    setVoiceOn(voiceEnabled());
    return () => stopSpeaking();
  }, []);

  const sayWord = () => speakWord(word?.speak ?? metric.label);

  const sayPicture = (id: MetricId) => {
    onMetricChange(id);
    const next = kidsWordFor(id);
    speakWord(next?.speak ?? id);
  };

  const sayCountry = (country: CountryRecord) => {
    speakSentence(
      countrySentence(metric.id, country.name, country.values[metric.id], metric.short),
    );
  };

  useEffect(() => {
    if (!voiceOn || !selected) return;
    sayCountry(selected);
    // Only when the country changes — metric taps already speak the word.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id]);

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    setVoiceEnabled(next);
    if (!next) stopSpeaking();
  };

  return (
    <div className="mb-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={sayWord}
          aria-label={`Hear the word ${label}`}
          className="size-20 shrink-0 overflow-hidden rounded-xl bg-secondary shadow-[var(--shadow-border)]"
        >
          {word ? (
            <img
              src={word.image}
              alt=""
              width={160}
              height={160}
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center font-display text-lg">
              {metric.short}
            </span>
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-display text-2xl leading-none font-medium tracking-tight">
                {label}
              </p>
              {word ? (
                <p className="mt-1 text-xs tracking-wide text-muted-foreground">{word.phonics}</p>
              ) : null}
              <LocalWordHint metricId={metric.id} iso3={selected?.iso3} />
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant={voiceOn ? "default" : "secondary"}
                size="icon-sm"
                aria-pressed={voiceOn}
                aria-label={voiceOn ? "Turn voice off" : "Turn voice on"}
                onClick={toggleVoice}
              >
                {voiceOn ? <Volume2 /> : <VolumeX />}
              </Button>
            </div>
          </div>
          <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
            {word?.hint ?? "Tap the picture to hear this metric."}
          </p>
        </div>
      </div>

      {selected && canSpeak() ? (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-3 w-full"
          onClick={() => sayCountry(selected)}
        >
          <Volume2 className="size-3.5" />
          Hear {selected.name} in English
        </Button>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          Tap a country and I will say its name.
        </p>
      )}

      <p className="mt-4 text-2xs font-medium tracking-caps text-muted-foreground uppercase">
        Picture words
      </p>
      <div className="mt-2 grid grid-cols-5 gap-1.5">
        {KIDS_GROUPS.flatMap((group) => metricsInKidsGroup(group.id)).map((item) => {
          const card = kidsWordFor(item.id);
          if (!card) return null;
          const active = item.id === metric.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => sayPicture(item.id)}
              aria-label={`Hear ${card.word}`}
              aria-pressed={active}
              className={cn(
                "overflow-hidden rounded-lg bg-secondary",
                active
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                  : "hover:ring-1 hover:ring-foreground/30",
              )}
            >
              <img
                src={card.image}
                alt={card.word}
                width={96}
                height={96}
                className="aspect-square w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
