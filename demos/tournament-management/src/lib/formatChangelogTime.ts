import type { Role } from '../types';

/** Prototype audit trail handle (plan R14/R15). */
export const CHANGELOG_USER_HANDLE = 'j.smith';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Format `DD MMM YYYY, HH:mm` */
export function formatChangelogTimestamp(d = new Date()): string {
  const day = d.getDate();
  const mon = MONTHS[d.getMonth()];
  const y = d.getFullYear();
  return `${pad(day)} ${mon} ${y}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function prototypeUserHandle(role: Role): string {
  return role === 'operator' ? 'm.bertoncelj' : 'j.smith';
}

/** Changelog rows always show the canonical prototype author handle. */
export function changelogAuthorHandle(role: Role): string {
  void role;
  return CHANGELOG_USER_HANDLE;
}
