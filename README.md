# Transformer Patterns

*UX flow patterns and lo-fi prototyping for transformation teams.*

A lo-fi UX prototyping workspace: **lofi-kit** (grayscale component library), **UX flow and pattern docs** (`docs/`), **Cursor rules**, and **demos** you can fork to iterate. Reference apps (including the tournament bracket builder) show how components compose into real screens.

> **Default fidelity: Lo-fi.** All prototypes in this repo use grayscale, monospace type, and `lofi-kit` components. You don't need to specify "lo-fi" — it's always the starting point. High-fidelity documentation and source hooks are included, but runtime dependencies must be restored separately.

## Repository structure

```
lib/                             Publishable workspace: lofi-kit
├── src/ui/                      UI primitives (Button, Input, Modal, …)
├── src/diagram/                 React Flow node and edge types
├── src/styles/                  SCSS tokens, reset, global styles
├── src/__tests__/               Unit tests for every UI component
├── stories/                     Storybook stories
└── dist/                        Build output (JS, CSS, .d.ts)

demos/bracket-demo/              Reference app (tournament bracket builder)
├── src/components/              Bracket canvas, modals, match cards
├── src/lib/                     Pure helpers (matchDisplay, roundNaming, …)
├── src/store/                   Zustand tournament store
└── src/test/                    Vitest setup

.storybook/                      Storybook config (loads lib/stories/)
scripts/                         Tooling (props catalog generator, Pages hub)
docs/                            Design patterns, UX flows, brief guides
```

## Getting started

### Prerequisites

- **Node.js 22+** (the CI image uses `node:22-alpine`)
- **npm 10+** (ships with Node 22)

### Install

```bash
git clone <repo-url> transformer-patterns
cd transformer-patterns
npm install
```

Run `npm install` again any time the team adds a new demo or updates packages.

---

## For designers

You don't need to know React to run and review prototypes. These are the only commands you need.

### Step 1 — Open the Projects hub

```bash
npm run dev
```

This starts the local preview. Your browser should open `http://127.0.0.1:5172/` automatically. You'll see a **Projects** screen with a button for each demo.

> The footer of that page has a **Storybook** link — that's a browsable component library if you want to explore individual UI elements like buttons, forms, or modals.

### Step 2 — Open your prototype

Click the button that matches your project name. The folder name on disk is the same as what appears on the hub and in the URL:

```
demos/example-project-demo/   →   http://127.0.0.1:5172/example-project-demo/
```

### Step 3 — Check a build (before a handoff or review)

To confirm the prototype compiles without errors, run this from the repo root:

```bash
npm run build -w example-project-demo
```

This checks the code. It doesn't open anything in the browser — output files land in `demos/example-project-demo/dist/` but you won't normally need to open that folder.

### Step 4 — Preview a full static version (like the hosted site)

This builds every demo and the hub together into a `public/` folder, exactly like the hosted GitHub Pages version:

```bash
npm run demo-build
npx serve public
```

Then open the URL that `serve` prints. Use this when you want to share a snapshot or review the whole site locally without the development server running.

### Quick reference

| I want to…                         | Run this                                     |
| ---------------------------------- | -------------------------------------------- |
| Open and review all demos          | `npm run dev`                                |
| Check that one demo builds cleanly | `npm run build -w example-project-demo`      |
| Preview the full site offline      | `npm run demo-build` then `npx serve public` |
| Stop everything                    | Press `Ctrl+C` in the terminal               |

---

## For developers

### Development

```bash
npm run dev          # Hub on :5172 + all demo Vite servers + Storybook — open http://127.0.0.1:5172/
npm run storybook    # Storybook only (http://localhost:6006)
```

### Build

```bash
npm run build:lofi                 # Build lofi-kit → lib/dist (JS, CSS, .d.ts)
npm run build -w example-project-demo   # Build one demo
npm run build:all                  # Build all demos + hub

npm run demo-build                 # All demos + hub → public/  (mirrors GitHub Pages)
npm run demo-build -- --with-storybook  # Same + Storybook (used by CI)
npx serve public                   # Local preview of the full static site
```

### Test

```bash
npm test             # Run bracket-demo tests (Vitest, single run)
npm run test:lib     # Run lofi-kit component tests
npm run test:all     # Run all tests across the workspace
npm run test:watch   # Vitest in watch mode (bracket-demo)
npm run test:coverage # Coverage report (bracket-demo)
```

### Lint and format

