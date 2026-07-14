import type { Preview } from '@storybook/react';
import {
  Title,
  Subtitle,
  Description,
  Primary,
  Controls,
  Stories,
  ArgTypes,
} from '@storybook/addon-docs/blocks';
import '../lib/src/styles/index.scss';
import '@xyflow/react/dist/style.css';
import React from 'react';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Introduction',
          'PATTERNS',
          ['PATTERNS/UX Patterns', 'PATTERNS/UI Patterns', 'PATTERNS/LOFI Kit'],
          'UI',
          'Diagram',
        ],
      },
    },
    backgrounds: { default: 'paper', values: [{ name: 'paper', value: '#fff' }] },
    layout: 'centered',
    docs: {
      toc: true,
      codePanel: true,
      source: { type: 'dynamic' },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Primary />
          <Description />
          <Controls />
          <Stories />
          <ArgTypes sort="none" />
        </>
      ),
    },
  },
};

export default preview;
