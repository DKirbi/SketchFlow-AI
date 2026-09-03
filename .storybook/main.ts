import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../lib/stories/**/*.mdx', '../lib/stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      savePropValueAsString: true,
    },
  },
  viteFinal: async (config) => {
    const embedBase = process.env.LOFI_EMBED_BASE;
    return mergeConfig(config, {
      base: embedBase
        ? embedBase.endsWith('/')
          ? embedBase
          : `${embedBase}/`
        : config.base,
      server: {
        // Hub proxies via 127.0.0.1:5172; Storybook rejects that host unless allowed.
        host: '127.0.0.1',
        allowedHosts: true,
      },
      plugins: [tailwindcss()],
      // Prevent Vite from copying the project's public/ directory into the
      // Storybook output. Without this, any prior contents of public/ (including
      // public/storybook/ itself) are nested inside the Storybook build, causing
      // a double storybook/storybook/ path on static hosts.
      publicDir: false,
      resolve: {
        alias: {
          'lofi-kit': path.resolve(dirname, '../lib/src/index.ts'),
        },
      },
    });
  },
};

export default config;