```bash
npm run lint         # ESLint across the workspace
npm run format       # Prettier — rewrite in place
npm run format:check # Prettier — check only (CI)
```

---

## Adding a new demo

The folder name becomes the URL path — both locally and on GitHub Pages. No CI changes needed; just drop a `package.json` into the folder and run `npm install`.

### Workflow

1. **Create the folder**: `demos/your-demo-name/`

2. **Add `package.json`** — `name` must match the folder:

```jsonc
{
  "name": "your-demo-name",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "displayName": "Human Readable Title",
  "description": "One-line description shown on the hub",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
  },
  "dependencies": {
    "lofi-kit": "*",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
  },
}
```

3. **Add `vite.config.ts`** — mirror `demos/bracket-demo/vite.config.ts` exactly (hub env variables, `base`, SCSS load paths, lofi-kit alias).

4. **Add `tsconfig.json`**, `index.html`, `src/main.tsx`, `src/App.tsx` — same structure as bracket-demo.

5. **Register in root tsconfigs**: add to `tsconfig.json` references and `tsconfig.node.json` include.

6. **Link the workspace**:

```bash
npm install
```

7. **Verify**:

```bash
npm run dev                          # your demo button appears on the hub
npm run build -w your-demo-name      # must build without errors
npm run demo-build                   # full site check
```

For the complete file-by-file checklist, see [`.cursor/rules/demo-projects.mdc`](.cursor/rules/demo-projects.mdc).

---

## Using lofi-kit

### As a workspace dependency (demos)

Demos reference lofi-kit via `"lofi-kit": "*"` in their `package.json`. Vite resolves the alias to `lib/src/index.ts` for HMR during development.

```tsx
import { LOFIButton, LOFIModal, LOFIInput } from 'lofi-kit';
import 'lofi-kit/style.css';
```

All UI components use a **`LOFI` prefix** (`LOFIButton`, `LOFIModal`, `LOFIText`, …). Type names stay unprefixed (`ButtonProps`, `ModalProps`, …). Diagram exports (`nodeTypes`, `edgeTypes`) are unprefixed.

### As a published package

Once published to a registry, install and use in any React project:

```bash
npm install lofi-kit
```

Peer dependencies: `react`, `react-dom`, `@tanstack/react-table`, `@xyflow/react`.

### Design conventions

- **Grayscale only** — `#111` ink, `#fff` paper, token grays. No color.
- **Monospace everywhere** — all text uses the `$text-font-family` token.
- **BEM naming** — `.component-name`, `.component-name__element`, `.component-name--modifier`.
- **SCSS with tokens** — always `@use '../../styles/tokens' as *;` in component stylesheets.

See [`docs/LOFI_KIT_PATTERNS.md`](docs/LOFI_KIT_PATTERNS.md) for the full component catalog, visual rules, and composition patterns. See [`docs/LOFI_BLOCKS.md`](docs/LOFI_BLOCKS.md) for a quick-reference component table.

---

## Adding a new component

1. Create `lib/src/ui/Name/Name.tsx` + `Name.scss`
2. Import tokens: `@use '../../styles/tokens' as *;`
3. Export from `lib/src/ui/index.ts` with a **LOFI-prefixed** alias
4. Add tests in `lib/src/__tests__/Name.test.tsx`
5. Add a Storybook story in `lib/stories/ui/Name.stories.tsx`
6. Update `docs/LOFI_BLOCKS.md` and `docs/LOFI_KIT_PATTERNS.md`
7. Run `npm run build:lofi` to verify the build

---

## Component inventory (18 UI primitives)

| Component | Export         | Purpose                                            |
| --------- | -------------- | -------------------------------------------------- |
| Badge     | `LOFIBadge`    | Status chips, ID tags, labels                      |
| Button    | `LOFIButton`   | All actions and CTAs                               |
| Card      | `LOFICard`     | Content container with optional header/footer      |
| Checkbox  | `LOFICheckbox` | Boolean toggle with label                          |
| Field     | `LOFIField`    | Label + hint/error wrapper for form controls       |
| Fieldset  | `LOFIFieldset` | Grouped fields with a legend                       |
| Input     | `LOFIInput`    | Text input (text, number, email, search, password) |
| Loader    | `LOFILoader`   | Animated loading indicator with optional label     |
| Modal     | `LOFIModal`    | Overlay dialog with header, body, footer           |
| Panel     | `LOFIPanel`    | Side panel with header, body, footer               |
| Radio     | `LOFIRadio`    | Radio group (row or column layout)                 |
| Select    | `LOFISelect`   | Native dropdown with optional placeholder          |
| Steps     | `LOFISteps`    | Step/wizard navigation bar                         |
| Tabs      | `LOFITabs`     | Named parallel views (underline strip, badges)     |
| Table     | `LOFITable`    | Data table (sorting, expansion via TanStack)       |
| Text      | `LOFIText`     | Typography primitive (body, sm, micro, muted, …)   |
| Toggle    | `LOFIToggle`   | Segmented toggle (exclusive options)               |
| Toolbar   | `LOFIToolbar`  | Three-slot header (left / center / right)          |

