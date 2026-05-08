#!/usr/bin/env node
/**
 * Scans demos/ for workspace packages and generates the GitHub Pages hub
 * index. Uses LOFI BEM classes (.btn, .text, …) + lofi-kit.css + hub-layout.scss.
 *
 * Usage:
 *   node scripts/generate-hub.mjs                              # stdout
 *   node scripts/generate-hub.mjs --out public/index.html       # Pages build
 *   node scripts/generate-hub.mjs --out .hub-dev/index.html --dev-gateway  # local dev hub
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as sass from 'sass';
import { discoverDemos as _discoverDemos } from './lib/discover-demos.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const demosDir = path.join(root, 'demos');

const outFlag = process.argv.indexOf('--out');
const outPath =
  process.argv.find((a) => a.startsWith('--out='))?.slice('--out='.length) ??
  (outFlag !== -1 ? process.argv[outFlag + 1] : null);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function discoverDemos() {
  return _discoverDemos(demosDir);
}

function writeHubAssets(outDir) {
  const layoutSrc = path.join(root, 'scripts', 'hub-layout.scss');
  const compiled = sass.compile(layoutSrc, { style: 'compressed' });
  fs.writeFileSync(path.join(outDir, 'hub-layout.css'), compiled.css);

  const lofiSrc = path.join(root, 'lib/dist/lofi-kit.css');
  if (!fs.existsSync(lofiSrc)) {
    console.warn(
      'hub: lib/dist/lofi-kit.css missing — run npm run build:lofi (hub will look unstyled until then)',
    );
    return;
  }
  fs.copyFileSync(lofiSrc, path.join(outDir, 'lofi-kit.css'));
}

function generateHTML(demos, options = {}) {
  const devGateway = Boolean(options.devGateway);
  const demoHrefBase = devGateway ? '/' : './';
  const storybookHref = devGateway
    ? (process.env.HUB_STORYBOOK_URL ?? 'http://127.0.0.1:6006/')
    : './storybook/index.html';
  const demoBlocks = demos
    .map((d) => {
      const title = escapeHtml(d.title);
      const desc = d.description
        ? `\n          <span class="text text--muted hub__demo-desc">${escapeHtml(d.description)}</span>`
        : '';
      // Use explicit index.html in production so hosts that don't serve directory
      // indexes (e.g. static artifact URLs) resolve correctly.
      const demoHref = devGateway
        ? `${demoHrefBase}${encodeURIComponent(d.slug)}/`
        : `${demoHrefBase}${encodeURIComponent(d.slug)}/index.html`;
      return `        <a class="btn btn--default hub__demo-link" href="${demoHref}"><span class="text text--inherit">${title}</span>${desc}
        </a>`;
    })
    .join('\n');

  const newProjectRow = `        <button type="button" class="btn btn--default hub__new-project" disabled>
          <span class="text text--inherit">New Project</span>
        </button>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Transformer Patterns — UX prototyping hub</title>
    <link rel="stylesheet" href="./lofi-kit.css" />
    <link rel="stylesheet" href="./hub-layout.css" />
  </head>
  <body>
    <main class="hub">
      <div class="hub__inner">
        <p class="text text--caps hub__brand">Transformer Patterns</p>
        <p class="text text--muted hub__tagline">UX flow patterns and lo-fi prototyping for transformation teams.</p>
        <h1 class="text text--caps hub__heading">Projects</h1>
        <div class="hub__stack">
${demoBlocks ? `${demoBlocks}\n` : ''}${newProjectRow}
        </div>
        <footer class="hub__footer">
          <a class="text text--muted hub__storybook-link" href="${escapeHtml(storybookHref)}">Storybook &mdash; primitives &amp; patterns</a>
        </footer>
      </div>
    </main>
  </body>
</html>
`;
}

const devGateway = process.argv.includes('--dev-gateway');
const demos = discoverDemos();
const html = generateHTML(demos, { devGateway });

if (outPath) {
  const abs = path.isAbsolute(outPath) ? outPath : path.join(root, outPath);
  const outDir = path.dirname(abs);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(abs, html);
  writeHubAssets(outDir);
  console.log(
    `hub: ${outPath} (+ lofi-kit.css, hub-layout.css) (${demos.length} demo${demos.length === 1 ? '' : 's'})`,
  );
} else {
  process.stdout.write(html);
}
