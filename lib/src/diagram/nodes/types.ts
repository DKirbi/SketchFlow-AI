export interface FlowNodeData {
  /** Primary line on step/decision/message/actor nodes; main readable title. */
  label:     string;
  /** Optional second line under the label (role, trigger, subsystem). */
  meta?:     string;
  /** If set, shows edit affordance on hover; called when user edits the node. */
  onEdit?:   () => void;
  /** If set, shows delete affordance on hover; called when user removes the node. */
  onDelete?: () => void;
}

export interface TerminalNodeData {
  /** Optional override for start/end caption; omit to use defaults “Start” / “End”. */
  label?: string;
}

export interface AnnotationNodeData {
  /** Freeform note text; only field used on annotation nodes. */
  text: string;
}
