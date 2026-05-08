import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { LOFIToast } from 'lofi-kit';
import { fixedLayerCanvasDecorator } from '../decorators/fixedLayerCanvas';

const meta: Meta<typeof LOFIToast> = {
  title: 'UI / Toast',
  component: LOFIToast,
  tags: ['autodocs'],
  decorators: [fixedLayerCanvasDecorator(160)],
  parameters: {
    docs: {
      description: {
        component:
          'Fixed bottom-right notification for transient, non-blocking action feedback. Border style (solid vs dashed vs heavy) and the shared Radix feedback icons (25×25) communicate severity without color.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIToast>;

function ToastDismissStory({
  dismissedLabel = '(dismissed)',
  ...args
}: ComponentProps<typeof LOFIToast> & { dismissedLabel?: string }) {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <LOFIToast {...args} onDismiss={() => setVisible(false)} />
  ) : (
    <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{dismissedLabel}</span>
  );
}

export const Success: Story = {
  args: { severity: 'success', message: 'Match saved successfully.' },
  render: (args) => <ToastDismissStory {...args} dismissedLabel="(dismissed — reload story)" />,
  parameters: { docs: { description: { story: 'Solid border, ✓ icon — action completed.' } } },
};

export const Info: Story = {
  args: { severity: 'info', message: 'Fixture list has been updated.' },
  render: (args) => <ToastDismissStory {...args} />,
  parameters: { docs: { description: { story: 'Solid border, ℹ icon — informational.' } } },
};

export const Warning: Story = {
  args: { severity: 'warning', message: 'Changes not yet saved.' },
  render: (args) => <ToastDismissStory {...args} />,
  parameters: { docs: { description: { story: 'Dashed border, ⚠ icon — non-critical warning.' } } },
};

export const Error: Story = {
  args: { severity: 'error', message: 'Save failed. Please try again.' },
  render: (args) => <ToastDismissStory {...args} />,
  parameters: { docs: { description: { story: '2px solid border, ✕ icon — critical failure.' } } },
};

export const AutoDismiss: Story = {
  args: { severity: 'success', message: 'Exported in 3 s…', autoDismiss: 3000 },
  render: (args) => (
    <ToastDismissStory {...args} dismissedLabel="(auto-dismissed after 3 s)" />
  ),
  parameters: {
    docs: {
      description: { story: 'Pass autoDismiss (ms) for automatic dismissal — no user action required.' },
    },
  },
};
