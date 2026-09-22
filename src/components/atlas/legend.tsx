import { formatMetricValue, resolveMetric } from "@/lib/atlas/metrics";
import type { AtlasMode, MetricDef } from "@/lib/atlas/types";

type LegendProps = {
  metric: MetricDef;
  mode: AtlasMode;
  ticks: number[];
  year?: number | null;
};

export function Legend({ metric, mode, ticks, year }: LegendProps) {
  const high = ticks[ticks.length - 1];
  const low = ticks[0];
  const copy = resolveMetric(metric, mode);

  return (
    <div
      className="pointer-events-none absolute bottom-16 left-4 z-10 flex items-end gap-3 rounded-xl bg-card/90 px-3 py-3 shadow-[var(--shadow-overlay)] sm:left-5"
      aria-hidden="false"
    >
      <div className="legend-ramp h-28 w-2 rounded-full sm:h-32 sm:w-2.5" />
      <div className="flex h-28 flex-col justify-between py-0.5 sm:h-32">
        <div>
          <p className="text-micro font-medium tracking-wide text-muted-foreground uppercase">
            {copy.higherLabel}
          </p>
          <p className="font-sans text-sm tabular-nums text-foreground">
            {formatMetricValue(metric.id, high ?? null)}
          </p>
        </div>
        <p className="max-w-28 text-2xs leading-snug text-muted-foreground">
          {metric.unit}
          {year ? ` · ${year}` : ""}
        </p>
        <div>
          <p className="font-sans text-sm tabular-nums text-foreground">
            {formatMetricValue(metric.id, low ?? null)}
          </p>
          <p className="text-micro font-medium tracking-wide text-muted-foreground uppercase">
            {copy.lowerLabel}
          </p>
        </div>
      </div>
    </div>
  );
}
