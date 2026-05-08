import type { Meta, StoryObj } from '@storybook/react';
import { LOFIBadge } from 'lofi-kit';

const meta: Meta<typeof LOFIBadge> = {
  title: 'UI / Badge',
  component: LOFIBadge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'An inline label chip communicating a status, identity, or category. Border style (solid vs dashed) carries semantic weight — fill color is never used.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFIBadge>;

export const StatusActive: Story = {
  args: { label: 'ACTIVE', variant: 'status', active: true },
  parameters: { docs: { description: { story: 'Solid border — emphasized state.' } } },
};

export const StatusInactive: Story = {
  args: { label: 'INACTIVE', variant: 'status', active: false },
  parameters: { docs: { description: { story: 'Dashed border — de-emphasized state.' } } },
};

export const ID: Story = {
  args: { label: 'ID-7F3A9C', variant: 'id' },
  parameters: { docs: { description: { story: 'Stable identifier chip — monospace, read-only reference.' } } },
};

export const Tag: Story = {
  args: { label: 'TAG', variant: 'tag' },
  parameters: { docs: { description: { story: 'Category or tag label.' } } },
};

export const Clickable: Story = {
  args: { label: 'PENDING', variant: 'status', active: true, onClick: () => {} },
  parameters: { docs: { description: { story: 'Pass onClick for an interactive chip (e.g. filter or drill-down).' } } },
};
