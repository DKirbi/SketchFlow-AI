import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type NodeChange,
  type OnNodeDrag,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useTournamentStore } from '../store/useTournamentStore';
import { BracketNode } from './BracketNode';
import { CanvasToolbar } from './CanvasToolbar';
import { ProgressionEdge } from './ProgressionEdge';
import { ProgressionModal } from './ProgressionModal';
import { BracketEditModal } from './BracketEditModal';
import { RoundGuides } from './RoundGuides';
import { RoundHeaderBelt } from './RoundHeaderBelt';
import { deriveRoundColumns } from '../lib/roundGuideColumns';
import type { Bracket, Progression } from '../types';

const NODE_TYPES = { bracket: BracketNode };
const EDGE_TYPES = { progression: ProgressionEdge };

function progressionTouchesSelection(
  progression: Progression,
  focusBracketIds: ReadonlySet<string>
): boolean {
  if (focusBracketIds.size === 0) return false;
  const r0 = progression.rules[0];
  if (!r0) return false;
  return focusBracketIds.has(r0.fromBracketId) || focusBracketIds.has(r0.toBracketId);
}

function bracketsLinkedByProgression(
  progressions: Progression[],
  bracketIdA: string,
  bracketIdB: string
): boolean {
  return progressions.some((p) =>
    p.rules.some(
      (r) =>
        (r.fromBracketId === bracketIdA && r.toBracketId === bracketIdB) ||
        (r.fromBracketId === bracketIdB && r.toBracketId === bracketIdA)
    )
  );
}

/** Clicks on unrelated brackets replace focus; linked brackets extend the visible progression set. */
function nextProgressionFocus(
  prev: ReadonlySet<string>,
  clickedBracketId: string,
  progressions: Progression[]
): Set<string> {
  if (prev.size === 0) return new Set([clickedBracketId]);
  if (prev.has(clickedBracketId)) return new Set(prev);
  const linked = [...prev].some((id) =>
    bracketsLinkedByProgression(progressions, id, clickedBracketId)
  );
  if (linked) return new Set([...prev, clickedBracketId]);
  return new Set([clickedBracketId]);
}

function bracketToNode(
  bracket: Bracket,
  onEdit: (id: string) => void,
  selected: boolean,
  onBracketActivate: () => void
): Node {
  return {
    id: bracket.id,
    type: 'bracket',
    position: bracket.position,
    dragHandle: '.bracket-drag-belt',
    data: {
      bracket,
      onEdit: () => onEdit(bracket.id),
      onBracketActivate,
    },
    selected,
  };
}

interface CanvasProps {
  /**
   * When provided, renders "1. Structure setup" in the toolbar as a clickable
   * link. Clicking it returns the app to step 1 without clearing store data.
   * Omit to show the step label as a muted, non-interactive breadcrumb.
   */
  onBackToStructure?: () => void;
}

