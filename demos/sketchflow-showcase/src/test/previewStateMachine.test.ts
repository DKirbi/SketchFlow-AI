import { describe, expect, it } from 'vitest';
import {
  createInitialRuntimeState,
  effectiveDelayMs,
  modeAfterInteractionComplete,
  modeAfterPreviewComplete,
  modeAfterStartInteractive,
  stateForReplay,
} from '../runtime/previewStateMachine';

describe('previewStateMachine', () => {
  it('creates initial preview mode state', () => {
    const state = createInitialRuntimeState(false);
    expect(state.mode).toBe('preview');
    expect(state.previewStepIndex).toBe(-1);
  });

  it('caps delays when reduced motion is enabled', () => {
    expect(effectiveDelayMs(900, true)).toBe(80);
    expect(effectiveDelayMs(900, false)).toBe(900);
  });

  it('transitions modes for preview, interactive, and complete', () => {
    expect(modeAfterPreviewComplete()).toBe('ready');
    expect(modeAfterStartInteractive()).toBe('interactive');
    expect(modeAfterInteractionComplete()).toBe('complete');
  });

  it('resets replay state back to preview', () => {
    const replay = stateForReplay(true);
    expect(replay.mode).toBe('preview');
    expect(replay.reducedMotion).toBe(true);
  });
});
