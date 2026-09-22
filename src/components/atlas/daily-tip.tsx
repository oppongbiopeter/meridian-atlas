import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DailyTip } from "@/lib/atlas/tips";

type DailyTipCardProps = {
  tip: DailyTip;
  onDismiss: () => void;
};

export function DailyTipCard({ tip, onDismiss }: DailyTipCardProps) {
  return (
    <aside
      className="pointer-events-auto absolute top-3 left-3 z-20 w-[min(18.5rem,calc(100%-5.5rem))] rounded-2xl bg-card/95 p-3 shadow-[var(--shadow-overlay)] sm:left-5"
      role="status"
      aria-label="Tip of the day"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-2xs font-medium tracking-caps text-muted-foreground uppercase">
          Today
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Dismiss tip"
          onClick={onDismiss}
        >
          <X />
        </Button>
      </div>
      <p className="font-display text-base leading-snug font-medium tracking-tight">{tip.title}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tip.body}</p>
    </aside>
  );
}
