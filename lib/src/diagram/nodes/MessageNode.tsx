import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Text } from '../../ui/Text/Text';
import type { FlowNodeData } from './types';
import './FlowNode.scss';

export function MessageNode({ data }: NodeProps) {
  const { label, meta, onEdit, onDelete } = data as unknown as FlowNodeData;

  return (
    <div className="flow-node flow-node--message">
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="flow-node__label">
        <Text as="span" variant="inherit">{label}</Text>
      </div>
      {meta && (
        <div className="flow-node__meta">
          <Text as="span" variant="inherit">{meta}</Text>
        </div>
      )}
      {(onEdit || onDelete) && (
        <div className="flow-node__actions">
          {onEdit   && <button type="button" onClick={onEdit}><Text as="span" variant="inherit">✎</Text></button>}
          {onDelete && <button type="button" onClick={onDelete}><Text as="span" variant="inherit">−</Text></button>}
        </div>
      )}
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}
