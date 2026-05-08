/** High-level issue buckets in the sidebar (message-type grouping). */
export type MessageCategory = 'match-state' | 'missing-data' | 'markets-state' | 'incorrect-data';

export type Dataset = 'BETTING' | 'MEDIA_VALIDATED';

export type Sport = 'Soccer' | 'Tennis' | 'Basketball';

export type LsLevel = 'LS1' | 'LS2' | 'LS3';

export type Role = 'operator' | 'supervisor';

export type OperatorId = 'r.operator' | 'm.kovac' | 'a.scout' | 'j.lopez' | 't.huang';

/** Demo-only region shard — also used by the global Office header filter. */
export type CityOfficeId = 'london' | 'berlin' | 'singapore';

export interface NotificationRow {
  id: string;
  /** 1–10; display as Low/High unless dataset is BETTING (then label is Betting). */
  priority: number;
  dataset: Dataset;
  /** Same as issue type label for table "Message Name". */
  messageName: string;
  issueTypeSlug: string;
  issueTypeLabel: string;
  category: MessageCategory;
  matchId: string;
  matchLabel: string;
  tournament: string;
  sport: Sport;
  lsLevel: LsLevel;
  /** ISO 8601 local-ish string for mock sorting / display */
  generatedAt: string;
  /** The operator assigned to triage this issue. */
  assignedOperatorId: OperatorId;
  /** Set when the row is moved to the resolved list (session mock). */
  resolvedAt?: string;
  /** The operator who resolved this issue. */
  resolvedByOperatorId?: OperatorId;
  /** Optional demo shard for charts-only office filtering. */
  cityOfficeId?: CityOfficeId;
  /** Pending issue not yet opened in triage UI — drives “untouched” scatter only. */
  issueUntouched?: boolean;
}

/** Resolved tab rows always carry `resolvedAt`. */
export type ResolvedNotificationRow = NotificationRow & { resolvedAt: string };

export type GroupByMode = 'message-type' | 'match';

/** Priority band filter: high = 6–10, low = 1–5, all = both. */
export type PriorityBand = 'high' | 'low' | 'all';

export type MainTab = 'pending' | 'resolved';

export interface NotificationFilters {
  daysBack: string;
  sport: string;
  lsLevel: string;
  issueType: string;
  /** `FILTER_OPTION_ALL` = all offices. */
  cityOffice: string;
  priorityBand: PriorityBand;
}
