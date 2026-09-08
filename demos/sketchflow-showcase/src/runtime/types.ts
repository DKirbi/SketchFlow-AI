/** UX pattern identifiers attached to portfolio metadata. */
export type PatternId = string;

/** Pattern metadata for accordion disclosure in the showcase chrome. */
export interface PatternSummary {
  id: PatternId;
  title: string;
  body: string;
}

/** Portfolio metadata surfaced to the host page and iframe chrome. */
export interface ShowcaseExampleMetadata {
  slug: string;
  /** Resume experience key, e.g. `sportradar`. */
  experienceKey: string;
  title: string;
  summary: string;
  patterns: PatternId[];
  patternSummaries: PatternSummary[];
  controls: string[];
  /** Relative iframe entry path (query param slug). */
  iframePath: string;
}

/** Full example registration. */
export type ShowcaseExampleConfig = ShowcaseExampleMetadata;
