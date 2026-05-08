import type { Meta, StoryObj } from '@storybook/react';
import { LOFICheckbox } from 'lofi-kit';
import { CheckboxControlledRender } from './storyControls';

const meta: Meta<typeof LOFICheckbox> = {
  title: 'UI / Checkbox',
  component: LOFICheckbox,
  tags: ['autodocs'],
  render: CheckboxControlledRender,
  parameters: {
    docs: {
      description: {
        component: 'A single boolean toggle with a label. Clicking updates **Controls** (`checked`).',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFICheckbox>;

export const Unchecked: Story = {
  args: { checked: false, label: 'Option · off' },
  parameters: { docs: { description: { story: 'Default unselected state.' } } },
};

export const Checked: Story = {
  args: { checked: true, label: 'Option · on' },
  parameters: { docs: { description: { story: 'Active state — the option is enabled.' } } },
};

export const Disabled: Story = {
  args: { checked: false, label: 'Unavailable option', disabled: true },
  parameters: { docs: { description: { story: 'Toggle is not interactive in this context.' } } },
};
