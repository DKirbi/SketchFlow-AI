import type { Meta, StoryObj } from '@storybook/react';
import { EndNode, EndNodeDoc } from 'lofi-kit';
import { flowNodePreviewDecorator } from './flowNodeCanvasDecorator';

const meta: Meta<typeof EndNodeDoc> = {
  title: 'Diagram / Flow nodes / End',
  component: EndNodeDoc,
  tags: ['autodocs'],
  decorators: [flowNodePreviewDecorator('end', EndNode)],
  render: () => <></>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Flow exit terminal. **TerminalNodeData**: optional `label`; omit for default “End”. Uses **React Flow** for handles.',
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
        story: 'Omit `label` — the node shows **End**.',
      },
    },
  },
};

export const CustomLabel: Story = {
  name: 'Custom label',
  args: { data: { label: 'Closed · archived' } },
};
