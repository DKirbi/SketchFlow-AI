#!/usr/bin/env node
/**
 * Local dev: hub + one Vite per demo (sequential ports) + Storybook.
 * Hub: http://127.0.0.1:5172/ (opened in the default browser unless OPEN_HUB=0 or CI=1).
 * Demos: /{slug}/ → proxied to Vite (URLs not echoed at info level so IDEs don’t auto-open :5173).
 * Storybook: :6006 (still uses the normal Storybook dev behaviour, typically opens once).
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
const hubDir = path.join(root, '.hub-dev');
const useShell = process.platform === 'win32';
const GATEWAY_PORT = 5172;
const VITE_FIRST_PORT = 5173;
const STORYBOOK_PORT = 6006;

function discoverDemoSlugs() {
  return _discoverDemoSlugs(path.join(root, 'demos'));
}

function matchDemoPath(rawUrl, slugToPort) {
  if (!rawUrl) return null;
  const u = new URL(rawUrl, 'http://127.0.0.1');
  const segments = u.pathname.split('/').filter(Boolean);
  const slug = segments[0];
  if (!slug || !slugToPort.has(slug)) return null;
  // Forward the same path Vite sees when `base` is `/{slug}/` (do not strip the slug).
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

function writeHubIndex() {
  fs.mkdirSync(hubDir, { recursive: true });
  const lofiCss = path.join(root, 'lib/dist/lofi-kit.css');
  if (!fs.existsSync(lofiCss)) {
    console.log('Building lofi-kit (CSS for hub)…');
    execFileSync('npm', ['run', 'build:lofi'], { cwd: root, stdio: 'inherit', shell: useShell });
  }
  execFileSync(
    process.execPath,
    [
      path.join(root, 'scripts', 'generate-hub.mjs'),
      '--out',
      path.join(hubDir, 'index.html'),
      '--dev-gateway',
    ],
    { cwd: root, stdio: 'inherit' },
  );
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
    // upHead is already read from Vite; it belongs on the browser socket (server→client
    // WebSocket bytes). Writing it to upSocket sends unmasked frames back into Vite and
    // triggers WS_ERR_EXPECTED_MASK / dev server crash.
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

writeHubIndex();

const slugToPort = new Map();
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

const skipStorybook = process.env.SKIP_STORYBOOK === '1';
let storyChild = null;
if (!skipStorybook) {
  storyChild = spawn('npm', ['run', 'storybook'], { cwd: root, stdio: 'inherit', shell: useShell });
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

async function main() {
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

  const indexPath = path.join(hubDir, 'index.html');
  const server = http.createServer((req, res) => {
    const url = req.url || '/';
    if (url === '/' || url === '/index.html') {
      fs.readFile(indexPath, (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Hub index missing');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(data);
      });
      return;
    }

    const pathname = new URL(url, 'http://127.0.0.1').pathname;
    const staticRel = pathname.replace(/^\//, '');
    if (staticRel && staticRel !== 'index.html' && !staticRel.includes('..')) {
      const filePath = path.join(hubDir, staticRel);
      if (
        filePath.startsWith(hubDir) &&
        fs.existsSync(filePath) &&
        fs.statSync(filePath).isFile()
      ) {
        const ext = path.extname(filePath).toLowerCase();
        const types = {
          '.css': 'text/css; charset=utf-8',
          '.html': 'text/html; charset=utf-8',
          '.svg': 'image/svg+xml',
        };
        const ct = types[ext] ?? 'application/octet-stream';
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Read error');
            return;
          }
          res.writeHead(200, { 'Content-Type': ct });
          res.end(data);
        });
        return;
      }
    }

    const m = matchDemoPath(url, slugToPort);
    if (m) {
      forwardHttp(req, res, m.port, m.rest);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  });

  server.on('upgrade', (req, socket, head) => {
    const m = matchDemoPath(req.url || '', slugToPort);
    if (!m) {
      socket.destroy();
      return;
    }
    forwardWs(req, socket, head, m.port, m.rest);
  });

  server.listen(GATEWAY_PORT, '127.0.0.1', () => {
    const hubUrl = `http://127.0.0.1:${GATEWAY_PORT}/`;
    console.log('');
    console.log(`Hub (table of contents): ${hubUrl}`);
    for (const slug of slugs) {
      console.log(`  ${slug} → http://127.0.0.1:${slugToPort.get(slug)}/ (via hub: /${slug}/)`);
    }
    if (!skipStorybook) {
      console.log(`Storybook: http://127.0.0.1:${STORYBOOK_PORT}/`);
    }
    console.log('');
    openHubInBrowser(hubUrl);
  });
}

main().catch((e) => {
  console.error(e);
  shutdown();
});
