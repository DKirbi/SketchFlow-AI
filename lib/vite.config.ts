import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(dir, 'src/index.ts'),
      name: 'LofiKit',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'lofi-kit.js' : 'lofi-kit.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', '@tanstack/react-table', '@xyflow/react'],
      output: {
        assetFileNames: 'lofi-kit.[ext]',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
  },
});
