import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { factsFor } from "@/lib/atlas/facts";
import { speak, speakSentence } from "@/lib/atlas/speak";
import type { CountryRecord } from "@/lib/atlas/types";

export function CountryFacts({
  country,
  quiet = false,
}: {
  country: CountryRecord;
  quiet?: boolean;
}) {
  const pack = factsFor(country);

  return (
    <section className={quiet ? "mt-5" : ""}>
      <p className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">
        {quiet ? "A fact" : "Stories"}
      </p>
      <ul className="mt-3 space-y-3">
        {(quiet ? pack.items.slice(0, 1) : pack.items).map((fact) => (
          <li key={fact.title} className="rounded-2xl bg-secondary px-3 py-3">
            <p className="font-display text-base leading-snug font-medium tracking-tight">
              {fact.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{fact.body}</p>
            {pack.translated ? (
              <p className="mt-2 text-sm leading-relaxed" lang={pack.locale}>
                <span className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">
                  {pack.language}{" "}
                </span>
                {pack.local}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex flex-wrap gap-2">
        {pack.translated ? (
          <Button type="button" size="sm" variant="secondary" onClick={() => speakSentence(pack.english)}>
            <Volume2 className="size-3.5" />
            Hear in English
          </Button>
        ) : null}
        <Button
          type="button"
          size="sm"
          variant={pack.translated ? "default" : "secondary"}
          onClick={() => speak(pack.translated ? pack.local : pack.english, 0.82, pack.translated ? pack.locale : "en-US")}
          aria-label={pack.translated ? `Hear a fact in ${pack.language}` : "Hear this fact"}
        >
          <Volume2 className="size-3.5" />
          {pack.translated ? `Hear in ${pack.language}` : "Hear this fact"}
        </Button>
      </div>
    </section>
  );
}
