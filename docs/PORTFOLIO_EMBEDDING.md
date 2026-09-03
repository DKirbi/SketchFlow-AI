# Portfolio embedding — UX Showcase

This document describes how an **external resume website** embeds lo-fi interaction examples from the UX Showcase (`sketchflow-showcase`).

## What gets deployed

From the repo root:

```bash
npm run build:showcase
```

Deploy `demos/sketchflow-showcase/dist/` (or point Vercel at the root [`vercel.json`](../vercel.json)). Later you can attach `portfolio.davorkirbis.com`.

Example project URLs:

```text
https://your-domain.com/Sportradar/mapping
https://your-domain.com/Sportradar/merge-tool
https://your-domain.com/Sportradar/bracket-demo
```

Legacy `?slug=mapping` redirects to `/Sportradar/mapping`.

No npm publish step is required. Vite bundles `lofi-kit` into the static output; curated embeds live under `/embeds/`.

## Resume integration pattern

1. Add a small **project dot** (or button) next to each experience card.
2. On click, **expand an inline panel** beneath the experience.
3. Render an **iframe** pointing at the showcase URL for that example.
4. Optionally mirror the iframe toggle: **Interact with prototype** stops automation and hands control to the visitor; **Automate** restarts the preview sequence.

See the reference host page at [`demos/sketchflow-showcase/host-fixture/index.html`](../demos/sketchflow-showcase/host-fixture/index.html).

## Iframe markup

```html
<iframe
  src="https://your-domain.com/Sportradar/mapping"
  title="Value Mapping interaction example"
  loading="lazy"
  style="width: 100%; min-height: 520px; border: 1px solid #ddd;"
></iframe>
```

## postMessage protocol (v1)

All messages include `{ version: 1 }`.

### Host → iframe

| type                         | Purpose                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `showcase:start-interactive` | Stop preview automation; reset example; hand control to visitor              |
| `showcase:replay`            | Reset and replay the automated preview sequence (iframe label: **Automate**) |

```js
iframe.contentWindow.postMessage(
  { type: 'showcase:start-interactive', version: 1 },
  'https://your-showcase-origin.example',
);
```

### iframe → host

| type                            | Purpose                                                      |
| ------------------------------- | ------------------------------------------------------------ |
| `showcase:ready`                | Example loaded; includes `slug`                              |
| `showcase:preview-complete`     | Automated preview finished; show interact CTA                |
| `showcase:interaction-complete` | Visitor completed a primary interaction                      |
| `showcase:mode-change`          | Mode changed (`preview`, `ready`, `interactive`, `complete`) |

```js
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://your-showcase-origin.example') return;
  const data = event.data;
  if (!data || data.version !== 1) return;
  // handle showcase:* events
});
```

**Origin validation:** always check `event.origin` on inbound messages. When sending host → iframe messages, prefer the showcase origin instead of `*`.

## Showcase modes

| Mode          | Behaviour                                            |
| ------------- | ---------------------------------------------------- |
| `preview`     | Automated choreography runs on load                  |
| `ready`       | Preview complete; visitor can interact or replay     |
| `interactive` | Visitor controls the prototype                       |
| `complete`    | Primary interaction finished; replay still available |

## Reduced motion

When `prefers-reduced-motion: reduce` is set, preview step delays are capped at 80 ms. The same state sequence still runs.

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
# open http://127.0.0.1:5172/Sportradar/mapping
```

Host fixture (open after the gateway is up):

```text
demos/sketchflow-showcase/host-fixture/index.html
```
