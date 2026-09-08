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
import '../lib/stories/shadcn/globals.css';
import React from 'react';

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Introduction',
          'PATTERNS',
          ['UX Patterns', 'UI Patterns'],
          'LOW FI Design system',
          [
            'LOFI Kit',
            'Primitives',
            [
              'Overview',
              'Badge',
              'Button',
              'Card',
              'Checkbox',
              'Chip',
              'EmptyState',
              'Field',
              'Fieldset',
              'InlineAlert',
              'Input',
              'Loader',
              'MainWorkspace',
              'Modal',
              'MultiSelect',
              'NavTree',
              'Pagination',
              'Panel',
              'Radio',
              'Select',
              'StatefulButton',
              'Steps',
              'Switch',
              'Table',
              'Tabs',
              'Text',
              'Textarea',
              'Toast',
              'Toggle',
              'Toolbar',
            ],
            'Component sets',
            [
              'Overview',
              'Action cluster',
              'Upper bar',
              'Filter query row',
              'Sidebar',
              'Main workspace',
              'Summary card',
              'List header',
              'Table chrome',
              'Modal editor',
              'P7 confirm',
              'Tool shell',
              'UPL shell',
            ],
            'Diagram',
          ],
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
          <Description />
          <Primary />
          <Controls />
          <Stories />
          <ArgTypes sort="none" />
        </>
      ),
    },
  },
};

export default preview;
