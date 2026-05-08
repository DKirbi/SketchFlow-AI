import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LOFIField, LOFIFieldset, LOFISelect } from 'lofi-kit';

const meta: Meta<typeof LOFIFieldset> = {
  title: 'UI / Fieldset',
  component: LOFIFieldset,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A bordered section grouping related form controls under a legend label. Use to separate logical sections within a longer form.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIFieldset>;

function FieldsetInteractiveDemo() {
  const [a, setA] = useState('opt-a1');
  const [b, setB] = useState('opt-b1');
  return (
    <LOFIFieldset legend="Section A — prototype grouping">
      <LOFIField label="First control">
        <LOFISelect
          value={a}
          onChange={setA}
          options={[
            { value: 'opt-a1', label: 'Option A · 1' },
            { value: 'opt-a2', label: 'Option A · 2' },
          ]}
        />
      </LOFIField>
      <LOFIField label="Second control">
        <LOFISelect
          value={b}
          onChange={setB}
          options={[
            { value: 'opt-b1', label: 'Option B · 1' },
            { value: 'opt-b2', label: 'Option B · 2' },
          ]}
        />
      </LOFIField>
    </LOFIFieldset>
  );
}

export const Default: Story = {
  render: () => <FieldsetInteractiveDemo />,
  parameters: { docs: { description: { story: 'Groups related fields under a neutral section legend.' } } },
};
