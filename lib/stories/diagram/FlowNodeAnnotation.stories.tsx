import type { Meta, StoryObj } from '@storybook/react';
import { AnnotationNode, AnnotationNodeDoc } from 'lofi-kit';
import { flowNodePreviewDecorator } from './flowNodeCanvasDecorator';

const meta: Meta<typeof AnnotationNodeDoc> = {
  title: 'Diagram / Flow nodes / Annotation',
  component: AnnotationNodeDoc,
  tags: ['autodocs'],
  decorators: [flowNodePreviewDecorator('annotation', AnnotationNode)],
  render: () => <></>,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Non-executable note. **AnnotationNodeData** has `text` only. Preview mounts **AnnotationNode** inside **React Flow**.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Short: Story = {
  name: 'Short note',
  args: { data: { text: 'FYI: branch B is optional in this prototype.' } },
};

export const Long: Story = {
  name: 'Long note (wraps)',
  args: {
    data: {
      text:
        'Open design question placeholder: document the decision here before shipping — this copy is intentionally generic for the kit.',
    },
  },
};
