import type { ShowcaseMode, ShowcaseRuntimeState } from './types';

const REDUCED_MOTION_MAX_DELAY_MS = 80;

/** Detect prefers-reduced-motion (SSR-safe). */
export function detectReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Scale preview delays when reduced motion is requested. */
export function effectiveDelayMs(delayMs: number, reducedMotion: boolean): number {
  if (!reducedMotion) return delayMs;
  return Math.min(delayMs, REDUCED_MOTION_MAX_DELAY_MS);
}

export function createInitialRuntimeState(
  reducedMotion = detectReducedMotion(),
): ShowcaseRuntimeState {
  return {
    mode: 'preview',
    previewStepIndex: -1,
    reducedMotion,
  };
}

/** Transition runtime mode after preview choreography completes. */
export function modeAfterPreviewComplete(): ShowcaseMode {
  return 'ready';
}

/** Transition when the visitor takes interactive control. */
export function modeAfterStartInteractive(): ShowcaseMode {
  return 'interactive';
}

/** Transition when a mapping action completes in interactive mode. */
export function modeAfterInteractionComplete(): ShowcaseMode {
  return 'complete';
}

/** Reset state for replay. */
export function stateForReplay(reducedMotion: boolean): ShowcaseRuntimeState {
  return createInitialRuntimeState(reducedMotion);
}
