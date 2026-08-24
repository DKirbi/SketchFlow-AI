import type { PreviewStep } from '../../runtime/types';

export type PreviewCursorKind =
  | 'db-row'
  | 'crawled-row'
  | 'merge-button'
  | 'field-checkbox'
  | 'master-checkbox'
  | 'modal-merge-button'
  | 'confirm-button';

export interface PreviewCursorTarget {
  kind: PreviewCursorKind;
  targetId?: string;
}

/** Map a preview step to a DOM target key for the animated cursor. */
export function resolveCursorTarget(step: PreviewStep | undefined): PreviewCursorTarget | null {
  if (!step) return null;

  switch (step.action) {
    case 'expand-row':
    case 'collapse-row':
    case 'select-db-row':
    case 'show-suggestions':
      return step.targetId ? { kind: 'db-row', targetId: step.targetId } : null;
    case 'select-crawled-row':
      return step.targetId ? { kind: 'crawled-row', targetId: step.targetId } : null;
    case 'highlight-merge-button':
      return { kind: 'merge-button' };
    case 'toggle-field-override':
      return step.targetId ? { kind: 'field-checkbox', targetId: step.targetId } : null;
    case 'toggle-master-override':
      return { kind: 'master-checkbox' };
    case 'highlight-modal-merge':
      return { kind: 'modal-merge-button' };
    case 'open-merge-confirm':
    case 'confirm-merge-loading':
      return { kind: 'confirm-button' };
    default:
      return null;
  }
}

/** Build a data attribute value for a cursor target. */
export function previewTargetAttr(target: PreviewCursorTarget): string {
  if (target.targetId) return `${target.kind}:${target.targetId}`;
  return target.kind;
}

/** Selector for a cursor target within the merge-tool example root. */
export function previewTargetSelector(target: PreviewCursorTarget): string {
  return `[data-preview-target="${previewTargetAttr(target)}"]`;
}
