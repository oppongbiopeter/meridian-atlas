import { Globe2, List, Map, Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MapView } from "@/lib/atlas/types";
import { cn } from "@/lib/utils";

type MapControlsProps = {
  view: MapView;
  onView: (view: MapView) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onOpenList?: () => void;
  hideList?: boolean;
};

export function MapControls({
  view,
  onView,
  onZoomIn,
  onZoomOut,
  onReset,
  onOpenList,
  hideList,
}: MapControlsProps) {
  return (
    <div className="absolute right-3 bottom-16 z-10 flex flex-col gap-2 sm:right-5">
      {onOpenList && !hideList ? (
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="lg:hidden"
          onClick={onOpenList}
          aria-label="Open rankings"
        >
          <List />
        </Button>
      ) : null}
      <div className="flex flex-col overflow-hidden rounded-xl bg-card shadow-[var(--shadow-overlay)]">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-pressed={view === "map"}
          aria-label="Flat map"
          className={cn("rounded-none", view === "map" && "bg-accent")}
          onClick={() => onView("map")}
        >
          <Map />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-pressed={view === "globe"}
          aria-label="Interactive globe"
          className={cn("rounded-none", view === "globe" && "bg-accent")}
          onClick={() => onView("globe")}
        >
          <Globe2 />
        </Button>
      </div>
      <div className="flex flex-col overflow-hidden rounded-xl bg-card shadow-[var(--shadow-overlay)]">
        <Button type="button" variant="ghost" size="icon" onClick={onZoomIn} aria-label="Zoom in" className="rounded-none">
          <Plus />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={onZoomOut} aria-label="Zoom out" className="rounded-none">
          <Minus />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={onReset} aria-label="Reset view" className="rounded-none">
          <RotateCcw />
        </Button>
      </div>
    </div>
  );
}
