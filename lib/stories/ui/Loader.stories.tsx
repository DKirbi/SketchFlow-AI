import type { Meta, StoryObj } from '@storybook/react';
import { LOFILoader } from 'lofi-kit';

const meta: Meta<typeof LOFILoader> = {
  title: 'LOW FI Design system/Primitives/Loader',
  component: LOFILoader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Animated ellipsis indicator. Optional `label` prefix (e.g. Saving renders Saving…). Use for async feedback on buttons and inline loading states. Prefer `LOFIStatefulButton` when the control itself is the save action (P3).',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFILoader>;

export const Dots: Story = {
  args: {},
  parameters: { docs: { description: { story: 'Ellipsis only — nest inside a compact region.' } } },
};

export const WithLabel: Story = {
  args: { label: 'Saving' },
  parameters: { docs: { description: { story: 'Prefix label plus animated dots.' } } },
};
