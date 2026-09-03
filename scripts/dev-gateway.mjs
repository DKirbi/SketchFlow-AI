#!/usr/bin/env node
/**
 * Local dev: UX Showcase hub (sketchflow-showcase at /) + Vite demos + Storybook embeds.
 * Hub: http://127.0.0.1:5172/
 * SPA routes: /Sportradar, /Sportradar/<project>, …
 * Embeds: /embeds/<slug>/ → Vite or Storybook
 * Other demos (not on hub): /<slug>/ still proxied for direct access
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { discoverDemoSlugs as _discoverDemoSlugs } from './lib/discover-demos.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const useShell = process.platform === 'win32';
const GATEWAY_PORT = 5172;
const VITE_FIRST_PORT = 5173;
const STORYBOOK_PORT = 6006;
const SHOWCASE_SLUG = 'sketchflow-showcase';

/** Curated portfolio embeds (iframe targets under the showcase chrome). */
const EMBED_PREFIXES = {
  'bracket-demo': '/embeds/bracket-demo/',
  'tournament-management': '/embeds/tournament-management/',
};
const STORYBOOK_EMBED_PREFIX = '/embeds/low-fi-ux-ui-patterns/';

function discoverDemoSlugs() {
  return _discoverDemoSlugs(path.join(root, 'demos'));
}

function matchEmbed(rawUrl, embedToPort, storybook) {
  if (!rawUrl) return null;
  const u = new URL(rawUrl, 'http://127.0.0.1');
  const pathname = u.pathname || '/';

  // Do NOT forward bare /@vite, /node_modules, etc. to Storybook — those belong
  // to the showcase SPA on /. Local Storybook is iframe'd to :6006 directly
  // (see resolveEmbedSrc). Only the /embeds/low-fi-… prefix is proxied here.
  if (storybook?.port) {
    const prefix = storybook.prefix.endsWith('/')
      ? storybook.prefix
      : `${storybook.prefix}/`;
    if (pathname === prefix.slice(0, -1) || pathname.startsWith(prefix)) {
      const stripped =
        pathname === prefix.slice(0, -1)
          ? '/'
          : `/${pathname.slice(prefix.length)}`;
      return { port: storybook.port, rest: stripped + u.search };
    }
  }

  for (const [prefix, port] of embedToPort) {
    const normalized = prefix.endsWith('/') ? prefix : `${prefix}/`;
    if (pathname === normalized.slice(0, -1) || pathname.startsWith(normalized)) {
      return { port, rest: pathname + u.search };
    }
  }
  return null;
}

function matchDemoPath(rawUrl, slugToPort) {
  if (!rawUrl) return null;
  const u = new URL(rawUrl, 'http://127.0.0.1');
  const segments = u.pathname.split('/').filter(Boolean);
  const slug = segments[0];
  if (!slug || !slugToPort.has(slug)) return null;
  // Showcase owns `/` — do not treat /sketchflow-showcase as the hub entry.
  if (slug === SHOWCASE_SLUG) return null;
  const rest = (u.pathname || '/') + u.search;
  return { slug, rest, port: slugToPort.get(slug) };
}

function openHubInBrowser(url) {
  if (process.env.CI || process.env.OPEN_HUB === '0') return;
  try {
    if (process.platform === 'darwin') {
      execFileSync('open', [url], { stdio: 'ignore' });
    } else if (process.platform === 'win32') {
      execFileSync('cmd', ['/c', 'start', '', url], { stdio: 'ignore', windowsHide: true });
    } else {
      execFileSync('xdg-open', [url], { stdio: 'ignore' });
    }
  } catch {
    /* no default browser, sandbox, etc. */
  }
}

function waitPort(port, { timeoutMs = 90_000, host = '127.0.0.1' } = {}) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      const socket = net.connect({ port, host }, () => {
        socket.end();
        resolve(undefined);
      });
      socket.on('error', () => {
        socket.destroy();
        if (Date.now() - start > timeoutMs) {
          reject(new Error(`Timeout waiting for ${host}:${port}`));
        } else {
          setTimeout(tryOnce, 250);
        }
      });
    };
    tryOnce();
  });
}

function forwardHttp(clientReq, clientRes, port, pathForUpstream) {
  const hdr = { ...clientReq.headers };
  hdr.host = `127.0.0.1:${port}`;
  const opts = {
    hostname: '127.0.0.1',
    port,
    path: pathForUpstream,
    method: clientReq.method,
    headers: hdr,
  };
  const upstream = http.request(opts, (upRes) => {
    clientRes.writeHead(upRes.statusCode ?? 502, upRes.headers);
    upRes.pipe(clientRes);
  });
  upstream.on('error', () => {
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    }
    clientRes.end('Bad gateway');
  });
  clientReq.pipe(upstream);
}

function forwardWs(clientReq, clientSocket, head, port, pathForUpstream) {
  const hdr = { ...clientReq.headers };
  hdr.host = `127.0.0.1:${port}`;
  const proxyReq = http.request({
    hostname: '127.0.0.1',
    port,
    path: pathForUpstream,
    method: clientReq.method,
    headers: hdr,
  });
  proxyReq.on('response', (res) => {
    if (res.statusCode === 101) return;
    if (!clientSocket.destroyed) clientSocket.destroy();
  });
  proxyReq.on('upgrade', (upRes, upSocket, upHead) => {
    let raw = `HTTP/1.1 ${upRes.statusCode} ${upRes.statusMessage}\r\n`;
    for (const [k, v] of Object.entries(upRes.headers)) {
      if (v === undefined || v === null) continue;
      if (Array.isArray(v)) {
        for (const part of v) raw += `${k}: ${part}\r\n`;
      } else {
        raw += `${k}: ${v}\r\n`;
      }
    }
    raw += '\r\n';
    clientSocket.write(raw);
    if (upHead?.length) clientSocket.write(upHead);
    upSocket.pipe(clientSocket);
    clientSocket.pipe(upSocket);
    upSocket.on('error', () => clientSocket.destroy());
    clientSocket.on('error', () => upSocket.destroy());
  });
  proxyReq.on('error', () => clientSocket.destroy());
  proxyReq.end(head?.length ? head : undefined);
}

