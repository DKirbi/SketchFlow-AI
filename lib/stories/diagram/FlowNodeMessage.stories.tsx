import type { Meta, StoryObj } from '@storybook/react';
import { MessageNode, MessageNodeDoc } from 'lofi-kit';
import { flowNodePreviewDecorator } from './flowNodeCanvasDecorator';

const meta: Meta<typeof MessageNodeDoc> = {
  title: 'Diagram / Flow nodes / Message',
  component: MessageNodeDoc,
  tags: ['autodocs'],
  decorators: [flowNodePreviewDecorator('message', MessageNode)],
  render: () => <></>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Message / side-effect node. Data shape: **FlowNodeData**. Preview mounts **MessageNode** inside **React Flow**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelOnly: Story = {
  name: 'Label only',
  args: { data: { label: 'Event: entity.updated' } },
};

export const LabelAndMeta: Story = {
  name: 'Label + meta',
  args: { data: { label: 'Send notification', meta: 'After: state change' } },
};

export const LongCopy: Story = {
  name: 'Long label + meta',
  args: {
    data: {
      label: 'Publish signal `Entity.Committed` to bus and audit trail',
      meta: 'Schema stub · partition key · delivery semantics TBD',
    },
  },
};
