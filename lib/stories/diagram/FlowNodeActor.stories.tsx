import type { Meta, StoryObj } from '@storybook/react';
import { ActorNode, ActorNodeDoc } from 'lofi-kit';
import { flowNodePreviewDecorator } from './flowNodeCanvasDecorator';

const meta: Meta<typeof ActorNodeDoc> = {
  title: 'Diagram / Flow nodes / Actor',
  component: ActorNodeDoc,
  tags: ['autodocs'],
  decorators: [flowNodePreviewDecorator('actor', ActorNode)],
  render: () => <></>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Actor / swimlane-style node. Same **FlowNodeData** fields as step. Preview mounts **ActorNode** inside **React Flow**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelOnly: Story = {
  name: 'Label only',
  args: { data: { label: 'Role · operator' } },
};

export const LabelAndMeta: Story = {
  name: 'Label + meta',
  args: { data: { label: 'Role · reviewer', meta: 'Read-only in this diagram' } },
};

export const LongLabel: Story = {
  name: 'Long label (wraps)',
  args: {
    data: {
      label: 'External system · SSO boundary + delegated admin group (label wrap demo)',
    },
  },
};
