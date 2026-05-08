import type { Meta, StoryObj } from '@storybook/react';
import { LOFIBadge, LOFIButton, LOFICard } from 'lofi-kit';

const meta: Meta<typeof LOFICard> = {
  title: 'UI / Card',
  component: LOFICard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'A bordered content block for grouping related information that does not fit a table row — any self-contained unit of content.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof LOFICard>;

export const Default: Story = {
  args: { title: 'Card title · variant A' },
  render: (args) => (
    <LOFICard {...args} footer={<LOFIButton variant="default" size="compact">Action</LOFIButton>}>
      <p style={{ fontSize: 12, color: '#333' }}>Primary line of body copy.</p>
      <p style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Secondary meta line · neutral</p>
    </LOFICard>
  ),
  parameters: { docs: { description: { story: 'Summary block with optional title and footer action.' } } },
};

export const WithBadge: Story = {
  args: { title: 'Card title · variant B' },
  render: (args) => (
    <LOFICard {...args} footer={<LOFIBadge label="LIVE" variant="status" active />}>
      <p style={{ fontSize: 12 }}>Body area for short descriptive text.</p>
    </LOFICard>
  ),
  parameters: { docs: { description: { story: 'Footer can hold badge, button, or meta.' } } },
};

export const Empty: Story = {
  args: { empty: true, title: 'Empty state title' },
  render: (args) => (
    <LOFICard {...args}>
      Content will appear here when data is available.
    </LOFICard>
  ),
  parameters: { docs: { description: { story: 'Placeholder styling when there is nothing to show yet.' } } },
};
