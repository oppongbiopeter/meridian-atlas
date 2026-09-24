import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { geoCentroid } from "d3-geo";
import { loadCountryFeatures, type CountryFeature } from "@/lib/atlas/geo";
import type { AtlasMode } from "@/lib/atlas/types";

export type GlobeHandle = {
  reset: () => void;
  zoomBy: (factor: number) => void;
  focusCountry: (id: string) => void;
};

type Globe3DProps = {
  mode: AtlasMode;
  fillOf: (id: string) => string;
  selectedId: string | null;
  pulse?: { id: string; kind: "yes" | "no" } | null;
  autoFocus?: boolean;
  onSelect: (id: string | null) => void;
  onHover: (payload: { id: string; x: number; y: number } | null) => void;
  globeRef?: React.MutableRefObject<GlobeHandle | null>;
};

type GlobeApi = {
  pointOfView: (pov?: { lat?: number; lng?: number; altitude?: number }, ms?: number) => {
    lat: number;
    lng: number;
    altitude: number;
  };
};

function visualCenter(feature: CountryFeature): [number, number] | null {
  const c = geoCentroid(feature);
  if (Number.isFinite(c[0]) && Number.isFinite(c[1])) return [c[0], c[1]];
  return null;
}

function oceanUrl() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const g = ctx.createLinearGradient(0, 0, 0, 512);
  g.addColorStop(0, "#14202c");
  g.addColorStop(0.5, "#0c1016");
  g.addColorStop(1, "#141820");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 1024, 512);
  return canvas.toDataURL("image/png");
}

export function Globe3D({
  mode,
  fillOf,
  selectedId,
  pulse,
  autoFocus = true,
  onSelect,
  onHover,
  globeRef,
}: Globe3DProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<GlobeApi | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [texture] = useState(oceanUrl);
  const drag = useRef(false);
  const ptr = useRef({ x: 0, y: 0 });

  const features = useMemo(() => loadCountryFeatures(), []);
  const byId = useMemo(() => {
    const map = new Map<string, CountryFeature>();
    for (const f of features) map.set(f.id, f);
    return map;
  }, [features]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    ro.observe(wrap);
    setSize({ width: wrap.clientWidth, height: wrap.clientHeight });
    return () => ro.disconnect();
  }, []);

  const reset = useCallback(() => {
    apiRef.current?.pointOfView({ lat: 12, lng: 18, altitude: 2.15 }, 700);
  }, []);

  const zoomBy = useCallback((factor: number) => {
    const api = apiRef.current;
    if (!api) return;
    const now = api.pointOfView();
    const next = Math.min(4.2, Math.max(0.45, now.altitude / factor));
    api.pointOfView({ altitude: next }, 220);
  }, []);

  const focusCountry = useCallback(
    (id: string) => {
      const feature = byId.get(id);
      if (!feature) return;
      const center = visualCenter(feature);
      if (!center) return;
      apiRef.current?.pointOfView({ lat: center[1], lng: center[0], altitude: 1.35 }, 800);
    },
    [byId],
  );

  useEffect(() => {
    if (!globeRef) return;
    globeRef.current = { reset, zoomBy, focusCountry };
    return () => {
      globeRef.current = null;
    };
  }, [globeRef, reset, zoomBy, focusCountry]);

  const prev = useRef<string | null>(null);
  useEffect(() => {
    if (!autoFocus) {
      prev.current = selectedId;
      return;
    }
    if (selectedId === prev.current) return;
    prev.current = selectedId;
    if (selectedId) focusCountry(selectedId);
    else reset();
  }, [selectedId, autoFocus, focusCountry, reset]);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 bg-ocean"
      onPointerDown={() => {
        drag.current = false;
      }}
      onPointerMove={(event) => {
        ptr.current = { x: event.clientX, y: event.clientY };
        if (event.buttons) drag.current = true;
      }}
    >
      {size.width > 8 ? (
        <Globe
          ref={apiRef as never}
          width={size.width}
          height={size.height}
          rendererConfig={{
            antialias: false,
            alpha: true,
            failIfMajorPerformanceCaveat: false,
            powerPreference: "low-power",
          }}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={texture}
          atmosphereColor={mode === "kids" ? "#f0c14a" : "#3b8880"}
          atmosphereAltitude={mode === "kids" ? 0.22 : 0.16}
          polygonsData={features}
          polygonGeoJsonGeometry="geometry"
          polygonCapColor={(d) => {
            const f = d as CountryFeature;
            if (pulse?.id === f.id) return pulse.kind === "yes" ? "#d5f0e8" : "#b4554a";
            return fillOf(f.id);
          }}
          polygonSideColor={() => (mode === "kids" ? "rgba(36,48,106,0.85)" : "rgba(12,16,22,0.9)")}
          polygonStrokeColor={() => "rgba(9,11,14,0.55)"}
          polygonAltitude={(d) => {
            const f = d as CountryFeature;
            if (pulse?.id === f.id) return 0.028;
            if (f.id === selectedId) return 0.016;
            return 0.006;
          }}
          polygonsTransitionDuration={180}
          onPolygonHover={(d) => {
            const f = d as CountryFeature | null;
            if (!f) {
              onHover(null);
              return;
            }
            onHover({ id: f.id, x: ptr.current.x, y: ptr.current.y });
          }}
          onPolygonClick={(d, _ev, coords) => {
            if (drag.current) return;
            const f = d as CountryFeature;
            onSelect(f.id);
            const evt = coords as { x?: number; y?: number } | undefined;
            if (evt?.x != null && evt?.y != null) onHover({ id: f.id, x: evt.x, y: evt.y });
          }}
          onGlobeClick={() => {
            if (!drag.current) onSelect(null);
          }}
        />
      ) : null}
      <span className="sr-only">Interactive 3D globe. Drag to turn. Click a country.</span>
    </div>
  );
}
