import type { Meta, StoryObj } from '@storybook/react';
import { LOFIRadio } from 'lofi-kit';
import { RadioControlledRender } from './storyControls';

const choiceOptions = [
  { value: 'a', label: 'Path A' },
  { value: 'b', label: 'Path B' },
];

const meta: Meta<typeof LOFIRadio> = {
  title: 'UI / Radio',
  component: LOFIRadio,
  tags: ['autodocs'],
  render: RadioControlledRender,
  parameters: {
    docs: {
      description: {
        component: 'A mutually exclusive choice set. Selecting an option updates **Controls** (`value`).',
      },
    },
  },
  args: { value: 'a', name: 'demo-choice', options: choiceOptions },
};
export default meta;
type Story = StoryObj<typeof LOFIRadio>;

export const Row: Story = {
  args: { layout: 'row' },
  parameters: { docs: { description: { story: 'Horizontal layout — use when there are 2–3 short options.' } } },
};

export const Column: Story = {
  args: { layout: 'column' },
  parameters: { docs: { description: { story: 'Vertical layout — use for longer option labels or more than 3 choices.' } } },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: { docs: { description: { story: 'All options locked — group is visible but not interactive.' } } },
};
