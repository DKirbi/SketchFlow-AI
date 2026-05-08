import { useEffect, useState, useSyncExternalStore } from 'react';

function getReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function subscribeReduced(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/**
 * Advances mock “live” clock for the dock. Static when prefers-reduced-motion.
 */
export function useTimelineNow(
  anchorMs: number,
  opts?: { stepMs?: number; intervalMs?: number },
): { nowMs: number; isLive: boolean } {
  const stepMs = opts?.stepMs ?? 60_000;
  const intervalMs = opts?.intervalMs ?? 2_000;
  const reduced = useSyncExternalStore(subscribeReduced, getReducedMotion, () => false);
  const [nowMs, setNowMs] = useState(anchorMs);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- align animated clock when timeline anchor changes
    setNowMs(anchorMs);
  }, [anchorMs]);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setNowMs((n) => n + stepMs), intervalMs);
    return () => window.clearInterval(id);
  }, [reduced, stepMs, intervalMs]);

  return { nowMs: reduced ? anchorMs : nowMs, isLive: !reduced };
}
