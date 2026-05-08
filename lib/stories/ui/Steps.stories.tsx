import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LOFISteps } from 'lofi-kit';

const meta: Meta<typeof LOFISteps> = {
  title: 'UI / Steps',
  component: LOFISteps,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A step navigation strip showing the user\'s position in a multi-step process. Communicates what is current, reachable, and not yet available.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFISteps>;

function StepsInteractiveDemo() {
  const [active, setActive] = useState(1);
  const labels = ['1 · First', '2 · Second', '3 · Third'];
  return (
    <LOFISteps
      items={labels.map((label, idx) => ({
        label,
        state: idx === active ? 'active' : idx < active ? 'default' : 'muted',
        onClick: idx <= active ? () => setActive(idx) : undefined,
      }))}
    />
  );
}

export const Default: Story = {
  render: () => <StepsInteractiveDemo />,
  parameters: { docs: { description: { story: 'Click a completed or current step to jump (story-only state). Future steps stay muted.' } } },
};

export const FirstStep: Story = {
  args: {
    items: [
      { label: '1 · First',  state: 'active' },
      { label: '2 · Second', state: 'muted' },
      { label: '3 · Third',  state: 'muted' },
    ],
  },
  parameters: { docs: { description: { story: 'First step active — subsequent steps muted.' } } },
};

export const LastStep: Story = {
  args: {
    items: [
      { label: '1 · First',  state: 'default', onClick: () => {} },
      { label: '2 · Second', state: 'default', onClick: () => {} },
      { label: '3 · Third',  state: 'active' },
    ],
  },
  parameters: { docs: { description: { story: 'Final step active — earlier steps navigable.' } } },
};
