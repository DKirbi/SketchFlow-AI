# Portfolio embedding — UX Showcase

This document describes how an **external site** (currently the personal site at `https://davorkirbis.com`, route `/:lang/work/SketchFlowAI`) embeds the UX Showcase (`sketchflow-showcase`).

SketchFlow stays on **its own origin** (`base: '/'`). Do not path-proxy it under davorkirbis.com.

## What gets deployed

From the repo root:

```bash
npm run build:showcase
```

Deploy `demos/sketchflow-showcase/dist/` (or point Vercel at the root [`vercel.json`](../vercel.json)). Custom domain (`portfolio.davorkirbis.com`) is optional later.

Root `vercel.json` sends:

```
Content-Security-Policy: frame-ancestors 'self' https://davorkirbis.com https://www.davorkirbis.com http://localhost:5173 http://127.0.0.1:5173
```

Do not set `X-Frame-Options`. GitHub Pages cannot set this CSP; the Work iframe should use the Vercel origin.

Example project URLs (inside the SketchFlow origin):

```text
https://<sketchflow-origin>/Sportradar/mapping
https://<sketchflow-origin>/Sportradar/merge-tool
https://<sketchflow-origin>/?theme=dark&locale=de
```

`/` redirects to `/Sportradar/merge-tool` and **preserves** `theme` and `locale` query params. Legacy `?slug=mapping` redirects to `/Sportradar/mapping`.

## Host route

The personal site iframes this app from **`/work/SketchFlowAI`** (typically `/:lang/work/SketchFlowAI`) so Work can later hold other non-lo-fi pieces. The iframe `src` is the SketchFlow origin, not a path on davorkirbis.com.

## Appearance contract

The host owns theme and locale. SketchFlow applies what it is told. Standalone visits default to **light + en**. Appearance is not stored in `localStorage`.

| Param | Values | Default |
| --- | --- | --- |
| `theme` | `light` \| `dark` | `light` |
| `locale` | `en` \| `de` \| `sl` | `en` |

Query on first load / language remount. `postMessage` while staying on Work so theme toggles without remounting the iframe.

### Host → iframe

```js
iframe.contentWindow.postMessage(
  { type: 'showcase:set-appearance', version: 1, theme: 'dark', locale: 'de' },
  'https://<sketchflow-origin>',
);
```

Always send both `theme` and `locale`. Target origin must be the SketchFlow origin, never `*`.

SketchFlow accepts messages only from:

- `https://davorkirbis.com`
- `https://www.davorkirbis.com`
- `http://localhost:5173`
- `http://127.0.0.1:5173`

plus optional extras in `VITE_EMBED_ALLOWED_ORIGINS` (comma-separated). The app never uses an empty allow-list.

### iframe → host

```js
{ type: 'showcase:appearance-applied', version: 1, theme: 'dark', locale: 'de' }
```

Posted to `event.origin` of the host that sent the snapshot.

## Translation scope

Translated: hub chrome, prototype brief band (summaries / pattern blurbs), visitor-facing Storybook docs (`docs/locales/{de,sl}/` with English fallback).

Not translated: project titles, company names, mock catalogues (films, Harry Potter, bracket entities), in-prototype operator UI, agent-only docs.

## Iframe markup

```html
<iframe
  src="https://<sketchflow-origin>/?theme=dark&locale=de"
  title="SketchFlowAI Showcase"
  loading="eager"
  style="width: 100%; height: 100%; border: 0;"
></iframe>
```

Keep the SketchFlow hub sidebar visible. Do not `sandbox` the iframe.

See the reference host page at [`demos/sketchflow-showcase/host-fixture/index.html`](../demos/sketchflow-showcase/host-fixture/index.html).

## Adding a new SPA example

1. Create `demos/sketchflow-showcase/src/examples/<slug>/` with metadata + example component.
2. Register in `src/examples/registry.ts`.
3. Add a `spa` entry under Sportradar in `src/hub/catalog.ts`.
4. Embed with `/Sportradar/<slug>`.

## Mapping example

- **Path:** `/Sportradar/mapping`
- **Patterns:** P2.2, P3, P9

## Merge Tool example

- **Path:** `/Sportradar/merge-tool`
- **Patterns:** P2 / P2.3, P2.5 / P8, P5 / P6, P7

## Local development

```bash
npm run build:showcase   # portfolio static tree
npm run dev              # UX Showcase at http://127.0.0.1:5172/
# open http://127.0.0.1:5172/?theme=dark&locale=de
```

Host fixture (open after the gateway is up):

```text
demos/sketchflow-showcase/host-fixture/index.html
```
