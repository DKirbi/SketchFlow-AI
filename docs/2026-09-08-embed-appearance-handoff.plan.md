---
name: Embed appearance handoff
overview: "Phase 2 (host-driven theme/locale + publish headers) is implemented on feat/embed-appearance. Next work is PR/merge, Vercel deploy, live iframe QA, and Phase 3 in react-website. Do not re-implement Phase 2."
todos:
  - id: live-qa
    content: Smoke-test hub + nested embeds with ?theme=dark&locale=de and the host fixture
    status: pending
  - id: pr-merge
    content: Review and merge feat/embed-appearance into main (do not force-push main)
    status: pending
  - id: vercel-deploy
    content: Deploy SketchFlow via npm run build:showcase / root vercel.json (not GitHub Pages)
    status: pending
  - id: phase3-host
    content: In react-website, add /:lang/work/SketchFlowAI iframe + query + postMessage
    status: pending
  - id: locale-docs-optional
    content: Optionally finish DE/SL visitor-doc prose (English fallback already works)
    status: pending
isProject: false
---

# Embed appearance — progress handoff (Phase 2 done)

**Audience:** another agent continuing after Phase 2.  
**Do not** re-implement SketchFlow theme/locale/CSP unless a gap is proven.  
**Do not** edit `docs/UX_PATTERNS.md` / agent-only English sources except adding locale siblings.

## Where the work is

- **Branch:** `feat/embed-appearance` (from `origin/main`).
- **This repo:** SketchFlow-AI. Phase 2 only.
- **Out of this repo:** Phase 3 lives in **`react-website`** (personal site).

SketchFlow `base` stays `'/'`. Do not path-proxy under davorkirbis.com.

## What Phase 2 already shipped

Contract: `docs/PORTFOLIO_EMBEDDING.md`. Design notes (optional, may still be untracked on `main`): `docs/2026-09-08-work-sketchflow-embed-design.md`.

### Appearance

- Host owns theme (`light` | `dark`) and locale (`en` | `de` | `sl`). Standalone default: **light + en**. No `localStorage`. No site `color-scheme` key.
- Query `?theme=&locale=` on first paint / remount. `/` → `/Sportradar/merge-tool` **keeps** those params.
- `postMessage` `{ type: 'showcase:set-appearance', version: 1, theme, locale }` for live theme toggle. Reply `showcase:appearance-applied` to `event.origin`, never `*`.
- Allow-list: `https://davorkirbis.com`, `https://www.davorkirbis.com`, `http://localhost:5173`, `http://127.0.0.1:5173`, plus optional `VITE_EMBED_ALLOWED_ORIGINS`. App never uses an empty list. Empty list **rejects** (does not allow-all).
- Hub sidebar stays visible when `window.parent !== window`.

### Theme (LOFI invert)

- Sass `$color-*` → `var(--lofi-*)`. Light on `:root`, inverted grayscale on `html[data-theme="dark"]` / `html.dark`.
- `applyLofiTheme`, `bootEmbeddedLofiTheme`, `useLofiCssVar` exported from `lofi-kit`.
- Nested embeds: theme on iframe `src`, FOUC in each `index.html`, same-origin listener in embed `main.tsx`.
- Bracket-demo: Tailwind **color only** (`lofi-theme.css` `@theme` aliases). BEM layout unchanged. `#1a6bcb` drag-focus left. React Flow Background/MiniMap via `useLofiCssVar`.
- Storybook preview/manager chrome uses `--lofi-*`; dark manager theme; FOUC; manager forwards appearance into the preview iframe.

### Locale

**Translated:** hub chrome, brief band (`summary` / `brief` / `patternSummaries`; **titles stay English**), visitor Storybook docs, hub Storybook **group** labels.

**Not translated:** project titles, `Sportradar`, mock catalogues, in-prototype operator UI, agent-only docs.

Loaders: `lib/stories/docMarkdown.ts`, `docs/locales/{de,sl}/*.md`, English fallback. DE/SL body copy is still mostly English under translated headings (incremental, by design).

### Publish

- Root `vercel.json`: `Content-Security-Policy: frame-ancestors 'self' https://davorkirbis.com https://www.davorkirbis.com http://localhost:5173 http://127.0.0.1:5173`. No `X-Frame-Options`.
- Host fixture: `demos/sketchflow-showcase/host-fixture/index.html` → `http://127.0.0.1:5172/?theme=dark&locale=de` + theme toggle `postMessage` with `targetOrigin = http://127.0.0.1:5172`.
- Tests: protocol parse/reject, query preserve, German hub chrome/brief, doc loader DE pick, `applyLofiTheme` `data-theme`, button tokens accept `var(--lofi-*)`.
- Last verification: `npm run test:all` (516 tests) and `npm run build:showcase` passed.

## Key files

| Area | Path |
|---|---|
| Protocol | `demos/sketchflow-showcase/src/runtime/protocol.ts` |
| Hub appearance | `demos/sketchflow-showcase/src/appearance/` |
| Redirects | `demos/sketchflow-showcase/src/App.tsx` |
| Embed iframe | `demos/sketchflow-showcase/src/hub/ProjectPage.tsx` |
| Tokens | `lib/src/styles/index.scss`, `lib/src/theme/` |
| Docs i18n | `lib/stories/docMarkdown.ts`, `docs/locales/` |
| Bracket colors | `demos/bracket-demo/src/lofi-theme.css`, `App.css` |
| Headers | `vercel.json` |
| Host contract | `docs/PORTFOLIO_EMBEDDING.md` |

## Next work (do this, in order)

### 1. Live QA (this repo)

```bash
npm run dev
# http://127.0.0.1:5172/?theme=dark&locale=de
# file: demos/sketchflow-showcase/host-fixture/index.html
```

Expect: German hub chrome + brief band; titles/Sportradar/films/Potter still English; inverted LOFI + bracket canvas (dots/minimap); Storybook docs not stuck on `#fff`/`#111`; sidebar visible; `/` keeps query params.

### 2. Merge

PR `feat/embed-appearance` → `main`. Do not push unreviewed work straight onto `main`.

### 3. Deploy SketchFlow

`npm run build:showcase`. Point Vercel at repo root `vercel.json` / `demos/sketchflow-showcase/dist`. **Not GitHub Pages** (cannot set `frame-ancestors`).

### 4. Phase 3 — `react-website` (new repo)

Create **`/:lang/work/SketchFlowAI`**. Iframe the **Vercel SketchFlow origin** (not a path on davorkirbis.com).

On load / language remount: `src="https://<sketchflow-origin>/?theme=<light|dark>&locale=<en|de|sl>"`.

On theme toggle without remount:

```js
iframe.contentWindow.postMessage(
  { type: 'showcase:set-appearance', version: 1, theme, locale },
  'https://<sketchflow-origin>',
);
```

Always send both `theme` and `locale`. Never `targetOrigin: '*'`. Do not use the site’s `color-scheme` `localStorage` key inside SketchFlow.

### 5. Optional later

- Finish DE/SL prose in `docs/locales/` (loader already falls back to English).
- Custom domain for SketchFlow (optional).
- Hi-fi `notifications-overview-hifi` is still out of `build:showcase`.

## Negative scope

- Do not translate mock data, titles, company names, or operator UI.
- Do not add SketchFlow-owned theme/locale chrome for standalone visits.
- Do not set SketchFlow `base` to a path under davorkirbis.com.
- Do not rewrite bracket-demo layout CSS to Tailwind utilities.
- Do not rewrite every Storybook story’s inline hex in this stream.
