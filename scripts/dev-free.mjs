#!/usr/bin/env node
/**
 * Free ports used by `npm run dev` (gateway :5172, demo Vite :5173+, Storybook :6007).
 * Prefer this over `pkill -f vite`, which can kill unrelated projects.
 */
import { execFileSync } from 'node:child_process';

const FIRST_VITE = 5172;
const LAST_VITE = 5185;
const STORYBOOK = 6007;

function listeningPids(port) {
  try {
    const out = execFileSync(
      'lsof',
      ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    );
    return [...new Set(out.trim().split(/\n/).filter(Boolean))];
  } catch {
    return [];
  }
}

function alive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const ports = [];
for (let port = FIRST_VITE; port <= LAST_VITE; port += 1) ports.push(port);
ports.push(STORYBOOK);

const byPid = new Map();
for (const port of ports) {
  for (const raw of listeningPids(port)) {
    const pid = Number(raw);
    if (!Number.isInteger(pid) || pid <= 0) continue;
    const list = byPid.get(pid) ?? [];
    list.push(port);
    byPid.set(pid, list);
  }
}

if (byPid.size === 0) {
  console.log('No listeners on hub ports (5172–5185, 6007).');
  process.exit(0);
}

console.log(`Stopping ${byPid.size} process(es) on hub ports:`);
for (const [pid, bound] of byPid) {
  console.log(`  pid ${pid}  :${bound.join(', :')}`);
  try {
    process.kill(pid, 'SIGTERM');
  } catch {
    /* already gone */
  }
}

await sleep(500);

let leftover = 0;
for (const pid of byPid.keys()) {
  if (!alive(pid)) continue;
  leftover += 1;
  try {
    process.kill(pid, 'SIGKILL');
  } catch {
    /* ignore */
  }
}

if (leftover > 0) {
  await sleep(200);
}

const still = [];
for (const port of ports) {
  if (listeningPids(port).length > 0) still.push(port);
}

if (still.length > 0) {
  console.error(`Still in use: ${still.map((p) => `:${p}`).join(', ')}`);
  process.exit(1);
}

console.log('Hub ports are free.');
