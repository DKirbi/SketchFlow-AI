import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LOFIField, LOFIInput, LOFISelect } from 'lofi-kit';

const meta: Meta<typeof LOFIField> = {
  title: 'UI / Field',
  component: LOFIField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A labeled wrapper that stacks a text label above any form control. The fundamental unit of every form in the system.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIField>;

function FieldDefaultDemo() {
  const [value, setValue] = useState('Sample value · 01');
  return (
    <LOFIField label="Primary label" htmlFor="field-primary">
      <LOFIInput id="field-primary" value={value} onChange={setValue} />
    </LOFIField>
  );
}

export const Default: Story = {
  render: () => <FieldDefaultDemo />,
  parameters: { docs: { description: { story: 'Label stacked above control — the default for any form field.' } } },
};

function FieldHintDemo() {
  const [value, setValue] = useState('ABC-00');
  return (
    <LOFIField label="Short field" htmlFor="field-code" hint="Prototype constraint — format and length are up to the product.">
      <LOFIInput id="field-code" value={value} onChange={setValue} />
    </LOFIField>
  );
}

export const WithHint: Story = {
  render: () => <FieldHintDemo />,
  parameters: { docs: { description: { story: 'Helper text below the control explains a constraint or format.' } } },
};

function FieldRequiredDemo() {
  const [value, setValue] = useState('');
  return (
    <LOFIField label="Required input" htmlFor="field-req" required>
      <LOFIInput id="field-req" value={value} placeholder="Type something to continue…" onChange={setValue} />
    </LOFIField>
  );
}

export const Required: Story = {
  render: () => <FieldRequiredDemo />,
  parameters: { docs: { description: { story: 'Required fields display an asterisk after the label.' } } },
};

function FieldInlineDemo() {
  const [mode, setMode] = useState('on');
  return (
    <LOFIField label="Mode" inline>
      <LOFISelect
        value={mode}
        onChange={setMode}
        options={[
          { value: 'on', label: 'On' },
          { value: 'off', label: 'Off' },
        ]}
      />
    </LOFIField>
  );
}

export const Inline: Story = {
  render: () => <FieldInlineDemo />,
  parameters: { docs: { description: { story: 'Label beside the control — for short paired fields in a row.' } } },
};
