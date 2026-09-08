# Work page ↔ SketchFlow-AI embed

Handoff brief for two separate apps. This site is the static shell. [SketchFlow-AI](https://github.com/DKirbi/SketchFlow-AI) stays on **its own URL** (own GitHub repo, own Vercel project). This page is the source of truth for both repos: implement the Work iframe here first, then paste **§ SketchFlow-AI agent brief** into a chat in the SketchFlow workspace.

Do **not** merge the repos, add SketchFlow as a second Cursor root for this work, or rewrite SketchFlow under a path on this site (`yoursite.com/sketchflow/...`).

---

## Goal

Clicking **Work** (`/:lang/work`) keeps this site’s 54px top bar. Below it, a full-viewport iframe loads the live SketchFlow app. SketchFlow’s own sidebar stays so visitors can move between prototypes and Storybook. Theme and language on this site’s bar later drive SketchFlow; they do not today.

## Two apps, two URLs

| | This site (`react-website`) | SketchFlow-AI |
| --- | --- | --- |
| Role | Personal site: About, Work shell, Resume, Photos | Lo-fi UX patterns hub + prototypes |
| Stack | React 18, Vite 5, react-router-dom 6, i18next, Tailwind 3 | React 19, Vite 8, own router, no i18n, no dark mode |
| Deploy | Own Vercel project; SPA rewrite to `index.html` | Own Vercel project; `build:showcase` → `demos/sketchflow-showcase/dist` |
| Public URL | This site’s domain | SketchFlow’s own Vercel URL (optional later custom domain, e.g. `portfolio.davorkirbis.com`) |

The iframe `src` is SketchFlow’s origin, not a route inside this app. SketchFlow routes such as `/Sportradar/mapping` live **inside** the iframe.

---

## How this website works today

### Routing

`src/main.tsx` mounts a `/:lang` layout. Supported languages: `en`, `de`, `sl`. Bare `/` and unknown languages redirect to `/en/home`.

| Path | Page |
| --- | --- |
| `/:lang/home` | About me |
| `/:lang/work` | Work (placeholder until this spec) |
| `/:lang/resume` | Resume |
| `/:lang/photos` | Photos (not in the top nav) |

`src/routes/root.tsx` (`LangRoot`) validates `:lang` and syncs `i18n.language` from the URL. The URL is the source of truth for language so shared links stay in the language they were shared in.

`vercel.json` only rewrites `/(.*)` → `/index.html`. There is no path proxy to SketchFlow.

### Navigation

`NavigationMain` is always rendered by `LangRoot`. It owns the mobile menu and language switch.

- **Top bar** (`top-bar.tsx`): `fixed`, `h-[54px]`, `z-[999]`. Logo, About / Work / Resume, language control, theme switch. Other pages offset content with `pt-16`.
- **Language change** navigates to the same slug under the new locale (`/en/work` → `/de/work`). It does **not** call `i18n.changeLanguage` itself; `LangRoot` does that from the new URL.
- **Theme toggle** (`theme-toggle.tsx`) uses `useColorScheme()`. It does not know about iframes.

### Language

- `src/i18n.ts`: i18next + `i18next-browser-languagedetector`, fallback `en`.
- Copy lives in `src/locales/{en,de,sl}/translation.json`.
- About me currently links SketchFlow to GitHub (`https://github.com/DKirbi/SketchFlow-AI`), not the live app. Work is where the live app will appear.

### Theme

- `ColorSchemeProvider` in `src/lib/color-scheme.tsx` wraps the whole app.
- Resolved scheme is `"light" | "dark"`. Applied as `class="dark"` on `<html>`, plus `data-theme="default"` and `style.colorScheme`.
- Persisted in `localStorage` key `color-scheme` (legacy Mantine key is cleared).
- `index.html` runs a FOUC script so the stored scheme is applied before React hydrates.

An iframe is a **different document** on a **different origin**. It cannot see this site’s `dark` class, `localStorage`, or `/:lang`. Toggling DE/SL or dark mode only updates this site until SketchFlow opts in (below).

### Work today

`src/routes/work.tsx` is a thin route that renders `WorkPlaceholder` (“This page is a work in progress.”). Replace the placeholder with the iframe shell; keep the route file thin.

---

## Target architecture

```
┌─────────────────────────────────────────────┐
│  This site — 54px top bar (always visible)  │
│  About | Work | Resume | lang | theme       │
├─────────────────────────────────────────────┤
│  iframe  src = SKETCHFLOW_ORIGIN            │
│  ┌──────────┬─────────────────────────────┐ │
│  │ SketchFlow sidebar                     │ │
│  │ prototypes + Storybook                 │ │
│  ├──────────┴─────────────────────────────┤ │
│  │ SketchFlow hub / prototype             │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

- Work body is a **full-viewport iframe under the bar**. No page title, no `max-w-5xl`.
- `#root` is `max-width: 1000px` with `padding: 54px 0` (`src/index.scss`). A normal in-flow iframe would be letterboxed and double-offset. The Work iframe must **break out**: `position: fixed; inset: 54px 0 0 0` (below the bar, full width). Do not add another `pt-[54px]` on the Work page.
- `iframe` attributes: `title` describing SketchFlow, `width/height 100%`, `border: 0`, `loading="eager"`. Do not use `sandbox` (would block SketchFlow’s own scripts and inner Storybook iframe).
- Keep **both** chromes: this bar is how you leave Work; SketchFlow’s sidebar is how you move between prototypes and Storybook. Do not hide SketchFlow hub chrome for v1.
- `src` is an env var, e.g. `VITE_SKETCHFLOW_URL` (production = SketchFlow’s public origin; local = `http://127.0.0.1:5172`). Point at the SketchFlow **root**; SketchFlow already redirects `/` to `/Sportradar/merge-tool`.

### What we are not doing

- Vercel rewrites from this domain to SketchFlow (SketchFlow Vite `base` is `/`; assets and its router would break).
- Merging SketchFlow into this React tree.
- Teaching this router SketchFlow paths (`/Sportradar/...`).

---

## Shared appearance: parent owns it, iframe listens

Not a shared React context, Redux store, or npm package. The apps do not share JS. When SketchFlow is **embedded**, this site owns theme and locale. SketchFlow applies what it is told.

When SketchFlow is opened **on its own URL** (not in this iframe), it has no host. Default to light + `en` until SketchFlow grows its own controls.

### Why both query params and postMessage

| Channel | When | Why |
| --- | --- | --- |
| Query on `iframe.src` | First load, full reload, and language switch | Language switch already remounts Work (`/en/work` → `/de/work`) with a new `src`. Query params apply theme/locale before SketchFlow paints. |
| `postMessage` | Theme toggle while staying on Work; also on iframe load as a snapshot | Theme lives in `localStorage` on **this** origin and does not remount Work. Without a message, the iframe stays on the theme it had at load. |

Always put both `theme` and `locale` on the query. Theme is not in the parent URL, so a refresh of `/de/work` would otherwise reload SketchFlow in light mode.

### Query string (v1 contract, implement on SketchFlow in the follow-up)

```text
https://<sketchflow-origin>/?theme=dark&locale=de
```

SketchFlow’s root redirect must **preserve** `theme` and `locale` when it navigates to `/Sportradar/merge-tool`.

| Param | Values | Default if missing/invalid |
| --- | --- | --- |
| `theme` | `light` \| `dark` | `light` |
| `locale` | `en` \| `de` \| `sl` | `en` |

### postMessage (extend existing protocol)

SketchFlow already has a versioned protocol in `demos/sketchflow-showcase/src/runtime/protocol.ts` (`SHOWCASE_PROTOCOL_VERSION = 1`) for prototype interact/replay (`showcase:start-interactive`, `showcase:replay`, `showcase:ready`, …). **Add** appearance messages; do not invent a second protocol.

Host → iframe (new):

```ts
{
  type: "showcase:set-appearance";
  version: 1;
  theme: "light" | "dark";
  locale: "en" | "de" | "sl";
}
```

Always send **both** fields (full snapshot). Avoids races if the user toggles theme and language quickly.

Iframe → host (optional, for debugging / “applied” confirmation):

```ts
{
  type: "showcase:appearance-applied";
  version: 1;
  theme: "light" | "dark";
  locale: "en" | "de" | "sl";
}
```

Rules:

- Host sends to `iframe.contentWindow` with **targetOrigin = SketchFlow origin**, never `*`.
- SketchFlow ignores messages whose `event.origin` is not on an allow-list: this site’s production origin, plus this site’s Vite origin (`http://localhost:5173` and `http://127.0.0.1:5173`; `vite.config.ts` does not set a port, so Vite’s default 5173 applies).
- Existing `parseHostMessage` only accepts interact/replay. Extend it (and hub-level listeners — appearance is a **hub** concern, not only `useShowcaseRuntime` on a single prototype).
- Origin checks stay as they are today: empty allow-list currently means “allow all”; production must set a non-empty list.

### What SketchFlow does with the values

- **Theme:** apply a document-level `dark` class (or equivalent) on the hub shell and prototypes so lo-fi UI actually changes. SketchFlow has **no** dark theme today; that work lives in SketchFlow.
- **Locale:** SketchFlow has **no** i18n today. Hub chrome (sidebar labels, brief bar) should follow `en` / `de` / `sl`. Prototype **content** may stay English in the first SketchFlow pass if translating every example is too large — but hub chrome must follow the host, otherwise the top bar and sidebar disagree.

This site does not translate SketchFlow strings. SketchFlow owns its copy.

---

## Phased work

### Phase 1 — this repo only (iframe shell)

1. Replace `WorkPlaceholder` with a full-height iframe under the existing top bar.
2. `src={import.meta.env.VITE_SKETCHFLOW_URL}` (required at build time; fail visibly if unset rather than silently pointing at GitHub).
3. No `postMessage` yet. Language/theme on the bar keep working for **this** site; the iframe stays SketchFlow’s current light/English UI.
4. If the live app refuses to render in an iframe, that is a SketchFlow header issue (`X-Frame-Options` / `frame-ancestors`) — fix it in the SketchFlow repo, not with a rewrite here.

### Phase 2 — SketchFlow-AI repo (listener + appearance)

See **§ SketchFlow-AI agent brief**. Headers, query parse, `showcase:set-appearance`, hub theme + locale, keep sidebar.

### Phase 3 — this repo (host side of the contract)

Once SketchFlow accepts the protocol:

1. Build iframe `src` as `VITE_SKETCHFLOW_URL` + `?theme=&locale=` from `useColorScheme()` and `:lang`.
2. On iframe `load`, and whenever theme changes while still on Work, `postMessage` `showcase:set-appearance`. Do not wait for `showcase:ready` — that event is emitted by a prototype runtime, not the hub shell.
3. Language changes already remount via URL; query params on the new `src` are enough. Still posting on `load` keeps one snapshot path for theme + locale.

---

## This repo — implementation notes (Phase 1)

- Route stays thin (`work.tsx` composes a new component, e.g. `WorkShowcaseFrame`).
- Follow existing component standards: `const Name: FC<NameProps>`, named export, JSDoc on props.
- Layout: fixed iframe `inset: 54px 0 0 0` so `#root`’s max-width and padding do not constrain it.
- Env: `.env.example` with `VITE_SKETCHFLOW_URL=`; never commit secrets (this value is a public URL).
- About me GitHub link can stay; Work is the live embed.

---

## SketchFlow-AI agent brief

Paste this section into an agent chat **in the SketchFlow-AI workspace**. Do not implement it inside `react-website`.

### Context

The personal site at this origin (production domain of `react-website`) will iframe **this** app on `/:lang/work`. Visitors keep the personal site’s top bar. Your hub sidebar must stay visible for prototypes and Storybook. Do not hide hub chrome because you are embedded.

Host: separate Vite/React 18 app. You: React 19 showcase at `demos/sketchflow-showcase`. Cross-origin. No shared JS state.

Existing embed docs: `docs/PORTFOLIO_EMBEDDING.md`. Existing protocol: `demos/sketchflow-showcase/src/runtime/protocol.ts`. Host fixture: `demos/sketchflow-showcase/host-fixture/index.html`.

### Must do

1. **Stay on your own URL.** Do not change Vite `base` to live under the personal site’s path. Optional: attach a custom domain to **this** Vercel project later.
2. **Allow framing** from the personal site origin. Prefer `Content-Security-Policy: frame-ancestors 'self' <personal-site-origin>`. Do not set `X-Frame-Options: DENY` / `SAMEORIGIN` in a way that blocks the parent.
3. **Keep the hub sidebar** when `window.parent !== window`.
4. **Parse `theme` and `locale` from the URL** on load. Preserve them across the `/` → `/Sportradar/merge-tool` redirect.
5. **Listen for `showcase:set-appearance`** (`version: 1`, `theme`, `locale`) at hub level, not only inside `useShowcaseRuntime`. Validate `event.origin` against an explicit allow-list (personal site production + local Vite origins). Reject everything else.
6. **Apply theme** on `<html>` (or the hub root) so the lo-fi UI follows `light` / `dark`.
7. **Apply locale** at least to hub chrome (sidebar, brief bar). Fallback `en`. Supported: `en`, `de`, `sl`. Prototype bodies may remain English in the first pass.
8. **Extend `protocol.ts`** rather than adding a parallel message format. Optionally reply `showcase:appearance-applied`.
9. **Standalone visits** (no parent): default `theme=light`, `locale=en`. Do not require the personal site.

### Must not do

- Hide or replace the sidebar with the personal site’s nav.
- Trust `postMessage` without origin checks.
- Use `*` as `postMessage` targetOrigin when talking **to** the parent for appearance (prefer the known host origin; today’s runtime posts some events with `*` — do not extend that pattern for new messages).
- Couple to the personal site’s `localStorage` key `color-scheme` or its React context.

### Suggested local check

Personal site iframe `src=http://127.0.0.1:5172/?theme=dark&locale=de`. Toggle dark on the parent without leaving Work; hub should follow once Phase 3 is wired. Until then, reload with new query params.

---

## Cursor workflow

| Task | Where |
| --- | --- |
| Phase 1 iframe shell | This workspace (`react-website`) only |
| Phase 2 appearance + headers | SketchFlow-AI workspace; paste **§ SketchFlow-AI agent brief** |
| Phase 3 host `postMessage` + query | This workspace, after Phase 2 |

Do not add SketchFlow-AI as a second folder in this window for Phase 1.

---

## Out of scope

- Translating every SketchFlow prototype in the first SketchFlow pass.
- SketchFlow growing its own language/theme chrome for standalone visits (defaults are enough).
- Iframing individual prototypes without the hub.
- Changing About me’s GitHub link.
- Path-based hosting of SketchFlow on this domain.
