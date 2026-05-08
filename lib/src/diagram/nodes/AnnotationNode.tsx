import type { NodeProps } from '@xyflow/react';
import { Text } from '../../ui/Text/Text';
import type { AnnotationNodeData } from './types';
import './FlowNode.scss';

export function AnnotationNode({ data }: NodeProps) {
  const { text } = data as unknown as AnnotationNodeData;

  return (
    <div className="flow-node flow-node--annotation">
      <div className="flow-node__label">
        <Text as="span" variant="inherit">{text}</Text>
      </div>
    </div>
  );
}
