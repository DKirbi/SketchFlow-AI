import type { PatternSummary } from '../runtime/types';
import { mappingExampleConfig } from '../examples/mapping/metadata';
import { mergeToolExampleConfig } from '../examples/merge-tool/metadata';

export type HubProjectKind = 'spa' | 'embed' | 'page';

export interface HubCompany {
  id: string;
  label: string;
  /** When false, company appears on home but is not navigable. */
  enabled: boolean;
}

export interface HubProject {
  slug: string;
  companyId: string;
  title: string;
  /** One-line description shown in the collapsed brief and as the lead in the expanded column. */
  summary: string;
  /** Brief-bar copy — one or more short paragraphs. */
  brief: string[];
  kind: HubProjectKind;
  /** Two-letter code shown on the collapsed sidebar rail. */
  railAbbrev: string;
  /** Patterns used by this example. Empty for SketchFlowAI Patterns (Storybook). */
  patternSummaries: PatternSummary[];
  /** iframe src for embed projects (trailing slash). */
  embedPath?: string;
}

export const DEFAULT_COMPANY_ID = 'Sportradar';
export const ABOUT_SLUG = 'about';
export const DEFAULT_PROJECT_SLUG = ABOUT_SLUG;
export const STORYBOOK_SLUG = 'low-fi-ux-ui-patterns';

export const COMPANIES: HubCompany[] = [
  { id: 'Sportradar', label: 'Sportradar', enabled: true },
  { id: 'OTHER', label: 'OTHER', enabled: false },
];

const ROLE_GATING_PATTERN: PatternSummary = {
  id: 'Role gating',
  title: 'Role gating — restricted editing',
  body: 'Change the prototype user in the toolbar to see how roles restrict editing of sensitive data. Move and Remove stay hidden while the role is Operator.',
};

const BRACKET_PATTERNS: PatternSummary[] = [
  {
    id: 'P5',
    title: 'P5 — Modal',
    body: 'Cognitive Load / Law of Common Region — setup and match editing open in a modal so the canvas stays the main view.',
  },
  {
    id: 'P7',
    title: 'P7 — Confirmation dialog',
    body: 'Tesler’s Law / Hick’s Law — confirm destructive or commit actions before they apply.',
  },
  ROLE_GATING_PATTERN,
];

const TOURNAMENT_PATTERNS: PatternSummary[] = [
  {
    id: 'P1',
    title: 'P1 — Workspace',
    body: 'Jakob’s Law / Law of Common Region — identity bar, filter row, sidebar tree, main card.',
  },
  {
    id: 'P9',
    title: 'P9 — Filters',
    body: 'Hick’s Law / Choice Overload — filters gate the tree; clearing resets selection.',
  },
  ROLE_GATING_PATTERN,
];

