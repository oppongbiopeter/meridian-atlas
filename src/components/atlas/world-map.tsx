import {
  Component,
  forwardRef,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  geoArea,
  geoCentroid,
  geoEqualEarth,
  geoGraticule10,
  geoOrthographic,
  geoPath,
  type GeoProjection,
} from "d3-geo";
import { select } from "d3-selection";
import { zoom as d3zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import "d3-transition";
import { displayName, loadCountryFeatures, type CountryFeature } from "@/lib/atlas/geo";
import type { AtlasMode, MapView } from "@/lib/atlas/types";
import type { GlobeHandle } from "@/components/atlas/globe-3d";

const Globe3D = lazy(() =>
  import("@/components/atlas/globe-3d").then((mod) => ({ default: mod.Globe3D })),
);

function supportsWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: false });
    if (!gl || typeof gl !== "object" || !("getParameter" in gl)) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

class GlobeGuard extends Component<{ onFail: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFail();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export type MapHandle = {
  reset: () => void;
  zoomBy: (factor: number) => void;
  focusCountry: (id: string) => void;
};

type WorldMapProps = {
  view: MapView;
  mode?: AtlasMode;
  fillOf: (id: string) => string;
  selectedId: string | null;
  hoveredId: string | null;
  pulse?: { id: string; kind: "yes" | "no" } | null;
  autoFocus?: boolean;
  onSelect: (id: string | null) => void;
  onHover: (payload: { id: string; x: number; y: number } | null) => void;
};

const PAD = 28;

function reducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function visualCenter(feature: CountryFeature): [number, number] | null {
  const geom = feature.geometry;
  if (!geom) return null;
  if (geom.type === "MultiPolygon") {
    let best: number[][][] | null = null;
    let bestArea = -Infinity;
    for (const poly of geom.coordinates) {
      const area = Math.abs(geoArea({ type: "Polygon", coordinates: poly }));
      if (area > bestArea) {
        bestArea = area;
        best = poly;
      }
    }
    if (best) {
      const c = geoCentroid({ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: best } });
      if (Number.isFinite(c[0]) && Number.isFinite(c[1])) return [c[0], c[1]];
    }
  }
  const c = geoCentroid(feature);
  if (Number.isFinite(c[0]) && Number.isFinite(c[1])) return [c[0], c[1]];
  return null;
}

