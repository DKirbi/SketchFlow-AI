/** Timeline lanes (distinct from sidebar high/low toggle). */
export type SeverityLane = 'critical' | 'major' | 'minor';

export type Severity = SeverityLane;

export const SEVERITY_ORDER: SeverityLane[] = ['critical', 'major', 'minor'];

export const LANES = SEVERITY_ORDER;

/** Swimlanes per plan: Critical 8–10, Major 5–7, Minor 1–4. */
export function priorityToSeverity(priority: number): SeverityLane {
  if (priority >= 8) return 'critical';
  if (priority >= 5) return 'major';
  return 'minor';
}

export const SLA_CRITICAL_T1_MS = 60_000;
export const SLA_CRITICAL_T2_MS = 180_000;
export const SLA_MAJOR_T1_MS = 600_000;

export const LANE_BG: Record<Severity, string> = {
  critical: 'rgba(127, 29, 29, 0.6)',
  major: 'rgba(146, 64, 14, 0.6)',
  minor: 'rgba(55, 65, 81, 0.6)',
};

export const SEVERITY_DOT: Record<Severity, string> = {
  critical: '#ef4444',
  major: '#f59e0b',
  minor: '#9ca3af',
};

export type EscalationTier = 'none' | 't1' | 't2';

export function escalationTier(severity: Severity, ageSec: number): EscalationTier {
  const a = Math.max(0, ageSec);
  if (severity === 'critical') {
    if (a >= SLA_CRITICAL_T2_MS / 1000) return 't2';
    if (a >= SLA_CRITICAL_T1_MS / 1000) return 't1';
  }
  if (severity === 'major' && a >= SLA_MAJOR_T1_MS / 1000) return 't1';
  return 'none';
}

/** Deterministic jitter per issue id (−0.5…0.5). */
export function laneJitter(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
  h = Math.abs(h);
  return (h % 1000) / 1000 - 0.5;
}

/** 0…1 within-lane discrimination by priority tier. */
export function priorityBandOffset(priority: number, lane: SeverityLane): number {
  if (lane === 'critical') return (priority - 8) / 2;
  if (lane === 'major') return (priority - 5) / 2;
  return (priority - 1) / 3;
}

export function operatorRingColor(operatorId: string): string {
  const palette = ['#38bdf8', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'];
  let h = 0;
  for (let i = 0; i < operatorId.length; i++) h = (h << 5) - h + operatorId.charCodeAt(i);
  return palette[Math.abs(h) % palette.length]!;
}
