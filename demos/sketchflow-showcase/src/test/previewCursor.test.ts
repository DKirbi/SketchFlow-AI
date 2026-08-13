import { describe, expect, it } from 'vitest';
import {
  previewTargetAttr,
  previewTargetSelector,
  resolveCursorTarget,
} from '../examples/mapping/previewCursor';
import { mappingExampleConfig } from '../examples/mapping/metadata';

describe('previewCursor', () => {
  it('resolves map highlight to row-map target', () => {
    const step = mappingExampleConfig.previewSteps.find((s) => s.id === 'map-highlight');
    expect(resolveCursorTarget(step)).toEqual({ kind: 'row-map', rowId: 'COMP-LA-LIGA' });
  });

  it('resolves bulk confirm to bulk-confirm target', () => {
    const step = mappingExampleConfig.previewSteps.find((s) => s.id === 'bulk-confirm');
    expect(resolveCursorTarget(step)).toEqual({ kind: 'bulk-confirm' });
  });

  it('builds stable selectors from target attrs', () => {
    const target = { kind: 'row-checkbox' as const, rowId: 'COMP-SERIE-A' };
    expect(previewTargetAttr(target)).toBe('row-checkbox:COMP-SERIE-A');
    expect(previewTargetSelector(target)).toBe('[data-preview-target="row-checkbox:COMP-SERIE-A"]');
  });
});
