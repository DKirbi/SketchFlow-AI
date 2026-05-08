import type { Meta, StoryObj } from '@storybook/react';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { LOFIInlineAlert } from 'lofi-kit';

const meta: Meta<typeof LOFIInlineAlert> = {
  title: 'UI / InlineAlert',
  component: LOFIInlineAlert,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Persistent, contextual message embedded in a form, panel, or table section. A 2px left border acts as the severity indicator in lieu of color. Use for form validation errors, unsaved-change warnings, and locked-section notices.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIInlineAlert>;

export const ErrorAlert: Story = {
  name: 'Error',
  args: {
    severity: 'error',
    title: 'Validation error',
    message: 'Player count exceeds the maximum allowed for this round.',
  },
  parameters: { docs: { description: { story: 'Solid 2px left rule — critical, blocking.' } } },
};

export const WarningAlert: Story = {
  name: 'Warning',
  args: {
    severity: 'warning',
    title: 'Unsaved changes',
    message: 'This record has been edited but not yet saved.',
  },
  parameters: { docs: { description: { story: 'Dashed borders — advisory, non-blocking.' } } },
};

export const InfoAlert: Story = {
  name: 'Info',
  args: {
    severity: 'info',
    title: 'Read-only mode',
    message: 'This section is locked while the draw is in progress.',
  },
  parameters: { docs: { description: { story: 'Solid 1px left rule (muted) — informational.' } } },
};

export const SuccessAlert: Story = {
  name: 'Success',
  args: {
    severity: 'success',
    title: 'Changes applied',
    message: 'The bracket has been updated with your latest changes.',
  },
  parameters: { docs: { description: { story: 'Solid 1px left rule — positive confirmation.' } } },
};

function DismissibleDemo(props: ComponentProps<typeof LOFIInlineAlert>) {
  const [visible, setVisible] = useState(true);
  return visible ? (
    <LOFIInlineAlert {...props} onDismiss={() => setVisible(false)} />
  ) : (
    <span style={{ fontFamily: 'monospace', fontSize: 13 }}>(dismissed)</span>
  );
}

export const Dismissible: Story = {
  args: {
    severity: 'warning',
    title: 'Unsaved changes',
    message: 'You have unsaved edits on this tab.',
  },
  render: (args) => <DismissibleDemo {...args} />,
  parameters: {
    docs: { description: { story: 'Pass onDismiss to add a dismiss button.' } },
  },
};

export const TitleOnly: Story = {
  args: { severity: 'info', title: 'Draw locked until seeding is complete.' },
  parameters: {
    docs: { description: { story: 'message is optional — title alone is valid.' } },
  },
};
