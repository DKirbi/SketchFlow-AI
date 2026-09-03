import { describe, expect, it } from 'vitest';
import { computeAutomatedSnapshot } from '../examples/mapping/automatedPreview';
import { mappingExampleConfig } from '../examples/mapping/metadata';

describe('automatedPreview', () => {
  it('maps, unmaps, and bulk-maps through the preview sequence', () => {
    const steps = mappingExampleConfig.previewSteps;
    const mapDoneIndex = steps.findIndex((step) => step.id === 'map-success');
    const unmapDoneIndex = steps.findIndex((step) => step.id === 'unmap-success');
    const bulkDoneIndex = steps.findIndex((step) => step.id === 'bulk-success');

    const afterMap = computeAutomatedSnapshot(steps, mapDoneIndex);
    expect(afterMap.items.find((item) => item.id === 'FSD-1003')?.status).toBe('mapped');

    const afterUnmap = computeAutomatedSnapshot(steps, unmapDoneIndex);
    expect(afterUnmap.items.find((item) => item.id === 'FSD-1003')?.status).toBe('pending');

    const afterBulk = computeAutomatedSnapshot(steps, bulkDoneIndex);
    expect(afterBulk.items.find((item) => item.id === 'FSD-1006')?.status).toBe('mapped');
    expect(afterBulk.items.find((item) => item.id === 'FSD-1007')?.status).toBe('mapped');
    expect(afterBulk.selected.size).toBe(0);
    expect(afterBulk.statusMessage).toMatch(/bulk-mapped/i);
  });

  it('opens bulk confirm modal during bulk-map-confirm step', () => {
    const steps = mappingExampleConfig.previewSteps;
    const confirmIndex = steps.findIndex((step) => step.id === 'bulk-confirm');
    const snapshot = computeAutomatedSnapshot(steps, confirmIndex);
    expect(snapshot.bulkConfirmOpen).toBe(true);
    expect(snapshot.selected.has('FSD-1006')).toBe(true);
  });
});
