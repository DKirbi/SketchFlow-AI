import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';
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
  viteFinal: async (config) =>
    mergeConfig(config, {
      // Podium lists Mantine as peerDependencies (not vendored). devDependencies
      // install them for Vite; dedupe keeps one copy when Storybook prebundles Podium.
      // Prevent Vite from copying the project's public/ directory into the
      // Storybook output. Without this, any prior contents of public/ (including
      // public/storybook/ itself) are nested inside the Storybook build, causing
      // a double storybook/storybook/ path on static hosts.
      publicDir: false,
      resolve: {
        dedupe: ['@mantine/core', '@mantine/hooks', '@mantine/dates'],
        alias: {
          'lofi-kit': path.resolve(dirname, '../lib/src/index.ts'),
        },
      },
    }),
};

export default config;
