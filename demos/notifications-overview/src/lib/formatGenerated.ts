/** Display format: `13 Apr 2026, 08:48` per UX_PATTERNS / lo-fi rules. */
export function formatGenerated(isoLocal: string): string {
  const d = new Date(isoLocal);
  if (Number.isNaN(d.getTime())) return isoLocal;

  const pad = (n: number) => String(n).padStart(2, '0');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const day = d.getDate();
  const mon = months[d.getMonth()];
  const year = d.getFullYear();
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());
  return `${day} ${mon} ${year}, ${hh}:${mm}`;
}
