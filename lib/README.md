# lofi-kit

Lo-fi UI primitives and React Flow diagram blocks (BEM + SCSS, monospace, grayscale). Built for fast product prototyping alongside domain apps.

## Install

```bash
npm install lofi-kit
```

```tsx
import { LOFIBadge, LOFIButton, nodeTypes, edgeTypes } from 'lofi-kit';
import 'lofi-kit/style.css';
```

UI components are exported with a **`LOFI` prefix** (`LOFIButton`, `LOFIModal`, …). **Type names** stay unprefixed (`ButtonProps`, …). **Diagram** exports (`nodeTypes`, `edgeTypes`) are unprefixed.

Peer dependencies: `react`, `react-dom`, `@tanstack/react-table`, `@xyflow/react` (see `package.json`).

## Build (from repo root)

```bash
npm run build:lofi
```

Output: `dist/lofi-kit.js`, `lofi-kit.cjs`, `lofi-kit.css`, and TypeScript declarations.

## Publishing (checklist)

1. Set `name` / `publishConfig` registry to your group scope (e.g. `@your-scope/lofi-kit`).
2. In CI, run `npm ci`, then `npm run build -w lofi-kit`, then `npm publish` from `lib/` (or `npm publish -w lofi-kit`) with `NPM_TOKEN` / `CI_JOB_TOKEN` as your org requires.
