import type { Meta, StoryObj } from '@storybook/react';
import { DecisionNode, DecisionNodeDoc } from 'lofi-kit';
import { flowNodePreviewDecorator } from './flowNodeCanvasDecorator';

const meta: Meta<typeof DecisionNodeDoc> = {
  title: 'Diagram / Flow nodes / Decision',
  component: DecisionNodeDoc,
  tags: ['autodocs'],
  decorators: [flowNodePreviewDecorator('decision', DecisionNode)],
  render: () => <></>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Decision (diamond) node. Copy lives on **FlowNodeData**. Preview mounts **DecisionNode** inside **React Flow**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelOnly: Story = {
  name: 'Label only',
  args: { data: { label: 'Threshold reached?' } },
};

export const LabelAndMeta: Story = {
  name: 'Label + meta',
  args: { data: { label: 'Approve continuation?', meta: 'Ruleset · v2' } },
};

export const LongLabel: Story = {
  name: 'Long question (wraps)',
  args: {
    data: {
      label: 'Long question example: does the upstream check return OK within the agreed window and without manual override?',
    },
  },
};
