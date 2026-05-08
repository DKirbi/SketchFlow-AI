/** High = priorities 6–10 (matches former lo-fi “HIGH” band). */
export function isHighPriorityBand(priority: number): boolean {
  return priority > 5;
}

/** Semantic colour for a numeric priority 1–10 (UI_PATTERNS table/status). */
export function priorityPdsColor(priority: number): 'warning' | 'attention' | 'neutral' {
  if (priority >= 9) return 'warning';
  if (priority >= 7) return 'attention';
  return 'neutral';
}
