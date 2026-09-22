import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MetricDef } from "@/lib/atlas/types";

type PlusGateProps = {
  metric: MetricDef;
  onUnlock: () => void;
};

export function PlusGate({ metric, onUnlock }: PlusGateProps) {
  return (
    <div className="rounded-2xl bg-secondary p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Lock className="size-4" />
        <p className="text-2xs font-medium tracking-caps uppercase">Meridian Plus</p>
      </div>
      <h3 className="font-display mt-2 text-xl leading-tight font-medium tracking-tight">
        {metric.label} is a Plus metric
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Crime, conflict, prisons, disasters, and sport sit behind a paywall. Kids
        mode never shows mature series. This demo unlocks Plus on this device.
      </p>
      <Button type="button" className="mt-4 w-full" onClick={onUnlock}>
        Unlock Plus (demo)
      </Button>
    </div>
  );
}
