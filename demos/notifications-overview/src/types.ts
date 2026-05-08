/** High-level issue buckets in the sidebar (message-type grouping). */
export type MessageCategory = 'match-state' | 'missing-data' | 'markets-state' | 'incorrect-data';

export type Dataset = 'BETTING' | 'MEDIA_VALIDATED';

export type Sport = 'Soccer' | 'Tennis' | 'Volleyball';

export type LsLevel = 'LS1' | 'LS2' | 'LS3';

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
  /** Set when the row is moved to the resolved list (session mock). */
  resolvedAt?: string;
}

/** Resolved tab rows always carry `resolvedAt`. */
export type ResolvedNotificationRow = NotificationRow & { resolvedAt: string };

export type GroupByMode = 'message-type' | 'match';

export type DatasetScope = 'betting' | 'media' | 'all';

export type MainTab = 'pending' | 'resolved';

export interface NotificationFilters {
  daysBack: string;
  sport: string;
  lsLevel: string;
  issueType: string;
  datasetScope: DatasetScope;
}
