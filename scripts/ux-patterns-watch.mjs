/**
 * Watches UX pattern docs, UX flows doc, registry, and flow story exports; runs validation on change.
 * Usage: node scripts/ux-patterns-watch.mjs
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import chokidar from 'chokidar';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const WATCH = [
  path.join(root, 'docs', 'UX_PATTERNS.md'),
  path.join(root, 'docs', 'UX_PATTERN_STORIES.md'),
  path.join(root, 'docs', 'patterns-registry.json'),
  path.join(root, 'lib', 'stories', 'UXFlows.stories.tsx'),
];

let timer = null;

function runCheck() {
  const proc = spawn(process.execPath, [path.join(root, 'scripts', 'ux-patterns-process.mjs')], {
    stdio: 'inherit',
    cwd: root,
  });
  proc.on('exit', (code) => {
    if (code === 0) {
      console.log('[ux-patterns-watch] Storybook dev server will hot-reload ?raw imports when running.');
    }
  });
}

function debouncedRun() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    timer = null;
    console.log('\n[ux-patterns-watch] Running check…\n');
    runCheck();
  }, 300);
}

console.log('ux-patterns-watch: watching', WATCH.join(', '));
chokidar.watch(WATCH, { ignoreInitial: true }).on('all', debouncedRun);
runCheck();
