import type { PreviewStep } from '../../runtime/types';

export type PreviewCursorKind =
  | 'row-map'
  | 'row-unmap'
  | 'row-checkbox'
  | 'bulk-toolbar'
  | 'bulk-confirm'
  | 'row';

export interface PreviewCursorTarget {
  kind: PreviewCursorKind;
  rowId?: string;
}

/** Map a preview step to a DOM target key for the animated cursor. */
export function resolveCursorTarget(step: PreviewStep | undefined): PreviewCursorTarget | null {
  if (!step) return null;

  switch (step.action) {
    case 'highlight-row':
    case 'map-row-loading':
      return step.targetId ? { kind: 'row-map', rowId: step.targetId } : null;
    case 'map-row-success':
      return step.targetId ? { kind: 'row', rowId: step.targetId } : null;
    case 'unmap-row-highlight':
    case 'unmap-row-loading':
      return step.targetId ? { kind: 'row-unmap', rowId: step.targetId } : null;
    case 'unmap-row-success':
      return step.targetId ? { kind: 'row', rowId: step.targetId } : null;
    case 'select-rows':
      return step.targetIds?.[0] ? { kind: 'row-checkbox', rowId: step.targetIds[0] } : null;
    case 'bulk-map-highlight':
    case 'bulk-map-loading':
      return { kind: 'bulk-toolbar' };
    case 'bulk-map-confirm':
      return { kind: 'bulk-confirm' };
    case 'bulk-map-success':
      return { kind: 'bulk-toolbar' };
    default:
      return null;
  }
}

/** Build a data attribute value for a cursor target. */
export function previewTargetAttr(target: PreviewCursorTarget): string {
  if (target.rowId) return `${target.kind}:${target.rowId}`;
  return target.kind;
}

/** Selector for a cursor target within the mapping example root. */
export function previewTargetSelector(target: PreviewCursorTarget): string {
  return `[data-preview-target="${previewTargetAttr(target)}"]`;
}
