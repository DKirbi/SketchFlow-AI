import type { Meta, StoryObj } from '@storybook/react';
import { LOFIField, LOFIInput, LOFISwitch, LOFITooltip, LOFITooltipMarker } from 'lofi-kit';
import { useState } from 'react';

const meta: Meta<typeof LOFITooltip> = {
  title: 'LOW FI Design system/Primitives/Tooltip',
  component: LOFITooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Hover or focus bubble for extra information about an input. Use next to a field label or a switch — do not put the same copy as persistent hint text under the control.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFITooltip>;

function FieldTooltipDemo() {
  const [value, setValue] = useState('KO-24');
  return (
    <LOFIField label="Unique tournament" htmlFor="tooltip-ut" tooltip="Optional — cross-season grouping.">
      <LOFIInput id="tooltip-ut" value={value} onChange={setValue} />
    </LOFIField>
  );
}

export const OnFieldLabel: Story = {
  render: () => <FieldTooltipDemo />,
  parameters: {
    docs: { description: { story: 'Info marker beside the field label. Hover or focus to read the copy.' } },
  },
};

function SwitchTooltipDemo() {
  const [onlyRunning, setOnlyRunning] = useState(false);
  return (
    <>
      <LOFISwitch label="Only running" checked={onlyRunning} onChange={setOnlyRunning} />
      <LOFITooltip content='Mocked “running” flag on each simple tournament'>
        <LOFITooltipMarker label="Only running" />
      </LOFITooltip>
    </>
  );
}

export const BesideSwitch: Story = {
  render: () => <SwitchTooltipDemo />,
  parameters: {
    docs: { description: { story: 'Switches keep their adjacent label; extra information sits in a tooltip, not a second label above.' } },
  },
};
