import type { Meta, StoryObj } from '@storybook/react';
import { LOFIChip } from 'lofi-kit';

const meta: Meta<typeof LOFIChip> = {
  title: 'LOW FI Design system/Primitives/Chip',
  component: LOFIChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Dismissible active-filter token (P9). Label plus a compact ✕. Use in filter chip strips; optional `title` is the native tooltip. Not a selectable filter chip — dismissing always calls `onDismiss`.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIChip>;

export const Default: Story = {
  args: { label: 'Sport: Soccer', onDismiss: () => {} },
  parameters: { docs: { description: { story: 'Label + dismiss. Wire `onDismiss` to remove the filter from query state.' } } },
};

export const WithTitle: Story = {
  args: { label: 'Date from: 2024-01-01', title: 'Remove date-from filter', onDismiss: () => {} },
  parameters: { docs: { description: { story: '`title` is the hover tooltip on the chip surface.' } } },
};
