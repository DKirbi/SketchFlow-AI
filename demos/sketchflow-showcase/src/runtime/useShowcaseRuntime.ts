import { useCallback, useEffect, useRef, useState } from 'react';
import type { ShowcaseExampleConfig } from '../examples/registry';
import {
  createInitialRuntimeState,
  effectiveDelayMs,
  modeAfterInteractionComplete,
  modeAfterPreviewComplete,
  modeAfterStartInteractive,
  stateForReplay,
} from './previewStateMachine';
import {
  createIframeMessage,
  isAllowedOrigin,
  parseHostMessage,
  SHOWCASE_PROTOCOL_VERSION,
} from './protocol';
import type { ShowcaseMode, ShowcaseRuntimeState } from './types';

interface UseShowcaseRuntimeOptions {
  config: ShowcaseExampleConfig;
  allowedOrigins?: string[];
  onInteractionComplete?: () => void;
}

interface UseShowcaseRuntimeResult {
  state: ShowcaseRuntimeState;
  startInteractive: () => void;
  replay: () => void;
  completeInteraction: () => void;
}

/** Orchestrate preview automation, interactive takeover, replay, and host messaging. */
export function useShowcaseRuntime({
  config,
  allowedOrigins = [],
  onInteractionComplete,
}: UseShowcaseRuntimeOptions): UseShowcaseRuntimeResult {
  const [state, setState] = useState<ShowcaseRuntimeState>(() => createInitialRuntimeState());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initRef = useRef(false);
  const stateRef = useRef(state);
  stateRef.current = state;

  const postToHost = useCallback((message: ReturnType<typeof createIframeMessage>) => {
    if (window.parent === window) return;
    window.parent.postMessage(message, '*');
  }, []);

  const notifyModeChange = useCallback(
    (mode: ShowcaseMode) => {
      postToHost(
        createIframeMessage({
          type: 'showcase:mode-change',
          version: SHOWCASE_PROTOCOL_VERSION,
          mode,
        }),
      );
    },
    [postToHost],
  );

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const runPreviewFromStep = useCallback(
    (stepIndex: number) => {
      clearTimer();
      const step = config.previewSteps[stepIndex];
      if (!step) {
        const readyMode = modeAfterPreviewComplete();
        setState((prev) => ({
          ...prev,
          mode: readyMode,
          previewStepIndex: config.previewSteps.length - 1,
        }));
        notifyModeChange(readyMode);
        postToHost(
          createIframeMessage({
            type: 'showcase:preview-complete',
            version: SHOWCASE_PROTOCOL_VERSION,
          }),
        );
        return;
      }

      const delay = effectiveDelayMs(step.delayMs, stateRef.current.reducedMotion);
      timerRef.current = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          mode: 'preview',
          previewStepIndex: stepIndex,
        }));
        runPreviewFromStep(stepIndex + 1);
      }, delay);
    },
    [clearTimer, config.previewSteps, notifyModeChange, postToHost],
  );

  const replay = useCallback(() => {
    clearTimer();
    initRef.current = true;
    const next = stateForReplay(stateRef.current.reducedMotion);
    setState(next);
    notifyModeChange(next.mode);
    runPreviewFromStep(0);
  }, [clearTimer, notifyModeChange, runPreviewFromStep]);

  const startInteractive = useCallback(() => {
    clearTimer();
    const mode = modeAfterStartInteractive();
    setState((prev) => ({
      ...prev,
      mode,
      previewStepIndex: -1,
    }));
    notifyModeChange(mode);
  }, [clearTimer, notifyModeChange]);

  const completeInteraction = useCallback(() => {
    const mode = modeAfterInteractionComplete();
    setState((prev) => ({ ...prev, mode }));
    notifyModeChange(mode);
    postToHost(
      createIframeMessage({
        type: 'showcase:interaction-complete',
        version: SHOWCASE_PROTOCOL_VERSION,
      }),
    );
    onInteractionComplete?.();
  }, [notifyModeChange, onInteractionComplete, postToHost]);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    postToHost(
      createIframeMessage({
        type: 'showcase:ready',
        version: SHOWCASE_PROTOCOL_VERSION,
        slug: config.slug,
      }),
    );
    runPreviewFromStep(0);
    return clearTimer;
  }, [clearTimer, config.slug, postToHost, runPreviewFromStep]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!isAllowedOrigin(event.origin, allowedOrigins)) return;
      const message = parseHostMessage(event.data);
      if (!message) return;
      if (message.type === 'showcase:start-interactive') startInteractive();
      if (message.type === 'showcase:replay') replay();
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [allowedOrigins, replay, startInteractive]);

  return {
    state,
    startInteractive,
    replay,
    completeInteraction,
  };
}
