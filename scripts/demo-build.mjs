#!/usr/bin/env node
/**
 * Build all demos into a Pages-shaped output directory.
 *
 * Usage:
 *   node scripts/demo-build.mjs                          # → public/
 *   node scripts/demo-build.mjs --out dist-pages         # custom output dir
 *   node scripts/demo-build.mjs --with-storybook         # also build Storybook
 *
 * Output layout mirrors GitHub Pages:
 *   <out>/              ← hub index.html + lofi-kit.css + hub-layout.css
 *   <out>/<slug>/       ← each demo's Vite build (dist/ contents)
 *   <out>/storybook/    ← Storybook static build (only with --with-storybook)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { discoverDemoSlugs } from './lib/discover-demos.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const demosDir = path.join(root, 'demos');
const useShell = process.platform === 'win32';

// ── CLI args ────────────────────────────────────────────────────────────────

const withStorybook = process.argv.includes('--with-storybook');

const outFlag = process.argv.indexOf('--out');
const outArgInline = process.argv.find((a) => a.startsWith('--out='))?.slice('--out='.length);
const outArgPositional = outFlag !== -1 ? process.argv[outFlag + 1] : null;
const outRel = outArgInline ?? outArgPositional ?? 'public';
const outDir = path.isAbsolute(outRel) ? outRel : path.join(root, outRel);

// ── Helpers ─────────────────────────────────────────────────────────────────

function run(cmd, args, cwd = root) {
  console.log(`  $ ${cmd} ${args.join(' ')}`);
  execFileSync(cmd, args, { cwd, stdio: 'inherit', shell: useShell });
}

function npmRun(args, cwd = root) {
  run('npm', args, cwd);
}

// ── Main ─────────────────────────────────────────────────────────────────────

const slugs = discoverDemoSlugs(demosDir);

if (slugs.length === 0) {
  console.error('demo-build: no demos found under demos/*/ with package.json');
  process.exit(1);
}

console.log(`\ndemo-build: output → ${outDir}`);
console.log(`demo-build: demos  → ${slugs.join(', ')}`);
if (withStorybook) console.log('demo-build: --with-storybook enabled');
console.log('');

// 1. Build lofi-kit so hub assets (CSS) are fresh.
console.log('── step 1/4  build:lofi ──────────────────────────────────────');
npmRun(['run', 'build:lofi']);

// 2. Build each demo.
console.log('\n── step 2/4  build demos ─────────────────────────────────────');
for (const slug of slugs) {
  console.log(`\n  [demo] ${slug}`);
  npmRun(['run', 'build', '-w', slug]);

  // Replace out/<slug>/ cleanly so removed files don't linger.
  const destDir = path.join(outDir, slug);
  const srcDir = path.join(demosDir, slug, 'dist');

  if (!fs.existsSync(srcDir)) {
    console.error(`  ! dist/ not found at ${srcDir} — skipping copy`);
    continue;
  }

  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.mkdirSync(destDir, { recursive: true });
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log(`  → copied ${slug}/dist → ${path.relative(root, destDir)}/`);
}

// 3. Generate hub index + CSS into outDir.
console.log('\n── step 3/4  generate hub ────────────────────────────────────');
run(process.execPath, [
  path.join(root, 'scripts', 'generate-hub.mjs'),
  '--out',
  path.join(outDir, 'index.html'),
]);

// 4. Optionally build Storybook.
if (withStorybook) {
  console.log('\n── step 4/4  build storybook ─────────────────────────────────');
  const sbDir = path.join(outDir, 'storybook');
  if (fs.existsSync(sbDir)) {
    fs.rmSync(sbDir, { recursive: true, force: true });
  }
  npmRun(['run', 'build-storybook', '--', '--output-dir', sbDir]);
} else {
  console.log('\n── step 4/4  storybook skipped (pass --with-storybook to include)');
}

console.log(`\ndemo-build: done — ${path.relative(root, outDir)}/`);
console.log(
  `  preview with:  npx serve ${path.relative(root, outDir)}\n`,
);