---

## Scripts reference

| Command                                  | Purpose                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `npm run dev`                            | Dev hub on :5172; proxies each demo (Vite from :5173+) and starts Storybook on :6006 |
| `npm run dev:bracket-demo`               | Bracket demo Vite only (no hub, no Storybook)                                        |
| `npm run build -w <slug>`                | Production build for one demo                                                        |
| `npm run build:lofi`                     | Build lofi-kit → `lib/dist`                                                          |
| `npm run build:bracket-demo`             | Build bracket-demo only                                                              |
| `npm run build:all`                      | Build lofi-kit + all demos + hub → `public/` (alias for `demo-build`)                |
| `npm run demo-build`                     | Build all demos + hub → `public/` (mirrors Pages)                                    |
| `npm run demo-build -- --with-storybook` | Same + Storybook (used by CI)                                                        |
| `npm run storybook`                      | Storybook dev server (port 6006)                                                     |
| `npm run build-storybook`                | Static Storybook build                                                               |
| `npm test`                               | Run bracket-demo tests                                                               |
| `npm run test:lib`                       | Run lofi-kit tests                                                                   |
| `npm run test:all`                       | Run all workspace tests                                                              |
| `npm run test:watch`                     | Vitest watch mode (bracket-demo)                                                     |
| `npm run test:coverage`                  | Coverage report (bracket-demo)                                                       |
| `npm run lint`                           | ESLint                                                                               |
| `npm run format`                         | Prettier (write)                                                                     |
| `npm run format:check`                   | Prettier (check only)                                                                |
| `npm run props:catalog`                  | Generate `props-catalog.json`                                                        |
| `npm run props:catalog:md`               | Generate `props-catalog.json` + `.md`                                                |

---

## Testing

Tests use **[Vitest](https://vitest.dev/)** with **jsdom** and **[@testing-library/react](https://testing-library.com/)**.

### lofi-kit tests

Component tests for all UI primitives live in `lib/src/__tests__/`. They verify rendering, props, user interaction, accessibility attributes, and CSS class application.

### bracket-demo tests

| Layer         | Location                                       |
| ------------- | ---------------------------------------------- |
| Components    | `demos/bracket-demo/src/components/__tests__/` |
| Pure helpers  | `demos/bracket-demo/src/lib/__tests__/`        |
| Zustand store | `demos/bracket-demo/src/store/__tests__/`      |

---

## CI/CD

The [GitHub CI pipeline](.gitlab-ci.yml) runs:

| Stage     | Trigger                             | What it does                                         |
| --------- | ----------------------------------- | ---------------------------------------------------- |
| `test`    | Every push                          | `npm ci && npm run test:all`                         |
| `deploy`  | Default branch                      | `npm run demo-build --with-storybook` → GitHub Pages |
| `package` | Commit message flags or MR (manual) | Publishes `lofi-kit` to the npm registry             |

Adding a new demo (`demos/<slug>/package.json`) is picked up automatically — no pipeline changes needed.

---

## Documentation

| File                                                   | Purpose                                               |
| ------------------------------------------------------ | ----------------------------------------------------- |
| [`docs/LOFI_KIT_PATTERNS.md`](docs/LOFI_KIT_PATTERNS.md) | Component catalog, visual rules, composition patterns |
| [`docs/UX_PATTERNS.md`](docs/UX_PATTERNS.md)             | Interaction & flow rules, P1–P10 patterns              |
| [`docs/LOFI_BLOCKS.md`](docs/LOFI_BLOCKS.md)             | Quick component lookup table                          |
| [`CLAUDE.md`](CLAUDE.md)                               | AI assistant context (architecture, conventions)      |
| [`lib/README.md`](lib/README.md)                       | lofi-kit install and publish guide                    |

## License

Workspace root is private. Publish `lofi-kit` from `lib/` with your own scope and registry configuration (see `lib/package.json`).
