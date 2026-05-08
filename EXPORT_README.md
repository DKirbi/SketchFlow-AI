# TransformerAI Export

A zip-ready portfolio workspace for LoFi Blocks, UX pattern planning, demo hub routing, and agent-guided prototype generation.

## Quick Start

```bash
npm install
npm run dev
```

Open the hub at `http://127.0.0.1:5172/`. Storybook is linked from the hub and normally runs on `http://127.0.0.1:6006/`.

To skip Storybook during local hub startup:

```bash
SKIP_STORYBOOK=1 npm run dev
```

## What Is Included

- `lofi-kit`: grayscale, monospace UI primitives and React Flow helpers.
- LoFi demos under `demos/`.
- High-fidelity demo source under `demos/notifications-overview-hifi` as future/restorable source.
- UX pattern docs, LoFi Blocks docs, natural-language component mapping, and composition rules.
- Cursor rules/skills and GitHub Copilot instructions.
- Local demo hub, static build scripts, Storybook, and GitHub Pages workflow.

## High-Fidelity Caveat

The high-fidelity demo source and scripts are preserved, but Podium/Mantine dependencies and Podium MCP configuration are intentionally removed. The default hub skips `*-hifi` demos. Restore the target design-system dependencies and set `INCLUDE_HIFI_DEMOS=1` before trying to run or publish hi-fi demos.

## Static Build

```bash
npm run demo-build -- --with-storybook
npx serve public
```

GitHub Pages deployment is defined in `.github/workflows/pages.yml`.
