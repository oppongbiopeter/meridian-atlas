import { ArrowUpRight, Globe2, Lock, X } from "lucide-react";
import { KidsWordStage } from "@/components/atlas/kids-panel";
import { PlusGate } from "@/components/atlas/plus-gate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  formatMetricValue,
  formatPopulationExact,
  isKidsMetric,
  isPlusMetric,
  METRIC_GROUPS,
  metricsInGroup,
  resolveMetric,
} from "@/lib/atlas/metrics";
import { observationYear, type OwidMetricBlock, type OwidSnapshot } from "@/lib/atlas/owid";
import { rankOf, type MetricStats } from "@/lib/atlas/stats";
import type { AtlasMode, CountryRecord, MetricDef, MetricId } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

type CountryPanelProps = {
  metric: MetricDef;
  mode: AtlasMode;
  source: OwidMetricBlock;
  snapshot: OwidSnapshot;
  stats: MetricStats;
  selected: CountryRecord | null;
  query: string;
  onQueryChange: (value: string) => void;
  matches: CountryRecord[];
  onSelect: (id: string | null) => void;
  onMetricChange: (id: MetricId) => void;
  plus?: boolean;
  onUnlock?: () => void;
};

function PercentileBar({ percentile }: { percentile: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-xs text-muted-foreground">
        <span>Among countries with data</span>
        <span className="tabular-nums text-foreground">
          {Math.round(percentile)}th percentile
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full origin-left rounded-full bg-ramp"
          style={{ transform: `scaleX(${Math.max(0.04, percentile / 100)})` }}
        />
      </div>
    </div>
  );
}

function RankRow({
  country,
  metric,
  value,
  max,
  rank,
  active,
  onSelect,
}: {
  country: CountryRecord;
  metric: MetricId;
  value: number;
  max: number;
  rank: number;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const t = max === 0 ? 0 : value / max;
  return (
    <button
      type="button"
      onClick={() => onSelect(country.id)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-[background-color] duration-(--motion-quick) ease-(--ease-out)",
        active ? "bg-accent" : "hover:bg-accent/70",
      )}
    >
      <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
        {rank}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-foreground">{country.name}</span>
        <span className="mt-1 block h-1 origin-left overflow-hidden rounded-full bg-secondary">
          <span
            className="block h-full origin-left rounded-full bg-ramp"
            style={{ transform: `scaleX(${Math.max(0.04, t)})` }}
          />
        </span>
      </span>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
        {formatMetricValue(metric, value)}
      </span>
    </button>
  );
}

