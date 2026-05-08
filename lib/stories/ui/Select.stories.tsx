import type { Meta, StoryObj } from '@storybook/react';
import { LOFISelect } from 'lofi-kit';
import { SelectControlledRender } from './storyControls';

const sampleOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
  { value: 'locked', label: 'Locked', disabled: true },
];

const meta: Meta<typeof LOFISelect> = {
  title: 'UI / Select',
  component: LOFISelect,
  tags: ['autodocs'],
  render: SelectControlledRender,
  parameters: {
    docs: {
      description: {
        component: 'Dropdown for choosing one value from a known, fixed list. Choosing an option updates the value and Storybook **Controls** (`value`).',
      },
    },
  },
  args: { value: '', options: sampleOptions },
};
export default meta;
type Story = StoryObj<typeof LOFISelect>;

export const Default: Story = {
  args: { value: 'draft' },
  parameters: { docs: { description: { story: 'Fixed option list for enums or categories.' } } },
};

export const WithPlaceholder: Story = {
  args: { value: '', placeholder: 'Choose an option…' },
  parameters: { docs: { description: { story: 'Unselected state — placeholder option is disabled and shown as the hint.' } } },
};

export const Compact: Story = {
  args: { value: 'active', size: 'compact' },
  parameters: { docs: { description: { story: 'Dense variant for tables or inline toolbars.' } } },
};

export const Disabled: Story = {
  args: { value: 'draft', disabled: true },
  parameters: { docs: { description: { story: 'Field is locked — visible but not interactive.' } } },
};

export const Large: Story = {
  args: { value: 'draft', size: 'large' },
  parameters: { docs: { description: { story: 'Prominent variant for hero controls or primary filter headings.' } } },
};
