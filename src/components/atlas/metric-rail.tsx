import { Star } from "lucide-react";
import { formatMetricValue, resolveMetric, METRIC_BY_ID, metricValue } from "@/lib/atlas/metrics";
import type { AtlasMode, CountryRecord, MetricId } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

type RailItem = {
  metricId: MetricId;
  starred: boolean;
};

type MetricRailProps = {
  mode: AtlasMode;
  active: MetricId;
  items: RailItem[];
  places: CountryRecord[];
  selected: CountryRecord | null;
  onMetric: (id: MetricId) => void;
  onStar: (id: MetricId) => void;
  onPlace: (id: string) => void;
};

export function MetricRail({
  mode,
  active,
  items,
  places,
  selected,
  onMetric,
  onStar,
  onPlace,
}: MetricRailProps) {
  if (!items.length && !places.length) return null;

  return (
    <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border bg-card/80 px-3 py-2 sm:px-5">
      <p className="hidden shrink-0 text-2xs font-medium tracking-caps text-muted-foreground uppercase sm:block">
        Jump
      </p>
      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        {items.map((item) => {
          const metric = METRIC_BY_ID[item.metricId];
          if (!metric) return null;
          const copy = resolveMetric(metric, mode);
          const on = item.metricId === active;
          const sample = selected ?? null;
          const value = sample ? metricValue(sample, item.metricId) : null;
          const stat =
            on && sample && value != null
              ? `${sample.name} ${formatMetricValue(item.metricId, value)}`
              : copy.short;
          return (
            <div
              key={item.metricId}
              className={cn(
                "flex shrink-0 items-center rounded-full bg-secondary",
                on && "bg-primary text-primary-foreground",
              )}
            >
              <button
                type="button"
                onClick={() => onMetric(item.metricId)}
                className="max-w-[11rem] truncate py-1.5 pr-1 pl-3 text-xs font-medium"
              >
                {on ? stat : copy.short}
              </button>
              <button
                type="button"
                aria-label={item.starred ? `Unpin ${copy.short}` : `Pin ${copy.short}`}
                aria-pressed={item.starred}
                onClick={() => onStar(item.metricId)}
                className="grid size-8 place-items-center"
              >
                <Star
                  className={cn(
                    "size-3",
                    item.starred
                      ? on
                        ? "fill-primary-foreground text-primary-foreground"
                        : "fill-primary text-primary"
                      : "text-muted-foreground",
                  )}
                />
              </button>
            </div>
          );
        })}
        {places.map((place) => (
          <button
            key={place.id}
            type="button"
            onClick={() => onPlace(place.id)}
            className={cn(
              "shrink-0 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium",
              selected?.id === place.id && "bg-accent",
            )}
          >
            {place.name}
          </button>
        ))}
      </div>
    </div>
  );
}
