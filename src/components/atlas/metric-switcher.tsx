import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Lock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  isPlusMetric,
  METRIC_BY_ID,
  METRIC_GROUPS,
  metricsInGroup,
  resolveMetric,
  searchMetrics,
  visibleMetrics,
} from "@/lib/atlas/metrics";
import type { AtlasMode, CountryRecord, MetricDef, MetricId } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

type MetricSwitcherProps = {
  value: MetricId;
  mode: AtlasMode;
  plus?: boolean;
  onChange: (id: MetricId) => void;
  countries?: CountryRecord[];
  onPickCountry?: (id: string) => void;
};

export function MetricSwitcher({
  value,
  mode,
  plus = false,
  onChange,
  countries = [],
  onPickCountry,
}: MetricSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const active = METRIC_BY_ID[value];
  const display = resolveMetric(active, mode);

  const metricHits = useMemo(() => searchMetrics(query, mode).slice(0, 8), [query, mode]);
  const countryHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2 || !onPickCountry) return [];
    return countries
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.iso3.toLowerCase().includes(q),
      )
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 6);
  }, [query, countries, onPickCountry]);

  const groups = useMemo(() => {
    const pool = new Set(visibleMetrics(mode).map((m) => m.id));
    return METRIC_GROUPS.map((group) => ({
      ...group,
      metrics: metricsInGroup(group.id).filter((m) => pool.has(m.id)),
    })).filter((g) => g.metrics.length);
  }, [mode]);

  useEffect(() => {
    if (!open && !searchOpen) return;
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !searchRef.current?.contains(target)) {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, searchOpen]);

  const pickMetric = (id: MetricId) => {
    onChange(id);
    setOpen(false);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <div className="flex min-w-0 max-w-full items-center gap-2">
      <div ref={rootRef} className="relative shrink-0">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Choose metric"
          onClick={() => {
            setOpen((v) => !v);
            setSearchOpen(false);
          }}
          className="flex h-11 max-w-[9.5rem] items-center gap-2 rounded-xl bg-secondary px-3 text-sm font-medium tracking-tight text-foreground sm:max-w-[14rem] sm:px-3.5"
        >
          <span className="truncate">{display.label}</span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-(--motion-quick) ease-(--ease-out)",
              open && "rotate-180",
            )}
          />
        </button>

        {open ? (
          <div
            role="listbox"
            aria-label="Metrics"
            className="absolute top-[calc(100%+8px)] right-0 z-40 max-h-[min(70vh,28rem)] w-[min(100vw-1.5rem,42rem)] overflow-y-auto rounded-2xl bg-popover p-3 shadow-[var(--shadow-overlay)] sm:right-auto sm:left-0 sm:w-[42rem]"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              {groups.map((group) => (
                <MetricColumn
                  key={group.id}
                  heading={group.label}
                  metrics={group.metrics}
                  value={value}
                  mode={mode}
                  plus={plus}
                  onChange={pickMetric}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div ref={searchRef} className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchOpen(true);
            setOpen(false);
          }}
          onFocus={() => {
            setSearchOpen(true);
            setOpen(false);
          }}
          placeholder="Search metrics or places"
          aria-label="Search metrics or places"
          className="h-11 rounded-xl pl-9"
        />
        {searchOpen && query.trim() ? (
          <div
            role="listbox"
            aria-label="Search results"
            className="absolute top-[calc(100%+8px)] right-0 left-0 z-50 max-h-[min(60vh,22rem)] overflow-y-auto rounded-2xl bg-popover p-2 shadow-[var(--shadow-overlay)] sm:w-full"
          >
            {metricHits.length === 0 && countryHits.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">Nothing matches.</p>
            ) : (
              <>
                {metricHits.length ? (
                  <p className="px-2 pt-1 pb-1 text-2xs font-medium tracking-caps text-muted-foreground uppercase">
                    Metrics
                  </p>
                ) : null}
                {metricHits.map((metric) => (
                  <SearchRow
                    key={metric.id}
                    selected={metric.id === value}
                    title={resolveMetric(metric, mode).label}
                    detail={isPlusMetric(metric.id) && !plus ? "Plus" : resolveMetric(metric, mode).short}
                    onClick={() => pickMetric(metric.id)}
                  />
                ))}
                {countryHits.length ? (
                  <p className="px-2 pt-2 pb-1 text-2xs font-medium tracking-caps text-muted-foreground uppercase">
                    Places
                  </p>
                ) : null}
                {countryHits.map((country) => (
                  <SearchRow
                    key={country.id}
                    selected={false}
                    title={country.name}
                    detail={country.region}
                    onClick={() => {
                      onPickCountry?.(country.id);
                      setSearchOpen(false);
                      setQuery("");
                    }}
                  />
                ))}
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SearchRow({
  title,
  detail,
  selected,
  onClick,
}: {
  title: string;
  detail: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        "flex w-full items-baseline justify-between gap-3 rounded-lg px-2 py-2 text-left text-sm",
        selected ? "bg-primary text-primary-foreground" : "hover:bg-accent",
      )}
    >
      <span className="truncate">{title}</span>
      <span className={cn("shrink-0 text-2xs", selected ? "text-primary-foreground/70" : "text-muted-foreground")}>
        {detail}
      </span>
    </button>
  );
}

function MetricColumn({
  heading,
  metrics,
  value,
  mode,
  plus,
  onChange,
}: {
  heading: string;
  metrics: MetricDef[];
  value: MetricId;
  mode: AtlasMode;
  plus: boolean;
  onChange: (id: MetricId) => void;
}) {
  return (
    <div>
      <p className="px-2 pb-1.5 text-2xs font-medium tracking-caps text-muted-foreground uppercase">
        {heading}
      </p>
      <div className="flex flex-col">
        {metrics.map((metric) => {
          const selected = metric.id === value;
          const copy = resolveMetric(metric, mode);
          const gated = isPlusMetric(metric.id) && !plus;
          return (
            <button
              key={metric.id}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onChange(metric.id)}
              className={cn(
                "rounded-lg px-2 py-2 text-left text-sm tracking-tight transition-colors duration-(--motion-quick) ease-(--ease-out)",
                selected
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent",
              )}
            >
              <span className="flex items-center gap-1.5">
                {copy.short}
                {gated ? <Lock className="size-3 opacity-70" /> : null}
              </span>
              <span
                className={cn(
                  "mt-0.5 block text-2xs font-normal",
                  selected ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                {copy.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
