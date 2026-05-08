import type { SimpleTournament } from '../types';

export function validateTournamentName(raw: string): string | undefined {
  const t = raw.trim();
  if (t.length < 2) return 'Name must be at least 2 characters.';
  if (t.length > 100) return 'Name must be at most 100 characters.';
  return undefined;
}

export function parseOptionalPositiveInt(raw: string): number | undefined {
  if (raw.trim() === '') return undefined;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0) return undefined;
  return n;
}

export function validateNonNegativeIntField(label: string, raw: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0) return `${label} must be a non-negative integer.`;
  return undefined;
}

export function validatePositiveIntRequired(label: string, raw: string): string | undefined {
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) return `${label} must be a positive integer.`;
  return undefined;
}

export function validatePrizePair(money: string, currency: string): string | undefined {
  const hasMoney = money.trim() !== '';
  const hasCurrency = currency.trim() !== '';
  if (hasMoney && !hasCurrency) return 'Select a currency when prize money is set.';
  if (hasCurrency && !hasMoney) return 'Enter prize money when a currency is selected.';
  if (hasMoney) {
    const n = Number(money);
    if (!Number.isInteger(n) || n <= 0) return 'Prize money must be a positive integer.';
  }
  return undefined;
}

export function validateQualificationRounds(raw: string): string | undefined {
  if (raw.trim() === '') return undefined;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0 || n > 10) {
    return 'Qualification rounds must be an integer from 0 to 10.';
  }
  return undefined;
}

export function validateMaxOversPerBowler(maxRaw: string, oversRaw: string): string | undefined {
  if (maxRaw.trim() === '' || oversRaw.trim() === '') return undefined;
  const max = Number(maxRaw);
  const overs = Number(oversRaw);
  if (!Number.isInteger(max) || !Number.isInteger(overs)) return undefined;
  if (max > overs) return 'Max overs per bowler must be less than or equal to total overs.';
  return undefined;
}

/** Special overs values like "100-balls" skip numeric max comparison */
export function oversIsNumeric(oversRaw: string): boolean {
  const n = Number(oversRaw);
  return Number.isInteger(n) && n > 0;
}

export function simpleTournamentOverlapsDateRange(
  st: SimpleTournament,
  dateFrom: string,
  dateTo: string,
): boolean {
  if (!dateFrom && !dateTo) return true;
  const start = st.startTime ? new Date(st.startTime).getTime() : NaN;
  const end = st.endTime ? new Date(st.endTime).getTime() : NaN;
  if (Number.isNaN(start) && Number.isNaN(end)) return true;
  const from = dateFrom ? new Date(`${dateFrom}T00:00`).getTime() : -Infinity;
  const to = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : Infinity;
  const s = Number.isNaN(start) ? end : start;
  const e = Number.isNaN(end) ? start : end;
  return s <= to && e >= from;
}
