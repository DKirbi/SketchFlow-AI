import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Text } from '../../ui/Text/Text';
import type { TerminalNodeData } from './types';
import './FlowNode.scss';

export function StartNode({ data }: NodeProps) {
  const { label = 'Start' } = data as unknown as TerminalNodeData;

  return (
    <div className="flow-terminal flow-terminal--start">
      <div className="flow-terminal__dot" />
      <span className="flow-terminal__label">
        <Text as="span" variant="inherit">{label}</Text>
      </span>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}
