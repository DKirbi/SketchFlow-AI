import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const dir = path.dirname(fileURLToPath(import.meta.url));
const showcaseHub =
  process.env.LOFI_SHOWCASE_HUB === '1' || process.env.LOFI_PORTFOLIO === '1';
const viaHub = process.env.LOFI_VIA_HUB === '1';
const hubPort = Number(process.env.LOFI_HUB_PORT ?? 5172);
const demoSlug = path.basename(dir);

export default defineConfig({
  plugins: [react()],
  // Portfolio / gateway hub: SPA at site root. Standalone: relative assets.
  base: showcaseHub ? '/' : viaHub ? `/${demoSlug}/` : './',
  server: {
    ...(viaHub && {
      hmr: { host: '127.0.0.1', clientPort: hubPort },
    }),
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(dir, '../../lib/src/styles')],
      },
    },
  },
  resolve: {
    alias: {
      'lofi-kit': path.resolve(dir, '../../lib/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
