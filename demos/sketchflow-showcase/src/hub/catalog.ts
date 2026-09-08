import type { PatternSummary } from '../runtime/types';
import { mappingExampleConfig } from '../examples/mapping/metadata';
import { mergeToolExampleConfig } from '../examples/merge-tool/metadata';
import { MAPPING_EXPAND_HINT } from 'shared-catalogs';

export type HubProjectKind = 'spa' | 'embed';

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
export const DEFAULT_PROJECT_SLUG = 'merge-tool';
export const STORYBOOK_SLUG = 'low-fi-ux-ui-patterns';

export const COMPANIES: HubCompany[] = [
  { id: 'Sportradar', label: 'Sportradar', enabled: true },
  { id: 'OTHER', label: 'OTHER', enabled: false },
];

const BRACKET_PATTERNS: PatternSummary[] = [
  {
    id: 'P5',
    title: 'P5 — Modal',
    body: 'Bracket setup and match editing open in a modal so the canvas stays the persistent main view.',
  },
  {
    id: 'P7',
    title: 'P7 — Confirmation dialog',
    body: 'Destructive or commit actions on the bracket ask for a confirmation-only overlay before they apply.',
  },
];

const TOURNAMENT_PATTERNS: PatternSummary[] = [
  {
    id: 'P1',
    title: 'P1 — Workspace',
    body: 'A UPL shell with filter row, collapsible sidebar tree, and a persistent main interface view.',
  },
  {
    id: 'P9',
    title: 'P9 — Filters',
    body: 'Search and filter controls gate the sidebar tree. Clearing filters resets dependent selection state.',
  },
];

export const PROJECTS: HubProject[] = [
  {
    slug: 'merge-tool',
    companyId: 'Sportradar',
    title: 'Merge Tool',
    railAbbrev: 'MG',
    summary:
      'Reconciles two records of the same entity, lets the operator choose field overrides, and writes the result to the database.',
    brief: [
      'Reconciles two records of the same entity, lets the operator choose field overrides, and writes the result to the database.',
      'Choose a mock database (film catalogue or wizarding world) from the toolbar. Mock catalogues protect real business sports data.',
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
      'Maps messy or legacy internal names onto newly crawled canonical names, row by row. The flow is the operator job of reconciling catalogue values.',
    brief: [
      'Maps messy or legacy internal names onto newly crawled canonical names, row by row. The flow is the operator job of reconciling catalogue values.',
      'Choose a mock database (film catalogue or wizarding world) from the toolbar. Mock catalogues protect real business sports data.',
      MAPPING_EXPAND_HINT,
    ],
    patternSummaries: mappingExampleConfig.patternSummaries,
    kind: 'spa',
  },
  {
    slug: 'bracket-demo',
    companyId: 'Sportradar',
    title: 'Tournament Bracket',
    railAbbrev: 'BR',
    summary: 'A bracket builder for how matches connect and progress across pairing, byes, and connection rules.',
    brief: [
      'A bracket builder for how matches connect and progress.',
      'It is meant to stress robust, complex cases: pairing, byes, progression edges, and the different connection rules across bracket systems.',
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
    summary:
      'Large nested hierarchies in a UPL workspace, for navigating and maintaining sports and tournament entities.',
    brief: [
      'Management testing for large nested hierarchies (sports, tournaments, and related entities) in a UPL workspace, to see how operators could navigate and maintain that scale.',
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