export function TournamentCanvas({ onBackToStructure }: CanvasProps) {
  const tournament = useTournamentStore((s) => s.tournament);
  const tournamentStructure = useTournamentStore((s) => s.tournamentStructure);
  const scenario = useTournamentStore((s) => s.scenario);
  const setScenario = useTournamentStore((s) => s.setScenario);
  const updateBracketPosition = useTournamentStore((s) => s.updateBracketPosition);
  const [showModal, setShowModal] = useState(false);
  const [editingBracketId, setEditingBracketId] = useState<string | null>(null);
  const [progressionFocusBracketIds, setProgressionFocusBracketIds] = useState(
    () => new Set<string>()
  );

  const handleEditBracket = useCallback((id: string) => {
    setEditingBracketId(id);
  }, []);

  const editingBracket = useMemo(
    () => tournament.brackets.find((b) => b.id === editingBracketId) ?? null,
    [tournament.brackets, editingBracketId]
  );

  const bracketTitles = useMemo(
    () => Object.fromEntries(tournament.brackets.map((b) => [b.id, b.title])),
    [tournament.brackets]
  );

  const activateBracketFocus = useCallback(
    (bracketId: string) => {
      setProgressionFocusBracketIds((current) =>
        nextProgressionFocus(current, bracketId, tournament.progressions)
      );
    },
    [tournament.progressions]
  );

  const initialNodes = useMemo(
    () =>
      tournament.brackets.map((b) =>
        bracketToNode(b, handleEditBracket, false, () => activateBracketFocus(b.id))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    setNodes(
      tournament.brackets.map((b) =>
        bracketToNode(
          b,
          handleEditBracket,
          progressionFocusBracketIds.has(b.id),
          () => activateBracketFocus(b.id)
        )
      )
    );
  }, [
    tournament.brackets,
    setNodes,
    handleEditBracket,
    progressionFocusBracketIds,
    activateBracketFocus,
  ]);

  const hasBracketFocus = progressionFocusBracketIds.size > 0;

  const roundColumns = useMemo(
    () => deriveRoundColumns(tournament.brackets, tournamentStructure),
    [tournament.brackets, tournamentStructure],
  );

  useEffect(() => {
    setEdges(
      tournament.progressions.map((p): Edge => ({
        id: p.id,
        source: p.rules[0]?.fromBracketId ?? '',
        target: p.rules[0]?.toBracketId ?? '',
        type: 'progression',
        data: {
          progression: p,
          bracketTitles,
          activeInFocus: progressionTouchesSelection(p, progressionFocusBracketIds),
          hasBracketFocus,
        },
      }))
    );
  }, [
    tournament.progressions,
    bracketTitles,
    progressionFocusBracketIds,
    hasBracketFocus,
    setEdges,
  ]);

  const onNodeDragStop: OnNodeDrag = useCallback(
    (_event, node) => {
      updateBracketPosition(node.id, node.position.x, node.position.y);
    },
    [updateBracketPosition]
  );

  const onNodeDragStart: OnNodeDrag = useCallback(
    (_event, node) => {
      // Deselect all other nodes so only the grabbed bracket moves,
      // regardless of which brackets are in the progression focus set.
      setNodes((nds) =>
        nds.map((n) => (n.id === node.id ? n : { ...n, selected: false }))
      );
    },
    [setNodes]
  );

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const filtered = changes.filter((ch) => {
        if (ch.type !== 'select') return true;
        if (!ch.selected && progressionFocusBracketIds.has(ch.id)) return false;
        return true;
      });
      onNodesChange(filtered);
    },
    [onNodesChange, progressionFocusBracketIds]
  );

  return (
    <div className="canvas-wrapper">
      <CanvasToolbar
        tournament={tournament}
        scenario={scenario}
        onScenarioChange={setScenario}
        onAddProgression={() => setShowModal(true)}
        onBackToStructure={onBackToStructure}
      />

      <div className="canvas-area">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          nodeTypes={NODE_TYPES}
          edgeTypes={EDGE_TYPES}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          minZoom={0.05}
          maxZoom={2}
        >
          {/* Sticky round-name header — must be inside ReactFlow to use useViewport() */}
          <RoundHeaderBelt columns={roundColumns} />
          {/* World-layer dashed column dividers — must be inside ReactFlow to use useViewport() */}
          <RoundGuides columns={roundColumns} />

          <Background gap={20} size={1} color="#eee" />
          <Controls showInteractive={false} />
          <MiniMap
            nodeStrokeWidth={2}
            nodeColor="#666"
            maskColor="rgba(255,255,255,0.7)"
          />
        </ReactFlow>
      </div>

      {showModal && createPortal(
        <ProgressionModal onClose={() => setShowModal(false)} />,
        document.body
      )}

      {editingBracket && createPortal(
        <BracketEditModal
          bracket={editingBracket}
          onClose={() => setEditingBracketId(null)}
        />,
        document.body
      )}
    </div>
  );
}