export const PROJECTS: HubProject[] = [
  {
    slug: ABOUT_SLUG,
    companyId: 'Sportradar',
    title: 'About',
    railAbbrev: 'AB',
    summary:
      'A collection of UX and UI patterns from real production interfaces, shown through NDA-safe AI examples and documented in SketchFlowAI Patterns.',
    brief: [
      'A collection of UX and UI patterns from real production interfaces, shown through NDA-safe AI examples and documented in SketchFlowAI Patterns.',
    ],
    patternSummaries: [],
    kind: 'page',
  },
  {
    slug: 'merge-tool',
    companyId: 'Sportradar',
    title: 'Merge Tool',
    railAbbrev: 'MG',
    summary: 'Pick a mock catalog, choose one database row and one crawled match, then Merge.',
    brief: [
      'Pick a mock catalog, choose one database row and one crawled match, then Merge.',
      'Review field overrides in the modal. Merge stays disabled until you override at least one field, then confirm.',
    ],
    patternSummaries: mergeToolExampleConfig.patternSummaries,
    kind: 'spa',
  },
  {
    slug: 'mapping',
    companyId: 'Sportradar',
    title: 'Mapping',
    railAbbrev: 'MP',
    summary:
      'Pick a mock catalog. Map messy internal names onto crawled canonical names, row by row.',
    brief: [
      'Pick a mock catalog. Map messy internal names onto crawled canonical names, row by row.',
      'Search or filter, then Map or Unmap a row. Expand a row to rank AI suggestions; map one suggestion per entity.',
    ],
    patternSummaries: mappingExampleConfig.patternSummaries,
    kind: 'spa',
  },
  {
    slug: 'bracket-demo',
    companyId: 'Sportradar',
    title: 'Tournament Bracket',
    railAbbrev: 'BR',
    summary: 'Set up a tournament bracket, then edit matches on the canvas.',
    brief: [
      'Set up a tournament bracket, then edit matches on the canvas.',
      'Open setup and match editors in modals. Confirm before destructive or commit actions. Switch the prototype user in the toolbar to see role-gated team edits.',
    ],
    patternSummaries: BRACKET_PATTERNS,
    kind: 'embed',
    embedPath: '/embeds/bracket-demo/',
  },
  {
    slug: 'tournament-management',
    companyId: 'Sportradar',
    title: 'Tournament Management',
    railAbbrev: 'TM',
    summary: 'Filter the sidebar, select a tournament leaf, and edit it in the main pane.',
    brief: [
      'Filter the sidebar, select a tournament leaf, and edit it in the main pane.',
      'Clear all filters to reset the tree. Switch the prototype user in the toolbar to unlock Move and Remove.',
    ],
    patternSummaries: TOURNAMENT_PATTERNS,
    kind: 'embed',
    embedPath: '/embeds/tournament-management/',
  },
  {
    slug: 'low-fi-ux-ui-patterns',
    companyId: 'Sportradar',
    title: 'SketchFlowAI Patterns',
    railAbbrev: 'SB',
    summary:
      'Storybook documentation of the low-fidelity design system and the patterns used in these prototype projects.',
    brief: [
      'Storybook documentation of the low-fidelity design system and the patterns used in these prototype projects.',
      'Lo-fi UX flow testing is about structure and behaviour; high-fidelity colour and branding are not the discussion yet.',
      'The same flows can later be restyled with a high-fidelity design system, so the work stays design-system agnostic.',
    ],
    patternSummaries: [],
    kind: 'embed',
    embedPath: '/embeds/low-fi-ux-ui-patterns/',
  },
];

export function getCompany(id: string): HubCompany | undefined {
  return COMPANIES.find((c) => c.id === id);
}

export function listEnabledCompanies(): HubCompany[] {
  return COMPANIES.filter((c) => c.enabled);
}

export function listProjectsForCompany(companyId: string): HubProject[] {
  return PROJECTS.filter((p) => p.companyId === companyId);
}

export function getProject(companyId: string, slug: string): HubProject | undefined {
  return PROJECTS.find((p) => p.companyId === companyId && p.slug === slug);
}

export function isStorybookProject(project: HubProject): boolean {
  return project.slug === STORYBOOK_SLUG;
}

export function companyPath(companyId: string): string {
  return `/${encodeURIComponent(companyId)}`;
}

export function projectPath(companyId: string, slug: string): string {
  return `/${encodeURIComponent(companyId)}/${encodeURIComponent(slug)}`;
}

export function defaultProjectPath(): string {
  return projectPath(DEFAULT_COMPANY_ID, DEFAULT_PROJECT_SLUG);
}

/**
 * iframe src for embed projects.
 * Storybook's Vite preview emits absolute `/@vite`, `/index.ts`, etc. URLs that cannot
 * be proxied cleanly through the hub — in local DEV open Storybook on :6007 directly.
 * Production/static builds use `/embeds/low-fi-ux-ui-patterns/`.
 */
export function resolveEmbedSrc(project: HubProject): string {
  if (import.meta.env.DEV && project.slug === STORYBOOK_SLUG) {
    return 'http://127.0.0.1:6007/';
  }
  return project.embedPath ?? `/embeds/${project.slug}/`;
}
