import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LOFIToggle } from 'lofi-kit';

const meta: Meta<typeof LOFIToggle> = {
  title: 'LOW FI Design system/Primitives/Toggle',
  component: LOFIToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Segmented exclusive options as adjacent buttons. Use for mode / view switching and 2–4 sections inside a modal or panel. Not a binary setting (`LOFISwitch`) and not an underline tab strip (`LOFITabs`).',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIToggle>;

const MODE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'mapped', label: 'Mapped' },
  { value: 'pending', label: 'Pending' },
];

function ControlledToggle({
  initial = 'all',
  ariaLabel = 'Filter by mapping status',
}: {
  initial?: string;
  ariaLabel?: string;
}) {
  const [value, setValue] = useState(initial);
  return <LOFIToggle value={value} onChange={setValue} options={MODE_OPTIONS} ariaLabel={ariaLabel} />;
}

export const Default: Story = {
  render: () => <ControlledToggle />,
  parameters: { docs: { description: { story: 'Three exclusive segments. Parent owns `value`.' } } },
};

export const TwoOptions: Story = {
  render: () => {
    const [value, setValue] = useState('message-type');
    return (
      <LOFIToggle
        value={value}
        onChange={setValue}
        ariaLabel="Group notifications by"
        options={[
          { value: 'message-type', label: 'Message type' },
          { value: 'match', label: 'Match' },
        ]}
      />
    );
  },
  parameters: { docs: { description: { story: 'Two options — default over tabs for in-panel section switches.' } } },
};
