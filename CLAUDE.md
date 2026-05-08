# Project context for Claude

You are working on **Transformer Patterns** (_UX flow patterns and lo-fi
prototyping for the Transformers team_), a lo-fi UX prototyping workspace built
with React 19, TypeScript, Vite 8, and React Flow. It combines a component
library, curated UX flow/pattern documentation, Cursor rules, and forkable demos
(including a tournament bracket reference app).

## What this project is

This repo has three pillars:

1. **`lofi-kit`** (`lib/`) — a publishable lo-fi component library. **18**
   BEM + SCSS + grayscale primitives (exported as `LOFIButton`, `LOFIInput`, … —
   see `lib/src/ui/index.ts`) plus React Flow diagram node/edge types (`nodeTypes`,
   `edgeTypes`, unprefixed). Everything uses monospace typography, `#111`/`#fff`
   ink/paper, and square corners. No external UI framework.

2. **Patterns and flows** (`docs/`, `.cursor/rules/`) — visual
   and behaviour rules, UX flow pattern inventory, brief guides, and agent
   conventions for consistent prototyping. **Cursor project skills** (prototype
   intake vs pattern authoring, triggers) live under **`.cursor/skills/README.md`**
   with GitHub Copilot parity in **`.github/copilot-instructions.md`** (see
   **Agent modes** there).

3. **Demos** (`demos/*`) — Vite apps that compose `lofi-kit` into real screens;
   **`demos/bracket-demo/`** is the flagship reference: a two-step tournament
   bracket builder (structure setup, then React Flow canvas with bracket nodes,
   match cards, progression edges, and modals).

Storybook lives at the repo root (`.storybook/`) and loads stories from
`lib/stories/`.

## Required reading

Before building or modifying any UI in this project, **read
[`LOFI_KIT_PATTERNS.md`](docs/LOFI_KIT_PATTERNS.md)**. It contains:

- Visual rules (monochrome, monospace, dashed = incomplete, etc.)
- The full component catalog with BEM roots and usage guidance
- Composition patterns showing how to combine components for common screens
  (modal forms, editable tables, canvas toolbars, match card layouts)
- A decision guide for choosing the right component
- Token reference for spacing, color, typography, and shadows

Also reference **[`docs/LOFI_BLOCKS.md`](docs/LOFI_BLOCKS.md)** for the quick-lookup
component table.

## Architecture

```
lib/                          lofi-kit (workspace package)
├── src/ui/                   UI primitives (one folder per component)
├── src/diagram/              React Flow node and edge types
├── src/styles/               _tokens.scss, _reset.scss
├── stories/                  Storybook stories (*.stories.tsx)
└── dist/                     Built JS (lofi-kit.js / .cjs), CSS, .d.ts

demos/bracket-demo/           Reference consumer (not published)
├── src/
│   ├── components/           Bracket canvas, modals, match cards
│   ├── lib/                  Pure helpers (matchDisplay, roundNaming, etc.)
│   ├── data/                 Seed data (champions, tennis)
│   ├── store/                Zustand tournament store
│   ├── test/                 Vitest setup
│   └── types/index.ts        Domain types
├── index.html
├── vite.config.ts
└── package.json
```

## Conventions

- **BEM naming**: `.component-name`, `.component-name__element`,
  `.component-name--modifier`.
- **SCSS with tokens**: always `@use '../../styles/tokens' as *;` in component
  stylesheets. Never hard-code colors or sizes.
- **Grayscale only**: no color. Use token grays for emphasis levels.
- **No external UI libraries in demos**: everything consumed by `demos/*` comes
  from `lofi-kit`. `lib/` itself may declare `dependencies` on **headless,
  unstyled** behavior libraries — currently **`@radix-ui/react-collapsible`**
  only, used internally by `LOFINavTree` and bundled into `lofi-kit.js`. Demos
  must never import `@radix-ui/*` directly. If a pattern is missing, add a new
  component to `lib/src/ui/` first (see "Adding a new component" in `docs/LOFI_KIT_PATTERNS.md`).
- **Monospace everywhere**: all text inherits `$text-font-family`.
- Use **`LOFIText`** for all rendered copy.
- Use **`LOFIButton`** for actions (never raw `<button>` in the UI layer).
- Use **`LOFIModal`** for overlays, **`LOFIPanel`** for contextual side detail.
- Use **`LOFIField`** + **`LOFIInput`**/**`LOFISelect`**/**`LOFICheckbox`**/**`LOFIRadio`** for all form layouts.
- **Verify imports.** Every `.tsx` file in demos that renders UI must
  `import { ... } from 'lofi-kit'`. If an existing file has no lofi-kit
  imports, it is compliance debt — migrate it when you touch it. See the
  substitution table in `docs/LOFI_BLOCKS.md` → "Forbidden raw HTML".

## Key commands

```bash
npm run dev               # Hub on :5172 + every demo’s Vite (:5173+) + Storybook (:6006)
npm run dev -w <slug>     # Single demo only — no hub, no Storybook; avoids port conflicts
npm run dev:bracket-demo  # Shorthand for the above, bracket-demo only
npm run build:lofi        # Build lofi-kit → lib/dist
npm run storybook         # Storybook on :6006
npm test                  # Vitest (bracket-demo)
npm run lint              # ESLint
npm run format            # Prettier
```

**Install and dev pitfalls:**

- Always run `npm install` from the **repo root**, not from inside `demos/<slug>/`.
  Running it inside a demo folder loses workspace context and fails.
- Demo `package.json` files must use `"lofi-kit": "*"` — **not** `"workspace:*"`.
  The `workspace:` protocol is pnpm/yarn-only and is rejected by npm.
  Module resolution happens through vite's `resolve.alias` and tsconfig `paths`.
- If `npm run dev` fails with `EADDRINUSE`, kill the old session first:
  `pkill -f "dev-gateway.mjs"; pkill -f "vite"; sleep 1 && npm run dev`
- **High-fidelity note:** this export preserves high-fidelity documentation and demo source, but omits Podium/Mantine dependencies and MCP configuration. Restore the target design-system runtime before running high-fidelity demo scripts.

## When adding a new lo-fi component

1. Create `lib/src/ui/Name/Name.tsx` + `Name.scss`
2. Import tokens: `@use '../../styles/tokens' as *;`
3. Export from `lib/src/ui/index.ts` with a **LOFI-prefixed** alias (component + types)
4. Add to the table in `docs/LOFI_BLOCKS.md` and the catalog in `docs/LOFI_KIT_PATTERNS.md`
5. Run `npm run build:lofi` to verify
