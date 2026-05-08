import type { Decorator } from '@storybook/react';
import type { Node, NodeTypes } from '@xyflow/react';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';

/**
 * Renders a single custom node inside React Flow so `<Handle />` receives node id context.
 * Use with meta `render: () => null`; ArgTypes stay on the *Doc component; args drive `data`.
 */
export function flowNodePreviewDecorator(rfType: string, NodeComponent: NodeTypes[string]): Decorator {
  return (_Story, context) => {
    const data = (context.args as { data?: Record<string, unknown> })?.data ?? {};
    const nodes: Node[] = [
      {
        id: 'storybook-preview',
        type: rfType,
        position: { x: 72, y: 88 },
        data,
      },
    ];
    return (
      <ReactFlowProvider>
        <div style={{ width: 340, height: 260 }}>
          <ReactFlow
            nodes={nodes}
            edges={[]}
            nodeTypes={{ [rfType]: NodeComponent }}
            fitView
            fitViewOptions={{ padding: 0.35 }}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            panOnDrag={false}
            zoomOnScroll={false}
          />
        </div>
      </ReactFlowProvider>
    );
  };
}
