import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Text } from '../../ui/Text/Text';
import type { TerminalNodeData } from './types';
import './FlowNode.scss';

export function EndNode({ data }: NodeProps) {
  const { label = 'End' } = data as unknown as TerminalNodeData;

  return (
    <div className="flow-terminal flow-terminal--end">
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="flow-terminal__dot" />
      <span className="flow-terminal__label">
        <Text as="span" variant="inherit">{label}</Text>
      </span>
    </div>
  );
}
