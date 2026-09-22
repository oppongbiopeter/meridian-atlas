# Meridian

Choropleth world atlas with kids mode, 3D globe, quiz, Plus metrics, search, recents, and local-language pronunciation.

## Download

- **Source zip (this repo):** https://github.com/oppongbiopeter/meridian-atlas/archive/refs/heads/main.zip
- **HTML preview:** open `meridian-preview.html` in any browser.
- Raw HTML: https://raw.githubusercontent.com/oppongbiopeter/meridian-atlas/main/meridian-preview.html

## Run

```bash
npm install
npm run dev
```

Vite + React 19 + TypeScript. Entry: `src/routes/index.tsx` → AtlasApp.

Kids mode has no mature/crime/conflict metrics. Plus metrics are gated in-app.

## Layout

| Area | Path |
|---|---|
| App shell | `src/components/atlas/atlas-app.tsx` |
| Flat map | `src/components/atlas/world-map.tsx` |
| 3D globe | `src/components/atlas/globe-3d.tsx` |
| Plus gate | `src/components/atlas/plus-gate.tsx` |
| Metrics | `src/lib/atlas/metrics.ts` |
| Quiz | `src/lib/atlas/quiz.ts` |
| Speech | `src/lib/atlas/speak.ts` |
| Data | `src/data/owid-snapshot.json` |