const slugs = discoverDemoSlugs();
if (slugs.length === 0) {
  console.error('No demos found under demos/*/ with package.json');
  process.exit(1);
}
if (!slugs.includes(SHOWCASE_SLUG)) {
  console.error(`Required demo "${SHOWCASE_SLUG}" not found`);
  process.exit(1);
}

const slugToPort = new Map();
const embedToPort = new Map();
const children = [];

for (let i = 0; i < slugs.length; i++) {
  const slug = slugs[i];
  const port = VITE_FIRST_PORT + i;
  slugToPort.set(slug, port);

  const viteEnv = {
    ...process.env,
    BROWSER: 'none',
    LOFI_VIA_HUB: '1',
    LOFI_HUB_PORT: String(GATEWAY_PORT),
  };

  if (slug === SHOWCASE_SLUG) {
    viteEnv.LOFI_SHOWCASE_HUB = '1';
  }

  if (EMBED_PREFIXES[slug]) {
    viteEnv.LOFI_EMBED_BASE = EMBED_PREFIXES[slug];
    embedToPort.set(EMBED_PREFIXES[slug], port);
  }

  const child = spawn(
    'npm',
    [
      'run',
      'dev',
      '-w',
      slug,
      '--',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
      '--open',
      'false',
      '--logLevel',
      'warn',
    ],
    { cwd: root, stdio: 'inherit', shell: useShell, env: viteEnv },
  );
  children.push(child);
}

const showcasePort = slugToPort.get(SHOWCASE_SLUG);

const skipStorybook = process.env.SKIP_STORYBOOK === '1';
let storyChild = null;
if (!skipStorybook) {
  // Do not set LOFI_EMBED_BASE for storybook *dev* — Storybook's manager ignores
  // Vite base and keeps serving `/`. Gateway strips the embed prefix instead.
  // Production `build:showcase` still sets LOFI_EMBED_BASE for the static build.
  storyChild = spawn('npm', ['run', 'storybook'], {
    cwd: root,
    stdio: 'inherit',
    shell: useShell,
    env: {
      ...process.env,
      CI: '1',
      STORYBOOK_DISABLE_TELEMETRY: '1',
    },
  });
  children.push(storyChild);
}

function shutdown() {
  for (const c of children) {
    try {
      c.kill('SIGINT');
    } catch {
      /* ignore */
    }
  }
  process.exit(0);
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function resolveUpstream(url) {
  const embed = matchEmbed(url, embedToPort, {
    prefix: STORYBOOK_EMBED_PREFIX,
    port: skipStorybook ? null : STORYBOOK_PORT,
  });
  if (embed) return embed;

  const demo = matchDemoPath(url, slugToPort);
  if (demo) return { port: demo.port, rest: demo.rest };

  // Everything else (including /) → UX Showcase SPA
  const u = new URL(url || '/', 'http://127.0.0.1');
  return { port: showcasePort, rest: (u.pathname || '/') + u.search };
}

async function main() {
  // Ensure lofi CSS exists for any local tooling; hub is now the React SPA.
  const lofiCss = path.join(root, 'lib/dist/lofi-kit.css');
  if (!fs.existsSync(lofiCss)) {
    console.log('Building lofi-kit (CSS)…');
    execFileSync('npm', ['run', 'build:lofi'], {
      cwd: root,
      stdio: 'inherit',
      shell: useShell,
    });
  }

  console.log('Starting Vite dev servers…');
  await Promise.all(slugs.map((_, i) => waitPort(VITE_FIRST_PORT + i)));

  if (!skipStorybook) {
    console.log('Waiting for Storybook…');
    try {
      await waitPort(STORYBOOK_PORT, { timeoutMs: 120_000 });
    } catch (e) {
      console.warn(String(e?.message ?? e));
      console.warn(`Storybook not ready on :${STORYBOOK_PORT}; open it when the build finishes.`);
    }
  }

  const server = http.createServer((req, res) => {
    const upstream = resolveUpstream(req.url || '/');
    forwardHttp(req, res, upstream.port, upstream.rest);
  });

  server.on('upgrade', (req, socket, head) => {
    const upstream = resolveUpstream(req.url || '/');
    forwardWs(req, socket, head, upstream.port, upstream.rest);
  });

  server.listen(GATEWAY_PORT, '127.0.0.1', () => {
    const hubUrl = `http://127.0.0.1:${GATEWAY_PORT}/`;
    console.log('');
    console.log(`UX Showcase hub: ${hubUrl}`);
    console.log(`  Sportradar → ${hubUrl}Sportradar`);
    for (const [prefix, port] of embedToPort) {
      console.log(`  embed ${prefix} → :${port}`);
    }
    if (!skipStorybook) {
      console.log(
        `  embed ${STORYBOOK_EMBED_PREFIX} → :${STORYBOOK_PORT} (prefix stripped)`,
      );
    }
    for (const slug of slugs) {
      if (slug === SHOWCASE_SLUG || EMBED_PREFIXES[slug]) continue;
      console.log(`  ${slug} → /${slug}/ (via hub)`);
    }
    if (!skipStorybook) {
      console.log(`Storybook (direct): http://127.0.0.1:${STORYBOOK_PORT}/`);
    }
    console.log('');
    openHubInBrowser(hubUrl);
  });
}

main().catch((e) => {
  console.error(e);
  shutdown();
});
