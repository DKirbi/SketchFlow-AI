import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LOFIChip } from 'lofi-kit';

const meta: Meta<typeof LOFIChip> = {
  title: 'LOW FI Design system/Primitives/Chip',
  component: LOFIChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'P9 chip. Pass `onClear` (or deprecated `onDismiss`) to show ✕ — an active-filter token. Omit `onClear` and pass `selected` + `onClick` for an exclusive filter chip (no ✕). Do not fake chips with `LOFIButton`.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIChip>;

export const Dismissible: Story = {
  args: { label: 'Sport: Soccer', onClear: () => {} },
  parameters: {
    docs: {
      description: { story: 'Active-filter token. Wire `onClear` to remove the filter from query state.' },
    },
  },
};

export const WithTitle: Story = {
  args: { label: 'Date from: 2024-01-01', title: 'Remove date-from filter', onClear: () => {} },
  parameters: { docs: { description: { story: '`title` is the hover tooltip on the chip surface.' } } },
};

function FilterGroupDemo() {
  const [scope, setScope] = useState('unmapped');
  const chips = [
    { id: 'all', label: 'All (20)' },
    { id: 'unmapped', label: 'Unmapped (14)' },
    { id: 'mapped', label: 'Mapped (6)' },
  ];
  return (
    <>
      {chips.map((chip) => (
        <LOFIChip
          key={chip.id}
          label={chip.label}
          selected={scope === chip.id}
          onClick={() => setScope(chip.id)}
        />
      ))}
    </>
  );
}

export const FilterSelected: Story = {
  render: () => <FilterGroupDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Filter-chip mode: no `onClear`, `selected` on the active option, `onClick` to change scope. Counts belong in the label.',
      },
    },
  },
};
