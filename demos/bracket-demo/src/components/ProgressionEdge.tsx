import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { getBezierPath, EdgeLabelRenderer, BaseEdge, useReactFlow } from '@xyflow/react';
import { EdgeContextMenu } from './EdgeContextMenu';
import { useTournamentStore } from '../store/useTournamentStore';
import type { Progression } from '../types';

const HOVER_LEAVE_MS = 80;
const Z_DIM_HOVER = 10;
const Z_ACTIVE = 5;

export interface ProgressionEdgeData {
  /** The progression rule set this edge represents. */
  progression: Progression;
  /** Map of bracketId → title used by the edit modal. */
  bracketTitles: Record<string, string>;
  /**
   * `true` when at least one of the source/target brackets is in the
   * current progression focus set. Active edges render at full opacity.
   */
  activeInFocus?: boolean;
  /**
   * `true` when any bracket on the canvas is currently focused.
   * Used to dim non-active edges (20 % opacity) when a focus set is active.
   */
  hasBracketFocus?: boolean;
}

/**
 * React Flow custom edge for a `Progression`. Renders a bezier path that
 * shows a rule-summary label on hover and opens `EdgeContextMenu` in a portal
 * when the user clicks the label.
 */
interface Props {
  /** React Flow edge id — matches `progression.id`. */
  id: string;
  /** Canvas x coordinate of the source handle. */
  sourceX: number;
  /** Canvas y coordinate of the source handle. */
  sourceY: number;
  /** Canvas x coordinate of the target handle. */
  targetX: number;
  /** Canvas y coordinate of the target handle. */
  targetY: number;
  /** Edge data injected by `TournamentCanvas` — see `ProgressionEdgeData`. */
  data?: ProgressionEdgeData;
}

type EdgeMode = 'idle' | 'edit';

export function ProgressionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}: Props) {
  const [mode, setMode] = useState<EdgeMode>('idle');
  const [hovered, setHovered] = useState(false);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { updateEdge } = useReactFlow();
  const deleteProgression = useTournamentStore((s) => s.deleteProgression);

  const hasBracketFocus = data?.hasBracketFocus ?? false;
  const activeInFocus = data?.activeInFocus ?? false;
  const isActive = hasBracketFocus && activeInFocus;

  const clearLeaveTimer = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  const onPointerEnterHover = useCallback(() => {
    clearLeaveTimer();
    setHovered(true);
  }, [clearLeaveTimer]);

  const onPointerLeaveHover = useCallback(() => {
    clearLeaveTimer();
    leaveTimerRef.current = setTimeout(() => {
      setHovered(false);
      leaveTimerRef.current = null;
    }, HOVER_LEAVE_MS);
  }, [clearLeaveTimer]);

  useEffect(() => () => clearLeaveTimer(), [clearLeaveTimer]);

  useEffect(() => {
    let z = 0;
    if (!isActive && hovered) z = Z_DIM_HOVER;
    else if (isActive) z = Z_ACTIVE;
    updateEdge(id, { zIndex: z });
  }, [hovered, isActive, id, updateEdge]);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const progression = data?.progression;
  const firstRule = progression?.rules[0];

  const conditionLabel = firstRule ? firstRule.condition : '—';
  const triggerLabel = firstRule ? 'AFTER MATCH END' : '—';
  const rulesCount = progression?.rules.length ?? 0;

  const summary =
    rulesCount > 1
      ? `${conditionLabel} (+${rulesCount - 1} rules)`
      : conditionLabel;

  /** Solid line by default; dashed + rule label only while hovering (cleaner canvas). */
  const showProgressionHint = mode === 'idle' && hovered;

  return (
    <>
      <g
        className="progression-edge-path-group"
        onPointerEnter={onPointerEnterHover}
        onPointerLeave={onPointerLeaveHover}
      >
        <BaseEdge
          id={id}
          path={edgePath}
          interactionWidth={22}
          style={{
            strokeDasharray:
              mode !== 'idle' ? undefined : showProgressionHint ? '6 3' : undefined,
            stroke: mode !== 'idle' ? '#000' : '#555',
            strokeWidth: mode !== 'idle' ? 2 : 1.5,
            opacity: 1,
          }}
        />
      </g>

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: showProgressionHint ? 'all' : 'none',
            visibility: showProgressionHint ? 'visible' : 'hidden',
            zIndex: showProgressionHint ? 1000 : 0,
          }}
          className="nodrag nopan progression-edge-label-host"
          onPointerEnter={onPointerEnterHover}
          onPointerLeave={onPointerLeaveHover}
        >
          {/* ── Hover: rule summary (opaque layer above the edge path) ── */}
          {mode === 'idle' && (
            <button
              type="button"
              className="progression-edge-label"
              onClick={() => setMode('edit')}
              title="Click to manage this progression"
            >
              <span className="edge-condition">{summary}</span>
              <span className="edge-trigger">{triggerLabel}</span>
            </button>
          )}

          {/* ── Edit modal ── (rendered as a body portal to match BracketEditModal UX) */}
        </div>
      </EdgeLabelRenderer>

      {mode === 'edit' && progression && createPortal(
        <div
          className="modal-overlay"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setMode('idle'); }}
        >
          <div className="modal progression-edit-modal">
            <EdgeContextMenu
              progression={progression}
              bracketTitles={data?.bracketTitles ?? {}}
              onClose={() => setMode('idle')}
              onDelete={() => {
                deleteProgression(progression.id);
                setMode('idle');
              }}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
