import { formatMetricValue } from "@/lib/atlas/metrics";
import type { CountryRecord, MetricId } from "@/lib/atlas/types";

type MapTooltipProps = {
  country: CountryRecord;
  metric: MetricId;
  year?: number | null;
  x: number;
  y: number;
  nameOnly?: boolean;
};

export function MapTooltip({ country, metric, year, x, y, nameOnly }: MapTooltipProps) {
  const value = country.values[metric];
  const left = Math.min(x + 14, typeof window !== "undefined" ? window.innerWidth - 220 : x + 14);
  const top = Math.min(y + 16, typeof window !== "undefined" ? window.innerHeight - 88 : y + 16);

  return (
    <div
      className="pointer-events-none fixed z-40 min-w-40 rounded-lg bg-popover px-3 py-2 shadow-[var(--shadow-overlay)]"
      style={{ left, top }}
      role="tooltip"
    >
      <p className="font-display text-sm font-medium tracking-tight text-foreground">
        {country.name}
      </p>
      {nameOnly ? null : (
        <>
          <p className="mt-0.5 text-xs text-muted-foreground">{country.iso3}</p>
          <p className="mt-1.5 font-sans text-sm tabular-nums text-foreground">
            {formatMetricValue(metric, value)}
            {year && value != null ? (
              <span className="ml-1.5 text-xs text-muted-foreground">{year}</span>
            ) : null}
          </p>
        </>
      )}
    </div>
  );
}
