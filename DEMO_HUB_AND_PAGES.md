# Demo Hub And GitHub Pages

## Local Hub (UX Showcase)

`npm run dev` starts:

- **UX Showcase** SPA at `http://127.0.0.1:5172/` (replaces the old static `.hub-dev` launcher)
- One Vite server per LoFi demo on sequential ports
- Storybook (and curated embeds) under `/embeds/…` unless `SKIP_STORYBOOK=1`

Routes:

- `/` and `/Sportradar` — redirect to `/Sportradar/merge-tool`
- `/Sportradar/<project>` — sidebar hub + prototype (SPA or iframe)
- `/?slug=<project>` — legacy redirect onto `/Sportradar/<project>`
- `/embeds/bracket-demo/`, `/embeds/tournament-management/`, `/embeds/low-fi-ux-ui-patterns/` — iframe targets
- `/<other-demo-slug>/` — still proxied for demos not listed on the hub

By default, `*-hifi` packages are skipped because their runtime dependencies are not installed.

```bash
INCLUDE_HIFI_DEMOS=1 npm run dev
```

## Portfolio / Vercel build

```bash
npm run build:showcase
npx serve demos/sketchflow-showcase/dist
```

Or:

```bash
npm run build:showcase -- --out public
```

Output shape:

- `index.html` — UX Showcase SPA
- `embeds/bracket-demo/` — Bracket Demo
- `embeds/tournament-management/` — Tournament Management
- `embeds/low-fi-ux-ui-patterns/` — Storybook

Root [`vercel.json`](vercel.json) builds with `npm run build:showcase` and SPA-rewrites non-embed paths.

## GitHub Pages

The workflow at `.github/workflows/pages.yml` runs `build:showcase -- --out public` and deploys with GitHub Pages. In GitHub, set Pages source to **GitHub Actions**.

## Legacy full demo-build

`npm run demo-build` still builds every demo into a flat `public/<slug>/` tree for one-off archival use. The primary hub experience is `build:showcase`.