function SourceNote({ source }: { source: OwidMetricBlock }) {
  return (
    <div className="mt-4 space-y-1.5">
      <a
        href={source.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-2xs font-medium tracking-caps text-muted-foreground uppercase hover:text-foreground"
      >
        Our World in Data
        {source.latestYear ? ` · ${source.latestYear}` : ""}
        <ArrowUpRight className="size-3" />
      </a>
      <p className="text-2xs leading-relaxed text-muted-foreground">{source.citationShort}</p>
    </div>
  );
}

export function CountryPanel({
  metric,
  mode,
  source,
  snapshot,
  stats,
  selected,
  query,
  onQueryChange,
  matches,
  onSelect,
  onMetricChange,
  plus = false,
  onUnlock,
}: CountryPanelProps) {
  const ranking = selected ? rankOf(stats, selected.id) : null;
  const max = stats.values[0]?.value ?? 0;
  const top = stats.values.slice(0, 8);
  const selectedYear = selected
    ? observationYear(selected.iso3, metric.id, snapshot)
    : null;
  const copy = resolveMetric(metric, mode);
  const kids = mode === "kids";
  const locked = isPlusMetric(metric.id) && !plus;
  const grouped = METRIC_GROUPS.map((group) => ({
    id: group.id,
    label: group.label,
    metrics: metricsInGroup(group.id).filter((item) => (kids ? isKidsMetric(item.id) : true)),
  })).filter((group) => group.metrics.length);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-4 pt-4 pb-3">
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={kids ? "Find a country" : "Search countries"}
          aria-label="Search countries"
          autoComplete="off"
        />
      </div>

      {query.trim() ? (
        <ScrollArea className="min-h-0 flex-1 px-2 pb-4">
          {matches.length === 0 ? (
            <p className="px-3 py-6 text-sm text-muted-foreground">No matching countries.</p>
          ) : (
            <ul className="space-y-0.5">
              {matches.slice(0, 40).map((country) => (
                <li key={country.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(country.id);
                      onQueryChange("");
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-accent"
                  >
                    <span>
                      <span className="block text-sm text-foreground">{country.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {country.region} · {country.iso3}
                      </span>
                    </span>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {formatMetricValue(metric.id, country.values[metric.id])}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>
      ) : selected ? (
        <ScrollArea className="min-h-0 flex-1">
          <div className="px-5 pb-6">
            {kids ? (
              <KidsWordStage
                metric={metric}
                selected={selected}
                onMetricChange={onMetricChange}
              />
            ) : null}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">
                  {selected.region}
                </p>
                <h2 className="font-display mt-1 text-3xl leading-display font-medium tracking-tight text-foreground">
                  {selected.name}
                </h2>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge>{selected.iso3}</Badge>
                  <Badge variant="muted">{selected.id}</Badge>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onSelect(null)}
                aria-label="Clear selection"
              >
                <X />
              </Button>
            </div>

            <div className="mt-6">
              {locked ? (
                <PlusGate metric={metric} onUnlock={() => onUnlock?.()} />
              ) : (
                <>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {copy.label}
              </p>
              <p className="mt-1 font-sans text-3xl leading-none font-medium tracking-tight tabular-nums text-foreground">
                {formatMetricValue(metric.id, selected.values[metric.id])}
              </p>
              {metric.id === "pop" && selected.values.pop != null ? (
                <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">
                  {formatPopulationExact(selected.values.pop)} people
                  {selectedYear ? ` · ${selectedYear}` : ""}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {metric.unit}
                  {selectedYear ? ` · ${selectedYear}` : ""}
                </p>
              )}
                </>
              )}
            </div>

            {locked ? null : ranking ? (
              <div className="mt-5 space-y-3">
                <p className="text-sm text-foreground">
                  Rank{" "}
                  <span className="tabular-nums font-medium">{ranking.rank}</span>
                  <span className="text-muted-foreground"> of {stats.n}</span>
                </p>
                <PercentileBar percentile={ranking.percentile} />
              </div>
            ) : (
              <p className="mt-5 text-sm text-muted-foreground">No figure for this metric.</p>
            )}

            <Separator className="my-6" />

            <p className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">
              All metrics
            </p>
            <div className="mt-3 space-y-4">
              {grouped.map((group) => (
                <div key={group.id}>
                  <p className="px-2 pb-1 text-2xs tracking-caps text-muted-foreground uppercase">
                    {group.label}
                  </p>
                  <dl className="space-y-0.5">
                    {group.metrics.map((item) => {
                      const active = item.id === metric.id;
                      const year = observationYear(selected.iso3, item.id, snapshot);
                      const itemCopy = resolveMetric(item, mode);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => onMetricChange(item.id)}
                          className={cn(
                            "flex w-full items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 text-left",
                            active ? "bg-accent" : "hover:bg-accent/70",
                          )}
                        >
                          <dt className="text-sm text-muted-foreground">{itemCopy.label}</dt>
                          <dd className="text-right text-sm tabular-nums text-foreground">
                            {isPlusMetric(item.id) && !plus ? (
                              <Lock className="inline size-3 text-muted-foreground" />
                            ) : (
                              <>
                            {formatMetricValue(item.id, selected.values[item.id])}
                            {year ? (
                              <span className="ml-1.5 text-2xs font-normal text-muted-foreground">
                                {year}
                              </span>
                            ) : null}
                              </>
                            )}
                          </dd>
                        </button>
                      );
                    })}
                  </dl>
                </div>
              ))}
            </div>

            <SourceNote source={source} />
          </div>
        </ScrollArea>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <div className="px-5 pb-6">
            {kids ? (
              <KidsWordStage
                metric={metric}
                selected={null}
                onMetricChange={onMetricChange}
              />
            ) : null}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe2 className="size-4" />
              <p className="text-xs font-medium tracking-caps uppercase">Overview</p>
            </div>
            <h2 className="font-display mt-2 text-2xl leading-tight font-medium tracking-tight text-foreground">
              {copy.label}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {copy.description}
            </p>
            {locked ? (
              <div className="mt-5">
                <PlusGate metric={metric} onUnlock={() => onUnlock?.()} />
              </div>
            ) : (
              <>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-secondary px-3 py-3">
                <p className="text-2xs text-muted-foreground">Median</p>
                <p className="mt-1 text-sm tabular-nums text-foreground">
                  {formatMetricValue(metric.id, stats.median)}
                </p>
              </div>
              <div className="rounded-xl bg-secondary px-3 py-3">
                <p className="text-2xs text-muted-foreground">Countries</p>
                <p className="mt-1 text-sm tabular-nums text-foreground">{stats.n}</p>
              </div>
            </div>

            <p className="mt-6 text-2xs font-medium tracking-caps text-muted-foreground uppercase">
              Highest
            </p>
            <div className="mt-2">
              {top.map((row, index) => (
                <RankRow
                  key={row.country.id}
                  country={row.country}
                  metric={metric.id}
                  value={row.value}
                  max={max}
                  rank={index + 1}
                  active={false}
                  onSelect={onSelect}
                />
              ))}
            </div>
              </>
            )}
            <SourceNote source={source} />
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
