import type { Meta, StoryObj } from '@storybook/react';
import { LOFIButton } from 'lofi-kit';

const meta: Meta<typeof LOFIButton> = {
  title: 'UI / Button',
  component: LOFIButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Triggers an action. Three roles cover all PO-visible interactions — no other variants needed at this fidelity.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'default', 'dismiss'] },
    size:    { control: 'select', options: ['default', 'compact'] },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIButton>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Primary action' },
  parameters: { docs: { description: { story: 'The single main CTA per screen or modal footer. One primary per view.' } } },
};

export const Default: Story = {
  args: { variant: 'default', children: 'Secondary' },
  parameters: { docs: { description: { story: 'A secondary valid action — not the main path.' } } },
};

export const Dismiss: Story = {
  args: { variant: 'dismiss', children: 'Dismiss' },
  parameters: { docs: { description: { story: 'Cancel or close. Never the main action. Placed after or away from primary.' } } },
};

export const Compact: Story = {
  args: { variant: 'default', size: 'compact', children: '− Remove' },
  parameters: { docs: { description: { story: 'Reduced padding for table rows and inline contexts. Same three roles apply.' } } },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Submit', disabled: true },
  parameters: { docs: { description: { story: 'Unavailable action — opacity reduced, cursor not-allowed.' } } },
};

export const AsSubmit: Story = {
  args: { variant: 'primary', type: 'submit', children: 'Submit form' },
  parameters: { docs: { description: { story: 'Use `type="submit"` as a child of a form element to trigger native form submission.' } } },
};