export const WorldMap = forwardRef<MapHandle, WorldMapProps>(function WorldMap(
  { view, mode = "atlas", fillOf, selectedId, hoveredId, pulse, autoFocus = true, onSelect, onHover },
  ref,
) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const projectionRef = useRef<GeoProjection | null>(null);
  const dragRef = useRef<{ x: number; y: number; rot: [number, number]; moved: boolean } | null>(null);
  const rotationRef = useRef<[number, number]>([-20, -18]);
  const globeHandle = useRef<GlobeHandle | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [rotation, setRotation] = useState<[number, number]>([-20, -18]);
  const [mounted, setMounted] = useState(false);
  const [globeFailed, setGlobeFailed] = useState(false);
  const webglRef = useRef<boolean | null>(null);
  if (mounted && webglRef.current === null) webglRef.current = supportsWebGL();
  const show3d = view === "globe" && mounted && !globeFailed && webglRef.current === true;

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = useMemo(() => loadCountryFeatures(), []);
  const featuresById = useMemo(() => {
    const map = new Map<string, CountryFeature>();
    for (const f of features) map.set(f.id, f);
    return map;
  }, [features]);

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  const layout = useMemo(() => {
    const { width, height } = size;
    if (width < 16 || height < 16) return null;
    const extent: [[number, number], [number, number]] = [
      [PAD, PAD * 0.45],
      [width - PAD, height - PAD * 1.35],
    ];
    const projection =
      view === "globe"
        ? geoOrthographic()
            .precision(0.4)
            .rotate([rotation[0], rotation[1], 0])
            .clipAngle(90)
            .fitExtent(extent, { type: "Sphere" })
        : geoEqualEarth().precision(0.5).fitExtent(extent, { type: "Sphere" });
    const path = geoPath(projection);
    projectionRef.current = projection;
    const sphere = { type: "Sphere" as const };
    return {
      path,
      sphereD: path(sphere) ?? "",
      graticuleD: path(geoGraticule10()) ?? "",
    };
  }, [size, view, rotation]);

  const animateTransform = useCallback((transform: typeof zoomIdentity, ms = 700) => {
    const svg = svgRef.current;
    const zoom = zoomRef.current;
    if (!svg || !zoom) return;
    const sel = select(svg);
    if (ms === 0 || reducedMotion()) {
      sel.call(zoom.transform, transform);
    } else {
      sel.transition().duration(ms).call(zoom.transform, transform);
    }
  }, []);

  const reset = useCallback(() => {
    animateTransform(zoomIdentity);
    if (view === "globe") setRotation([-20, -18]);
  }, [animateTransform, view]);

  const zoomBy = useCallback((factor: number) => {
    const svg = svgRef.current;
    const zoom = zoomRef.current;
    if (!svg || !zoom) return;
    const sel = select(svg);
    if (reducedMotion()) sel.call(zoom.scaleBy, factor);
    else sel.transition().duration(220).call(zoom.scaleBy, factor);
  }, []);

  const focusCountry = useCallback(
    (id: string) => {
      const feature = featuresById.get(id);
      if (!feature || size.width < 16) return;
      if (view === "globe") {
        const center = visualCenter(feature);
        if (center) setRotation([-center[0], -center[1]]);
        return;
      }
      const path = layout?.path;
      if (!path) return;
      const [[x0, y0], [x1, y1]] = path.bounds(feature);
      const w = x1 - x0;
      const h = y1 - y0;
      if (w < 0.5 && h < 0.5) return;
      const margin = 64;
      const k = Math.min(
        5.5,
        0.62 / Math.max(w / Math.max(size.width - margin * 2, 1), h / Math.max(size.height - margin * 2, 1)),
      );
      animateTransform(
        zoomIdentity
          .translate(size.width / 2, size.height / 2)
          .scale(k)
          .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      );
    },
    [animateTransform, featuresById, layout, size, view],
  );

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        if (show3d) globeHandle.current?.reset();
        else reset();
      },
      zoomBy: (factor: number) => {
        if (show3d) globeHandle.current?.zoomBy(factor);
        else zoomBy(factor);
      },
      focusCountry: (id: string) => {
        if (show3d) globeHandle.current?.focusCountry(id);
        else focusCountry(id);
      },
    }),
    [reset, zoomBy, focusCountry, show3d],
  );

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

  useEffect(() => {
    const svg = svgRef.current;
    const g = gRef.current;
    if (!svg || !g) return;
    const zoom = d3zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, view === "globe" ? 4 : 10])
      .clickDistance(6)
      .filter((event) => {
        if (view === "globe") {
          if (event instanceof WheelEvent) return true;
          if (window.TouchEvent && event instanceof TouchEvent) return event.touches.length > 1;
          return false;
        }
        return !event.ctrlKey;
      })
      .on("zoom", (event) => {
        g.setAttribute("transform", event.transform.toString());
      });
    zoomRef.current = zoom;
    const sel = select(svg);
    sel.call(zoom);
    sel.on("dblclick.zoom", null);
    sel.call(zoom.transform, zoomIdentity);
    return () => {
      sel.on(".zoom", null);
      zoomRef.current = null;
    };
  }, [layout, view]);

  const prevSelected = useRef<string | null>(null);
  useEffect(() => {
    if (show3d) return;
    if (!autoFocus) {
      prevSelected.current = selectedId;
      return;
    }
    if (selectedId === prevSelected.current) return;
    prevSelected.current = selectedId;
    if (selectedId) focusCountry(selectedId);
    else reset();
  }, [selectedId, focusCountry, reset, autoFocus, show3d]);

  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (view !== "globe") return;
    dragRef.current = {
      x: event.clientX,
      y: event.clientY,
      rot: rotationRef.current,
      moved: false,
    };
  };

  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current;
    if (!drag || view !== "globe") return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > 4) drag.moved = true;
    if (!drag.moved) return;
    setRotation([
      drag.rot[0] + dx * 0.35,
      Math.max(-80, Math.min(80, drag.rot[1] - dy * 0.3)),
    ]);
  };

  const onPointerUp = () => {
    window.setTimeout(() => {
      dragRef.current = null;
    }, 0);
  };

  const showFlat = view === "map" || !show3d;

  return (
    <div ref={wrapRef} className="absolute inset-0 bg-ocean">
      {show3d ? (
        <GlobeGuard onFail={() => setGlobeFailed(true)}>
          <Suspense fallback={null}>
            <Globe3D
              mode={mode}
              fillOf={fillOf}
              selectedId={selectedId}
              pulse={pulse}
              autoFocus={autoFocus}
              onSelect={onSelect}
              onHover={onHover}
              globeRef={globeHandle}
            />
          </Suspense>
        </GlobeGuard>
      ) : null}
      {showFlat && layout ? (
        <svg
          ref={svgRef}
          role="img"
          aria-label="Choropleth world map"
          className="block h-full w-full touch-none"
          viewBox={`0 0 ${size.width} ${size.height}`}
          onPointerLeave={() => {
            onHover(null);
            onPointerUp();
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={(event) => {
            if (dragRef.current?.moved) return;
            const target = event.target as SVGElement;
            if (!target.closest("[data-country]")) onSelect(null);
          }}
        >
          <g ref={gRef}>
            <path d={layout.sphereD} className="fill-ocean" />
            <path
              d={layout.graticuleD}
              className="fill-none stroke-graticule"
              style={{ strokeWidth: 0.6, vectorEffect: "non-scaling-stroke" }}
            />
            {features.map((feature) => {
              const d = layout.path(feature);
              if (!d) return null;
              const isSelected = feature.id === selectedId;
              const isHovered = feature.id === hoveredId;
              const kind = pulse?.id === feature.id ? pulse.kind : undefined;
              return (
                <path
                  key={feature.id}
                  data-country={feature.id}
                  data-pulse={kind}
                  d={d}
                  className="atlas-path"
                  fill={fillOf(feature.id)}
                  data-hover={isHovered && !isSelected ? "true" : undefined}
                  data-selected={isSelected ? "true" : undefined}
                  tabIndex={-1}
                  aria-label={displayName(feature)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "touch") return;
                    onHover({ id: feature.id, x: event.clientX, y: event.clientY });
                  }}
                  onPointerMove={(event) => {
                    if (event.pointerType === "touch") return;
                    onHover({ id: feature.id, x: event.clientX, y: event.clientY });
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (dragRef.current?.moved) return;
                    onSelect(feature.id);
                  }}
                />
              );
            })}
            <path
              d={layout.sphereD}
              className="pointer-events-none fill-none stroke-sphere"
              style={{ strokeWidth: 1.1, vectorEffect: "non-scaling-stroke" }}
            />
          </g>
        </svg>
      ) : null}
    </div>
  );
});
