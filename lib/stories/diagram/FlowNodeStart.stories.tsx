import type { Meta, StoryObj } from '@storybook/react';
import { StartNode, StartNodeDoc } from 'lofi-kit';
import { flowNodePreviewDecorator } from './flowNodeCanvasDecorator';

const meta: Meta<typeof StartNodeDoc> = {
  title: 'Diagram / Flow nodes / Start',
  component: StartNodeDoc,
  tags: ['autodocs'],
  decorators: [flowNodePreviewDecorator('start', StartNode)],
  render: () => <></>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Flow entry terminal. **TerminalNodeData**: optional `label`; omit or empty for default “Start”. Uses **React Flow** for handles.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultLabel: Story = {
  name: 'Default label',
  args: { data: {} },
  parameters: {
    docs: {
      description: {
        story: 'Omit `label` or pass empty `data` — the node shows **Start**.',
      },
    },
  },
};

export const CustomLabel: Story = {
  name: 'Custom label',
  args: { data: { label: 'Entry point' } },
};
