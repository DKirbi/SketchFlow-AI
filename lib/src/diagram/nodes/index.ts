export { StepNode }       from './StepNode';
export { DecisionNode }   from './DecisionNode';
export { MessageNode }    from './MessageNode';
export { ActorNode }      from './ActorNode';
export { StartNode }      from './StartNode';
export { EndNode }        from './EndNode';
export { AnnotationNode } from './AnnotationNode';

export type { FlowNodeData, TerminalNodeData, AnnotationNodeData } from './types';

export type {
  StepNodeDocProps,
  DecisionNodeDocProps,
  MessageNodeDocProps,
  ActorNodeDocProps,
  StartNodeDocProps,
  EndNodeDocProps,
  AnnotationNodeDocProps,
} from './nodeDocs';
export {
  StepNodeDoc,
  DecisionNodeDoc,
  MessageNodeDoc,
  ActorNodeDoc,
  StartNodeDoc,
  EndNodeDoc,
  AnnotationNodeDoc,
} from './nodeDocs';

// Pre-built nodeTypes object for ReactFlow
import { StepNode }       from './StepNode';
import { DecisionNode }   from './DecisionNode';
import { MessageNode }    from './MessageNode';
import { ActorNode }      from './ActorNode';
import { StartNode }      from './StartNode';
import { EndNode }        from './EndNode';
import { AnnotationNode } from './AnnotationNode';

export const nodeTypes = {
  step:       StepNode,
  decision:   DecisionNode,
  message:    MessageNode,
  actor:      ActorNode,
  start:      StartNode,
  end:        EndNode,
  annotation: AnnotationNode,
} as const;
