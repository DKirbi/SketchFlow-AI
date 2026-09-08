#!/usr/bin/env node
/**
 * Build the UX Showcase portfolio (Vercel / static host).
 *
 * Output (default: demos/sketchflow-showcase/dist):
 *   <out>/                              ← showcase SPA (hub + SPA projects)
 *   <out>/embeds/bracket-demo/          ← Bracket Demo
 *   <out>/embeds/tournament-management/ ← Tournament Management
 *   <out>/embeds/low-fi-ux-ui-patterns/ ← Storybook
 *
 * Usage:
 *   node scripts/showcase-build.mjs
 *   node scripts/showcase-build.mjs --out public
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const demosDir = path.join(root, 'demos');
const useShell = process.platform === 'win32';

const EMBED_DEMOS = [
  { slug: 'bracket-demo', embedDir: 'bracket-demo' },
  { slug: 'tournament-management', embedDir: 'tournament-management' },
];
const STORYBOOK_EMBED_DIR = 'low-fi-ux-ui-patterns';

const outFlag = process.argv.indexOf('--out');
const outArgInline = process.argv.find((a) => a.startsWith('--out='))?.slice('--out='.length);
const outArgPositional = outFlag !== -1 ? process.argv[outFlag + 1] : null;
// Vercel Root Directory = lib: npm runs workspace scripts with cwd/INIT_CWD
// inside lofi-kit, and outputDirectory is resolved relative to lib/.
const npmInitCwd = process.env.INIT_CWD
  ? path.resolve(process.env.INIT_CWD)
  : process.cwd();
const vercelRootIsLib =
  Boolean(process.env.VERCEL) && path.resolve(npmInitCwd) === path.join(root, 'lib');
const defaultOutRel = vercelRootIsLib
  ? path.join('lib', 'demos', 'sketchflow-showcase', 'dist')
  : path.join('demos', 'sketchflow-showcase', 'dist');
const outRel = outArgInline ?? outArgPositional ?? defaultOutRel;
const outDir = path.isAbsolute(outRel) ? outRel : path.join(root, outRel);

function run(cmd, args, cwd = root, env = process.env) {
  console.log(`  $ ${cmd} ${args.join(' ')}`);
  execFileSync(cmd, args, { cwd, stdio: 'inherit', shell: useShell, env });
}

function npmRun(args, cwd = root, env = process.env) {
  run('npm', args, cwd, env);
}

function copyDir(src, dest) {
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.cpSync(src, dest, { recursive: true });
}

if (vercelRootIsLib) {
  console.log('showcase-build: Vercel Root Directory is lib/; writing output under lib/demos/');
}
console.log(`\nshowcase-build: output → ${outDir}\n`);

console.log('── step 1/4  build:lofi ──────────────────────────────────────');
npmRun(['run', 'build:lofi']);

console.log('\n── step 2/4  build showcase SPA ─────────────────────────────');
const spaEnv = { ...process.env, LOFI_PORTFOLIO: '1' };
npmRun(['run', 'build', '-w', 'sketchflow-showcase'], root, spaEnv);

const spaDist = path.join(demosDir, 'sketchflow-showcase', 'dist');
if (!fs.existsSync(spaDist)) {
  console.error(`showcase-build: missing ${spaDist}`);
  process.exit(1);
}

// If outDir is the SPA dist itself, keep it and add embeds beside it.
// Otherwise copy SPA into outDir first.
if (path.resolve(outDir) !== path.resolve(spaDist)) {
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir, { recursive: true });
  fs.cpSync(spaDist, outDir, { recursive: true });
  console.log(`  → SPA → ${path.relative(root, outDir)}/`);
} else {
  console.log('  → SPA already in target dist/');
}

console.log('\n── step 3/4  build embed demos ──────────────────────────────');
for (const { slug, embedDir } of EMBED_DEMOS) {
  const embedBase = `/embeds/${embedDir}/`;
  console.log(`\n  [embed] ${slug} (base ${embedBase})`);
  npmRun(['run', 'build', '-w', slug], root, {
    ...process.env,
    LOFI_EMBED_BASE: embedBase,
  });
  const srcDir = path.join(demosDir, slug, 'dist');
  if (!fs.existsSync(srcDir)) {
    console.error(`  ! dist/ not found at ${srcDir}`);
    process.exit(1);
  }
  const destDir = path.join(outDir, 'embeds', embedDir);
  copyDir(srcDir, destDir);
  console.log(`  → ${path.relative(root, destDir)}/`);
}

console.log('\n── step 4/4  build Storybook embed ──────────────────────────');
const sbBase = `/embeds/${STORYBOOK_EMBED_DIR}/`;
const sbDir = path.join(outDir, 'embeds', STORYBOOK_EMBED_DIR);
if (fs.existsSync(sbDir)) {
  fs.rmSync(sbDir, { recursive: true, force: true });
}
npmRun(
  ['run', 'build-storybook', '--', '--output-dir', sbDir],
  root,
  { ...process.env, LOFI_EMBED_BASE: sbBase },
);

// Ensure vercel.json is present next to the SPA for deploys from this folder.
const vercelSrc = path.join(demosDir, 'sketchflow-showcase', 'vercel.json');
const vercelDest = path.join(outDir, 'vercel.json');
if (fs.existsSync(vercelSrc) && path.resolve(outDir) !== path.resolve(spaDist)) {
  fs.copyFileSync(vercelSrc, vercelDest);
}

console.log(`\nshowcase-build: done — ${path.relative(root, outDir)}/`);
console.log(`  preview: npx serve ${path.relative(root, outDir)}\n`);
