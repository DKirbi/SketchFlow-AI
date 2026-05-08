import type { NodeProps } from '@xyflow/react';
import { ActorNode } from './ActorNode';
import { AnnotationNode } from './AnnotationNode';
import { DecisionNode } from './DecisionNode';
import { EndNode } from './EndNode';
import { MessageNode } from './MessageNode';
import { StartNode } from './StartNode';
import { StepNode } from './StepNode';
import type { AnnotationNodeData, FlowNodeData, TerminalNodeData } from './types';

/** Minimal React Flow shell for Storybook / doc previews. */
const RF_DOC_SHELL = {
  id: 'doc-preview',
  selected: false,
  dragging: false,
  draggable: true,
  selectable: true,
  deletable: true,
  isConnectable: true,
  zIndex: 0,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
} as const;

function asNodeProps(partial: Record<string, unknown>): NodeProps {
  return { ...RF_DOC_SHELL, ...partial } as unknown as NodeProps;
}

export interface StepNodeDocProps {
  /** Step/decision-style payload: label, optional meta, optional onEdit/onDelete. See FlowNodeData. */
  data: FlowNodeData;
}

export function StepNodeDoc({ data }: StepNodeDocProps) {
  return <StepNode {...asNodeProps({ type: 'step', data })} />;
}

export interface DecisionNodeDocProps {
  /** Diamond node payload (same fields as FlowNodeData). */
  data: FlowNodeData;
}

export function DecisionNodeDoc({ data }: DecisionNodeDocProps) {
  return <DecisionNode {...asNodeProps({ type: 'decision', data })} />;
}

export interface MessageNodeDocProps {
  /** Message/event node payload (same fields as FlowNodeData). */
  data: FlowNodeData;
}

export function MessageNodeDoc({ data }: MessageNodeDocProps) {
  return <MessageNode {...asNodeProps({ type: 'message', data })} />;
}

export interface ActorNodeDocProps {
  /** Actor/swimlane-style node payload (same fields as FlowNodeData). */
  data: FlowNodeData;
}

export function ActorNodeDoc({ data }: ActorNodeDocProps) {
  return <ActorNode {...asNodeProps({ type: 'actor', data })} />;
}

export interface StartNodeDocProps {
  /** Optional label override; omit for default “Start”. */
  data: TerminalNodeData;
}

export function StartNodeDoc({ data }: StartNodeDocProps) {
  return <StartNode {...asNodeProps({ type: 'start', data })} />;
}

export interface EndNodeDocProps {
  /** Optional label override; omit for default “End”. */
  data: TerminalNodeData;
}

export function EndNodeDoc({ data }: EndNodeDocProps) {
  return <EndNode {...asNodeProps({ type: 'end', data })} />;
}

export interface AnnotationNodeDocProps {
  /** Annotation-only payload: `text` line(s). */
  data: AnnotationNodeData;
}

export function AnnotationNodeDoc({ data }: AnnotationNodeDocProps) {
  return <AnnotationNode {...asNodeProps({ type: 'annotation', data })} />;
}
