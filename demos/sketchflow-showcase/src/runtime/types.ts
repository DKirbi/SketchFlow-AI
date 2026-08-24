/** Showcase runtime mode — drives preview automation vs visitor control. */
export type ShowcaseMode = 'preview' | 'ready' | 'interactive' | 'complete';

/** UX pattern identifiers attached to portfolio metadata. */
export type PatternId = string;

/** Pattern metadata for accordion disclosure in the showcase chrome. */
export interface PatternSummary {
  id: PatternId;
  title: string;
  body: string;
}

/** Declarative preview step executed by the showcase runtime. */
export type PreviewStepAction =
  | 'highlight-row'
  | 'map-row-loading'
  | 'map-row-success'
  | 'unmap-row-highlight'
  | 'unmap-row-loading'
  | 'unmap-row-success'
  | 'select-rows'
  | 'bulk-map-highlight'
  | 'bulk-map-confirm'
  | 'bulk-map-loading'
  | 'bulk-map-success'
  // merge-tool example
  | 'expand-row'
  | 'collapse-row'
  | 'select-db-row'
  | 'show-suggestions'
  | 'select-crawled-row'
  | 'highlight-merge-button'
  | 'open-merge-modal'
  | 'toggle-field-override'
  | 'toggle-master-override'
  | 'highlight-modal-merge'
  | 'open-merge-confirm'
  | 'confirm-merge-loading'
  | 'confirm-merge-success';

export interface PreviewStep {
  id: string;
  /** Delay before this step runs (ms). Ignored/minimised when reduced motion is on. */
  delayMs: number;
  action: PreviewStepAction;
  targetId?: string;
  targetIds?: string[];
  /** In-prototype status line after row/bulk operations. */
  message?: string;
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

/** Full example registration — metadata + preview choreography. */
export interface ShowcaseExampleConfig extends ShowcaseExampleMetadata {
  previewSteps: PreviewStep[];
}

export interface ShowcaseRuntimeState {
  mode: ShowcaseMode;
  previewStepIndex: number;
  reducedMotion: boolean;
}
