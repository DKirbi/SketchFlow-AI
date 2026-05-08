import { Handle, Position } from '@xyflow/react';
import { LOFIButton, LOFIText } from 'lofi-kit';
import { MatchCard } from './MatchCard';
import type { Bracket } from '../types';

interface BracketNodeData {
  /** The bracket whose matches and metadata are displayed in this canvas node. */
  bracket: Bracket;
  /**
   * Called when the user clicks the EDIT button in the bracket header.
   * Opens `BracketEditModal` for the bracket via a portal.
   */
  onEdit?: () => void;
  /**
   * Runs on pointer-down (capture phase) so the progression focus set updates
   * before React Flow clears node selection on pane/edge clicks.
   */
  onBracketActivate?: () => void;
}

/**
 * React Flow custom node that renders a bracket card: drag belt, header with
 * EDIT button, and a scrollable list of `MatchCard` rows.
 */
interface Props {
  /** Node data injected by React Flow — see `BracketNodeData`. */
  data: BracketNodeData;
}

export function BracketNode({ data }: Props) {
  const { bracket, onEdit, onBracketActivate } = data;
  const bracketComplete =
    bracket.matches.length > 0 && bracket.matches.every((m) => m.status === 'FINISHED');

  return (
    <div
      className={`bracket-node ${bracketComplete ? 'bracket-node--complete' : 'bracket-node--incomplete'}`}
      onPointerDownCapture={(e) => {
        if ((e.target as Element).closest('button, input, select, a[href]')) return;
        onBracketActivate?.();
      }}
    >
      <Handle type="target" position={Position.Left} className="bracket-handle" />

      <div className="bracket-drag-belt" title="Drag to move bracket">
        <span className="bracket-drag-belt__icon">⠿</span>
        <span className="bracket-drag-belt__label">DRAG</span>
      </div>

      <div className="bracket-header">
        <div className="bracket-title-row">
          <LOFIText as="h3" variant="body" className="bracket-title">{bracket.title}</LOFIText>
          {bracketComplete && <span className="bracket-status-badge">COMPLETED</span>}
        </div>
        {onEdit && (
          <LOFIButton
            variant="default"
            className="bracket-edit-btn"
            onClick={onEdit}
            onPointerDown={(e) => e.stopPropagation()}
            title="Edit bracket"
          >
            EDIT
          </LOFIButton>
        )}
      </div>

      <div className="bracket-matches">
        {bracket.matches.length === 0 ? (
          <LOFIText as="p" variant="muted" className="bracket-empty">No matches yet</LOFIText>
        ) : (
          bracket.matches.map((match, idx) => (
            <div key={match.id}>
              {idx > 0 && <div className="match-divider-b" />}
              <MatchCard bracketId={bracket.id} match={match} />
            </div>
          ))
        )}
      </div>

      <Handle type="source" position={Position.Right} className="bracket-handle" />
    </div>
  );
}
