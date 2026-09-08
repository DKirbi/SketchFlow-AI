import type { ComponentSet } from './types';

export interface ComponentSetKindNav {
  kind: ComponentSet['kind'];
  nav: string;
}

/** Sidebar labels for Storybook / hub. Order is the documented inventory. */
export const COMPONENT_SET_KIND_NAV: readonly ComponentSetKindNav[] = [
  { kind: 'action-cluster', nav: 'Action cluster' },
  { kind: 'upper-bar', nav: 'Upper bar' },
  { kind: 'filter-query-row', nav: 'Filter query row' },
  { kind: 'filter-chip-group', nav: 'Filter chip group' },
  { kind: 'sidebar', nav: 'Sidebar' },
  { kind: 'main-workspace', nav: 'Main workspace' },
  { kind: 'summary-card', nav: 'Summary card' },
  { kind: 'list-header', nav: 'List header' },
  { kind: 'table-chrome', nav: 'Table chrome' },
  { kind: 'suggestion-row', nav: 'Suggestion row' },
  { kind: 'modal-editor', nav: 'Modal editor' },
  { kind: 'p7-confirm', nav: 'P7 confirm' },
  { kind: 'tool-shell', nav: 'Tool shell' },
  { kind: 'upl-shell', nav: 'UPL shell' },
];
