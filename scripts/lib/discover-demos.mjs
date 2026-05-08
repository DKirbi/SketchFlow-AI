/**
 * Shared demo-discovery utility.
 * Used by generate-hub.mjs, dev-gateway.mjs, and demo-build.mjs so that
 * slug rules, sort order, and metadata never drift between scripts.
 */
import fs from 'node:fs';
import path from 'node:path';

function kebabToTitle(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Discover all demo workspaces under `demosDir`.
 *
 * Returns full demo objects (slug, title, description) sorted so that
 * `bracket-demo` always comes first, then alphabetical.
 *
 * @param {string} demosDir  Absolute path to the `demos/` directory.
 * @returns {{ slug: string; title: string; description: string }[]}
 */
export function discoverDemos(demosDir) {
  if (!fs.existsSync(demosDir)) return [];

  return fs
    .readdirSync(demosDir)
    .filter((name) => {
      const dir = path.join(demosDir, name);
      const includeHifi = process.env.INCLUDE_HIFI_DEMOS === '1';
      return (
        fs.statSync(dir).isDirectory() &&
        fs.existsSync(path.join(dir, 'package.json')) &&
        (includeHifi || !name.endsWith('-hifi'))
      );
    })
    .map((name) => {
      const pkg = JSON.parse(
        fs.readFileSync(path.join(demosDir, name, 'package.json'), 'utf8'),
      );
      return {
        slug: name,
        title: pkg.displayName || kebabToTitle(name),
        description: pkg.description || '',
      };
    })
    .sort((a, b) => {
      if (a.slug === 'bracket-demo') return -1;
      if (b.slug === 'bracket-demo') return 1;
      return a.slug.localeCompare(b.slug);
    });
}

/**
 * Return only the slug strings (e.g. for dev-gateway port mapping).
 * Same sort order as discoverDemos().
 *
 * @param {string} demosDir  Absolute path to the `demos/` directory.
 * @returns {string[]}
 */
export function discoverDemoSlugs(demosDir) {
  return discoverDemos(demosDir).map((d) => d.slug);
}
