import type { Meta, StoryObj } from '@storybook/react';
import { StepNode, StepNodeDoc } from 'lofi-kit';
import { flowNodePreviewDecorator } from './flowNodeCanvasDecorator';

const meta: Meta<typeof StepNodeDoc> = {
  title: 'Diagram / Flow nodes / Step',
  component: StepNodeDoc,
  tags: ['autodocs'],
  decorators: [flowNodePreviewDecorator('step', StepNode)],
  render: () => <></>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Step node: main line from `data.label`, optional `data.meta`. Preview mounts **StepNode** inside **React Flow** so handles work. Payload: **FlowNodeData**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelOnly: Story = {
  name: 'Label only',
  args: { data: { label: 'Process step A' } },
};

export const LabelAndMeta: Story = {
  name: 'Label + meta',
  args: { data: { label: 'Validate payload', meta: 'Service · idempotent' } },
};

export const LongLabel: Story = {
  name: 'Long label (wraps)',
  args: {
    data: {
      label:
        'Long primary line example: when labels wrap, the node grows vertically while staying readable in the canvas.',
    },
  },
};

export const LongMeta: Story = {
  name: 'Long meta (wraps)',
  args: {
    data: {
      label: 'Emit signal',
      meta: 'Meta line: channel · owner · version — all arbitrary prototyping copy.',
    },
  },
};

export const WithActions: Story = {
  name: 'With edit/delete hooks',
  args: {
    data: {
      label: 'Configurable step',
      meta: 'Hover for actions',
      onEdit: () => {},
      onDelete: () => {},
    },
  },
  parameters: {
    docs: {
      description: {
        story: '`onEdit` / `onDelete` are optional; when set, action buttons appear on hover.',
      },
    },
  },
};
