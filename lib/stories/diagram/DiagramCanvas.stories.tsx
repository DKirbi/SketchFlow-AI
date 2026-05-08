import type { Meta, StoryObj } from '@storybook/react';
import { Title, Subtitle, Description, Primary, Stories } from '@storybook/addon-docs/blocks';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { edgeTypes, nodeTypes } from 'lofi-kit';

const nodes = [
  { id: 'start',    type: 'start',    position: { x: 40,  y: 160 }, data: { label: 'Start' } },
  { id: 'step1',    type: 'step',     position: { x: 180, y: 120 }, data: { label: 'Collect input', meta: 'Actor · A' } },
  { id: 'decision', type: 'decision', position: { x: 380, y: 120 }, data: { label: 'Condition met?' } },
  { id: 'message',  type: 'message',  position: { x: 580, y: 40  }, data: { label: 'Notify downstream', meta: 'Async · B' } },
  { id: 'step2',    type: 'step',     position: { x: 580, y: 200 }, data: { label: 'Alternate path' } },
  { id: 'end',      type: 'end',      position: { x: 780, y: 160 }, data: { label: 'End' } },
  { id: 'note',     type: 'annotation', position: { x: 380, y: 280 }, data: { text: 'Annotation: layout-only note for reviewers.' } },
];

const edges = [
  { id: 'e1', source: 'start',    target: 'step1' },
  { id: 'e2', source: 'step1',    target: 'decision' },
  { id: 'e3', source: 'decision', target: 'message', type: 'labeled', data: { label: 'YES' } },
  { id: 'e4', source: 'decision', target: 'step2',   type: 'labeled', data: { label: 'NO' }, style: { strokeDasharray: '6 3' } },
  { id: 'e5', source: 'message',  target: 'end' },
  { id: 'e6', source: 'step2',    target: 'end' },
];

const meta: Meta = {
  title: 'Diagram / Canvas',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Primary />
          <Description />
          <Stories />
        </>
      ),
      description: {
        component:
          'Full **React Flow** canvas: pass `nodes` and `edges`, and register `nodeTypes` / `edgeTypes` from **lofi-kit**. Each node `data` object follows **FlowNodeData**, **TerminalNodeData**, or **AnnotationNodeData** (`lib/src/diagram/nodes/types.ts`). This story is a **neutral sample graph** for layout, not a product flow.',
      },
    },
  },
};
export default meta;
type Story = StoryObj;

export const SampleFlow: Story = {
  name: 'Sample flow',
  render: () => (
    <div style={{ width: '100%', height: 400, background: '#f8f8f8', border: '1px solid #ddd' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
      >
        <Background color="#ddd" gap={20} />
      </ReactFlow>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates Step, Decision, Message, terminals, annotation, labeled edge, and dashed branch. Copy is abstract on purpose.',
      },
    },
  },
};
