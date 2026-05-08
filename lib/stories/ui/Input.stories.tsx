import type { Meta, StoryObj } from '@storybook/react';
import { LOFIInput } from 'lofi-kit';
import { InputControlledRender } from './storyControls';

const meta: Meta<typeof LOFIInput> = {
  title: 'UI / Input',
  component: LOFIInput,
  tags: ['autodocs'],
  render: InputControlledRender,
  parameters: {
    docs: {
      description: {
        component: 'Single-line text entry. Covers text, number, email, search, and password modes via the `type` prop. Typing updates **Controls** (`value`).',
      },
    },
  },
  args: { value: '' },
};
export default meta;
type Story = StoryObj<typeof LOFIInput>;

export const Default: Story = {
  args: { value: 'Sample input value', placeholder: 'Placeholder…' },
  parameters: { docs: { description: { story: 'Standard text field.' } } },
};

export const Placeholder: Story = {
  args: { value: '', placeholder: 'Nothing selected — hint only.' },
  parameters: { docs: { description: { story: 'Empty field showing placeholder — indicates expected input.' } } },
};

export const Compact: Story = {
  args: { value: 'Compact', size: 'compact' },
  parameters: { docs: { description: { story: 'Table-cell variant — same field, reduced vertical padding.' } } },
};

export const Disabled: Story = {
  args: { value: 'Read-only display value', disabled: true },
  parameters: { docs: { description: { story: 'Non-editable — field is visible in layout but cannot be changed.' } } },
};

export const ReadOnly: Story = {
  args: { value: 'REF-000-001', readOnly: true },
  parameters: { docs: { description: { story: 'Read-only reference value displayed within a form layout.' } } },
};
