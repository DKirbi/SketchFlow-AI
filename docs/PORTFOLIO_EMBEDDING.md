# Portfolio embedding — SketchFlow Showcase

This document describes how an **external resume website** embeds lo-fi interaction examples from the `sketchflow-showcase` demo package.

## What gets deployed

Build the showcase demo from the repo root:

```bash
npm run build -w sketchflow-showcase
```

Deploy the contents of `demos/sketchflow-showcase/dist/` to any static host, e.g.:

```text
https://your-domain.com/sketchflow-showcase/
```

Each example is loaded via query param:

```text
https://your-domain.com/sketchflow-showcase/?slug=mapping
```

No npm publish step is required. Vite bundles `lofi-kit` into the static output.

## Resume integration pattern

1. Add a small **project dot** (or button) next to each experience card.
2. On click, **expand an inline panel** beneath the experience.
3. Render an **iframe** pointing at the showcase URL for that example.
4. Optionally mirror the iframe toggle: **Interact with prototype** stops automation and hands control to the visitor; **Automate** restarts the preview sequence.

See the reference host page at [`demos/sketchflow-showcase/host-fixture/index.html`](../demos/sketchflow-showcase/host-fixture/index.html).

## Iframe markup

```html
<iframe
  src="https://your-domain.com/sketchflow-showcase/?slug=mapping"
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

## Adding a new example

1. Create `demos/sketchflow-showcase/src/examples/<slug>/` with:
   - `metadata.ts` — title, patterns, preview steps, experience key
   - `<Name>Example.tsx` — typed React renderer (lo-fi kit only)
2. Register the example in `src/examples/registry.ts`.
3. Embed with `?slug=<slug>`.

Keep JSON/config for **metadata and preview timing**. Keep interaction logic in typed React — do not build a generic JSON-to-UI renderer for v1.

## Mapping example (first slice)

- **Slug:** `mapping`
- **Experience key:** `sportradar`
- **Patterns:** P2.2 (row Map action), P3 (stateful button), P9 (sport + tournament filters)
- **Automated preview:** animated cursor travels between Map, Unmap, checkboxes, and bulk controls; longer delays surface loading states; stage is non-interactive until **Interact with prototype**
- **Chrome notification:** **Automated preview** while automation runs; switches to **Interactive prototype** (with bulk-map hint) after takeover
- **Interactive:** sport dropdown + tournament search (explicit **Search** / **Clear all**); visitor maps any pending row; completion fires `showcase:interaction-complete`

## Local development

```bash
npm run dev:sketchflow-showcase
# or via hub:
npm run dev
# open http://127.0.0.1:5172/sketchflow-showcase/?slug=mapping
```

Host fixture (open after dev server starts):

```text
demos/sketchflow-showcase/host-fixture/index.html
```

Adjust the iframe `src` in the fixture if your dev port differs.
