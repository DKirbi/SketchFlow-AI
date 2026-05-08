import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LOFISwitch } from 'lofi-kit';

const meta: Meta<typeof LOFISwitch> = {
  title: 'UI / Switch',
  component: LOFISwitch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Binary on/off toggle for named settings. Distinct from LOFICheckbox (selection set membership) and LOFIToggle (mode or view switching). The track fills with ink when on; empties when off. Label is always visible.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFISwitch>;

const Controlled = (args: Omit<React.ComponentProps<typeof LOFISwitch>, 'checked' | 'onChange'> & { checked?: boolean }) => {
  const [checked, setChecked] = useState(args.checked ?? false);
  return <LOFISwitch {...args} checked={checked} onChange={setChecked} />;
};

export const Off: Story = {
  render: () => <Controlled label="Active" checked={false} />,
  parameters: { docs: { description: { story: 'Off state — outlined track, indicator on the left.' } } },
};

export const On: Story = {
  render: () => <Controlled label="Active" checked={true} />,
  parameters: { docs: { description: { story: 'On state — filled track, indicator on the right.' } } },
};

export const Compact: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Controlled label="Show advanced options" size="compact" checked={false} />
      <Controlled label="Enable notifications" size="compact" checked={true} />
    </div>
  ),
  parameters: { docs: { description: { story: 'Compact size — use in dense forms and table rows.' } } },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <LOFISwitch checked={false} onChange={() => {}} label="Inactive (off, disabled)" disabled />
      <LOFISwitch checked={true} onChange={() => {}} label="Locked (on, disabled)" disabled />
    </div>
  ),
  parameters: { docs: { description: { story: 'Disabled state — 40% opacity, not interactive.' } } },
};

function InContextDemo() {
  const [live, setLive] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontFamily: 'monospace' }}>
      <LOFISwitch checked={live} onChange={setLive} label="Live scoring" />
      <LOFISwitch checked={notifications} onChange={setNotifications} label="Match notifications" />
      <LOFISwitch checked={autoSave} onChange={setAutoSave} label="Auto-save draft" />
    </div>
  );
}

export const InContext: Story = {
  render: () => <InContextDemo />,
  parameters: { docs: { description: { story: 'Multiple switches in a settings form.' } } },
};
