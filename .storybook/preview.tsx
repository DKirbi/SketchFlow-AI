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
import { bootEmbeddedLofiTheme } from 'lofi-kit';
import { bootDocLocale } from '../lib/stories/docLocale';

bootEmbeddedLofiTheme();
bootDocLocale();

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: [
          'Introduction',
          'PATTERNS',
          [
            'UX Patterns',
            [
              'P1 Workspace',
              [
                'P1.1: UPL Shell',
                'P1.2: Internal Workspace',
                'P1.2.1: Filter Row',
                'P1.2.2: Sidebar',
                'P1.2.3: Main Interface View',
                'P1.2.3.1: Heading Bar',
                'P1.2.3.2: Footer',
                'P1.2.3.3: Main Content',
              ],
              'P2 Data Table',
              [
                'P2.1: Table Structure',
                'P2.2: Row Actions',
                'P2.3: Table Column Controls',
                'P2.4: Bulk Operations',
                'P2.5: Expandable rows',
              ],
              'P3 Stateful Button',
              'P4 Toast notification',
              'P5 Modal',
              'P6 Inline Validation',
              'P7 Confirmation dialog',
              'P8 Tab navigation',
              'P9 Filters',
              'P10 Sticky disclosure',
            ],
            'UI Patterns',
          ],
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
              'Filter chip group',
              'Sidebar',
              'Main workspace',
              'Summary card',
              'List header',
              'Table chrome',
              'Suggestion row',
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
    backgrounds: { default: 'paper', values: [{ name: 'paper', value: 'var(--lofi-paper)' }] },
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
