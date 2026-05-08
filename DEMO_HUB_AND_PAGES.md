# Demo Hub And GitHub Pages

## Local Hub

`npm run dev` starts:

- Hub at `http://127.0.0.1:5172/`
- One Vite server per LoFi demo on sequential ports
- Storybook at `http://127.0.0.1:6006/` unless `SKIP_STORYBOOK=1`

The hub proxies `/<slug>/...` to the matching demo server. By default, `*-hifi` packages are skipped because their runtime dependencies are not installed.

To opt in after restoring hi-fi dependencies:

```bash
INCLUDE_HIFI_DEMOS=1 npm run dev
```

## Static Build

```bash
npm run demo-build -- --with-storybook
npx serve public
```

Output shape:

- `public/index.html`: hub
- `public/<slug>/index.html`: each demo
- `public/storybook/`: Storybook when included

## GitHub Pages

The workflow at `.github/workflows/pages.yml` builds `public/` and deploys it with GitHub Pages. In GitHub, set Pages source to **GitHub Actions**.
