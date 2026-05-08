import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LOFIButton, LOFIField, LOFIPanel, LOFISelect } from 'lofi-kit';

const meta: Meta<typeof LOFIPanel> = {
  title: 'UI / Panel',
  component: LOFIPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'An anchored contextual panel that opens near a specific element — a row, node, or edge. Positioned by the consumer; the panel itself is just a styled container.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIPanel>;

function PanelPlaygroundDemo() {
  const [fieldA, setFieldA] = useState('alpha');
  const [fieldB, setFieldB] = useState('later');
  return (
    <LOFIPanel
      open
      onClose={() => {}}
      title="Surface title"
      footer={(
        <>
          <LOFIButton variant="primary">Confirm</LOFIButton>
          <LOFIButton variant="dismiss">Close</LOFIButton>
        </>
      )}
    >
      <LOFIField label="Field one">
        <LOFISelect
          value={fieldA}
          onChange={setFieldA}
          options={[
            { value: 'alpha', label: 'Value Alpha' },
            { value: 'beta', label: 'Value Beta' },
          ]}
        />
      </LOFIField>
      <LOFIField label="Field two">
        <LOFISelect
          value={fieldB}
          onChange={setFieldB}
          options={[
            { value: 'now', label: 'Immediately' },
            { value: 'later', label: 'Deferred' },
          ]}
        />
      </LOFIField>
    </LOFIPanel>
  );
}

export const Playground: Story = {
  render: () => <PanelPlaygroundDemo />,
  parameters: { docs: { description: { story: 'Compact surface with two interactive selects (story-only state).' } } },
};
