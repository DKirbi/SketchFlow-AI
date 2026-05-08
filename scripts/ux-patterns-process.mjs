/**
 * Validates docs/UX_PATTERNS.md against docs/patterns-registry.json and
 * lib/stories/UXFlows.stories.tsx (embed exports exist).
 * Run: node scripts/ux-patterns-process.mjs
 * CI: npm run ux-patterns:check
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const MD_PATH = path.join(root, 'docs', 'UX_PATTERNS.md');
const PATTERN_STORIES_MD_PATH = path.join(root, 'docs', 'UX_PATTERN_STORIES.md');
const REGISTRY_PATH = path.join(root, 'docs', 'patterns-registry.json');
const STORIES_PATH = path.join(root, 'lib', 'stories', 'UXFlows.stories.tsx');

function readText(p) {
  return fs.readFileSync(p, 'utf8');
}

function sliceBetween(md, startRe, endRe) {
  const s = md.search(startRe);
  if (s === -1) return null;
  const e = md.search(endRe);
  if (e === -1 || e <= s) return null;
  return md.slice(s, e);
}

function topLevelPatternHeadings(patternsBlock) {
  const re = /^### (P\d+):\s*(.+)$/gm;
  const out = [];
  let m;
  while ((m = re.exec(patternsBlock)) !== null) {
    out.push({ id: m[1], rest: m[2].trim() });
  }
  return out;
}

function topLevelRuleHeadings(interactionBlock) {
  const re = /^### (R[1-7]):\s*(.+)$/gm;
  const out = [];
  let m;
  while ((m = re.exec(interactionBlock)) !== null) {
    out.push({ id: m[1], rest: m[2].trim() });
  }
  return out;
}

function extractStoryExports(storiesSource) {
  const re = /^export const (\w+)(?::|\s*=)/gm;
  const names = new Set();
  let m;
  while ((m = re.exec(storiesSource)) !== null) {
    names.add(m[1]);
  }
  return names;
}

function extractEmbedNames(md) {
  const re = /<!--\s*storybook:embed\s+(\w+)\s*-->/g;
  const names = [];
  let m;
  while ((m = re.exec(md)) !== null) {
    names.push(m[1]);
  }
  return names;
}

function main() {
  const errors = [];
  const md = readText(MD_PATH);
  const patternStoriesMd = fs.existsSync(PATTERN_STORIES_MD_PATH)
    ? readText(PATTERN_STORIES_MD_PATH)
    : '';
  const registry = JSON.parse(readText(REGISTRY_PATH));
  const storiesSrc = readText(STORIES_PATH);
  const exports = extractStoryExports(storiesSrc);

  const patternsBlock = sliceBetween(md, /^## Patterns$/m, /^## How to use this file$/m);
  if (!patternsBlock) {
    errors.push('Could not find ## Patterns … ## How to use this file region.');
  } else {
    const headings = topLevelPatternHeadings(patternsBlock);
    const expected = registry.topLevelPatternOrder.map((x) => x.id);
    const found = headings.map((h) => h.id);
    if (found.length !== expected.length || !expected.every((id, i) => id === found[i])) {
      errors.push(
        `Top-level pattern ### headings (P1–P10) order mismatch.\n  Expected: ${expected.join(', ')}\n  Found:    ${found.join(', ')}`,
      );
    }
  }

  const interactionBlock = sliceBetween(md, /^## Interaction rules$/m, /^## UX Flows$/m);
  if (!interactionBlock) {
    errors.push('Could not find ## Interaction rules … ## UX Flows region.');
  } else {
    const rHeadings = topLevelRuleHeadings(interactionBlock);
    const expectedR = registry.interactionRuleOrder.map((x) => x.id);
    const foundR = rHeadings.map((h) => h.id);
    if (foundR.length !== expectedR.length || !expectedR.every((id, i) => id === foundR[i])) {
      errors.push(
        `Interaction rule ### headings (R1–R7) order mismatch.\n  Expected: ${expectedR.join(', ')}\n  Found:    ${foundR.join(', ')}`,
      );
    }
  }

  const embeds = [...extractEmbedNames(md), ...extractEmbedNames(patternStoriesMd)];
  for (const name of embeds) {
    if (!exports.has(name)) {
      errors.push(
        `storybook:embed ${name} — no matching export in UXFlows.stories.tsx`,
      );
    }
  }

  if (errors.length > 0) {
    console.error('ux-patterns-process: validation failed\n');
    for (const e of errors) {
      console.error(`  • ${e}\n`);
    }
    process.exit(1);
  }

  console.log('ux-patterns-process: OK (patterns, interaction rules, embed exports)');
}

main();
