import { useState } from 'react';
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { Text } from '../../ui/Text/Text';
import './Edge.scss';

export interface EdgeData {
  label?:    string;
  onEdit?:   (label: string) => void;
  onDelete?: () => void;
}

type EdgeMode = 'idle' | 'actions' | 'confirm';

export function Edge({
  id,
  sourceX, sourceY,
  targetX, targetY,
  data,
}: EdgeProps) {
  const [mode, setMode] = useState<EdgeMode>('idle');
  const { label = '—', onEdit, onDelete } = (data ?? {}) as EdgeData;

  const [edgePath, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  const strokeStyle = {
    stroke: mode !== 'idle' ? '#111' : '#555',
    strokeWidth: mode !== 'idle' ? 2 : 1.5,
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={strokeStyle} />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {mode === 'idle' && (
            <button className="flow-edge__label" type="button" onClick={() => setMode('actions')}>
              <span className="flow-edge__condition">
                <Text as="span" variant="inherit">{label}</Text>
              </span>
            </button>
          )}

          {mode === 'actions' && (
            <div className="flow-edge__actions">
              <span className="flow-edge__actions-summary">
                <Text as="span" variant="inherit">{label}</Text>
              </span>
              {onEdit && (
                <button type="button" onClick={() => { setMode('idle'); onEdit(label); }}>
                  <Text as="span" variant="inherit">✎ Edit</Text>
                </button>
              )}
              {onDelete && (
                <button type="button" className="button--danger" onClick={() => setMode('confirm')}>
                  <Text as="span" variant="inherit">− Delete</Text>
                </button>
              )}
              <button type="button" className="button--dismiss" onClick={() => setMode('idle')}>
                <Text as="span" variant="inherit">✕</Text>
              </button>
            </div>
          )}

          {mode === 'confirm' && (
            <div className="flow-edge__confirm">
              <span>
                <Text as="span" variant="inherit">Delete this connection?</Text>
              </span>
              <button type="button" onClick={() => { onDelete?.(); setMode('idle'); }}>
                <Text as="span" variant="inherit">Yes, delete</Text>
              </button>
              <button type="button" className="button--cancel" onClick={() => setMode('actions')}>
                <Text as="span" variant="inherit">Cancel</Text>
              </button>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
