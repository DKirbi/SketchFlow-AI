import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const dir = path.dirname(fileURLToPath(import.meta.url));
const viaHub = process.env.LOFI_VIA_HUB === '1';
const hubPort = Number(process.env.LOFI_HUB_PORT ?? 5172);
const demoSlug = path.basename(dir);

export default defineConfig({
  plugins: [react()],
  base: viaHub ? `/${demoSlug}/` : './',
  build: {
    // Main chunk still includes Podium + Mantine + global CSS; dock is split via React.lazy.
    chunkSizeWarningLimit: 800,
  },
  server: {
    ...(viaHub && {
      hmr: { host: '127.0.0.1', clientPort: hubPort },
    }),
  },
  resolve: {
    dedupe: ['@mantine/core', '@mantine/hooks', '@mantine/dates', 'react', 'react-dom'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    passWithNoTests: true,
  },
});
