import { Volume2 } from "lucide-react";
import { localPhrase, speakLocalWord } from "@/lib/atlas/speak";
import type { MetricId } from "@/lib/atlas/types";

export function LocalWordHint({
  metricId,
  iso3,
}: {
  metricId: MetricId | string;
  iso3: string | null | undefined;
}) {
  const phrase = localPhrase(metricId, iso3);
  if (!iso3 || !phrase) return null;

  return (
    <button
      type="button"
      onClick={() => speakLocalWord(metricId, iso3)}
      aria-label={`Hear ${phrase.text} in ${phrase.language}`}
      className="mt-1.5 flex max-w-full items-center gap-1.5 rounded-lg text-left"
    >
      <span className="min-w-0 truncate font-display text-base leading-none font-medium tracking-tight">
        {phrase.text}
      </span>
      <span className="shrink-0 text-2xs tracking-caps text-muted-foreground uppercase">
        · {phrase.tag}
      </span>
      <Volume2 className="size-3.5 shrink-0 text-primary" aria-hidden />
    </button>
  );
}
