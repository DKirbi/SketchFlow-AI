import type { ButtonSize, ButtonVariant } from '../ui/Button/Button';
import type { EmptyStateVariant } from '../ui/EmptyState/EmptyState';
import type { NavTreeItem } from '../ui/NavTree/NavTree';
import type { BadgeVariant } from '../ui/Badge/Badge';
import type { StatefulButtonState } from '../ui/StatefulButton/StatefulButton';

/**
 * Semantic role of one control inside a cluster. The host (footer, toolbar,
 * row, …) then maps this role to a LOFI variant **and** to UI Pattern
 * `color` / `rank` for the hi-fi pass.
 */
export type ActionRole = 'commit' | 'dismiss' | 'secondary' | 'destructive' | 'tertiary';

/**
 * Where the cluster is placed. Layout, default size, and UI rank all depend
 * on the host — the same `commit` role is `fill` in a modal footer and
 * `outline` in a bulk bar (UI §5.5).
 */
export type ClusterHost =
  | 'modal-footer'
  | 'p7-footer'
  | 'workspace-footer'
  | 'page-footer'
  | 'filter-actions'
  | 'toolbar-right'
  | 'card-toolbar'
  | 'bulk-bar'
  | 'row-actions'
  | 'empty-state'
  | 'list-header';

export type UiColor = 'action' | 'neutral' | 'warning' | 'attention' | 'success';
export type UiRank = 'fill' | 'outline' | 'subtle' | 'ghost';

export interface ActionPresentation {
  variant: ButtonVariant;
  size: ButtonSize;
  uiColor: UiColor;
  uiRank: UiRank;
}

/**
 * JSON-serialisable action. `id` is bound to a handler at render time.
 * `overrides` is a last-resort LOFI prop patch (variant / size only — never
 * colour or arbitrary CSS).
 */
export interface ActionDescriptor {
  id: string;
  role: ActionRole;
  label: string;
  disabled?: boolean;
  /** P3 — workspace / page commit. */
  stateful?: boolean;
  state?: StatefulButtonState;
  loadingLabel?: string;
  successLabel?: string;
  /** P7 destructive confirm — UI maps to `warning` + `fill`. */
  destructive?: boolean;
  overrides?: {
    variant?: ButtonVariant;
    size?: ButtonSize;
  };
}

export interface ActionClusterConfig {
  host: ClusterHost;
  actions: ActionDescriptor[];
}

export type FieldKind = 'text' | 'search' | 'select' | 'date' | 'switch' | 'checkbox';

export interface FieldOption {
  value: string;
  label: string;
}

/** Schema-driven field. Values are controlled by the renderer / playground. */
export interface FieldDescriptor {
  name: string;
  kind: FieldKind;
  label: string;
  value?: string | boolean;
  options?: FieldOption[];
  placeholder?: string;
  allowClear?: boolean;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface ToggleDescriptor {
  name: string;
  ariaLabel: string;
  value: string;
  options: FieldOption[];
}

export interface BadgeDescriptor {
  label: string;
  variant: BadgeVariant;
  active?: boolean;
}

export interface BreadcrumbSegment {
  label: string;
  actionId?: string;
}

export interface TabDescriptor {
  value: string;
  label: string;
  badge?: string;
}

export interface EmptyDescriptor {
  variant: EmptyStateVariant;
  title: string;
  description?: string;
  action?: ActionDescriptor;
}

export interface TableColumnDescriptor {
  id: string;
  header: string;
  field: string;
  shrink?: boolean;
}

export interface TableRowDescriptor {
  id: string;
  [field: string]: string;
}

export interface TableConfig {
  columns: TableColumnDescriptor[];
  rows: TableRowDescriptor[];
  hint?: string;
  sortable?: boolean;
  empty?: EmptyDescriptor;
  rowActions?: ActionDescriptor[];
}

export type BodyConfig =
  | { type: 'copy'; text: string; muted?: string }
  | { type: 'form'; fields: FieldDescriptor[] }
  | { type: 'table'; table: TableConfig }
  | { type: 'placeholder'; label: string }
  | { type: 'sections'; toggle: ToggleDescriptor; panels: { value: string; body: BodyConfig }[] };

export interface UpperBarConfig {
  variant: 'upl' | 'tool';
  title: string;
  subtitle?: string;
  identity?: { handle: string; role: string };
  counts?: { label: string; active: boolean }[];
  rightActions: ActionDescriptor[];
}

export type FilterApplyMode = 'commit' | 'immediate';

export interface FilterRowConfig {
  legend?: string;
  applyMode: FilterApplyMode;
  fields: FieldDescriptor[];
  actions: ActionDescriptor[];
}

export interface SidebarConfig {
  heading?: string;
  collapsed?: boolean;
  collapseActionId?: string;
  groupBy?: ToggleDescriptor;
  extraActions?: ActionDescriptor[];
  items: NavTreeItem[];
  selectedId?: string;
  emptyCopy?: string;
}

export interface WorkspaceConfig {
  breadcrumb?: BreadcrumbSegment[];
  title: string;
  badges?: BadgeDescriptor[];
  titleActions?: ActionDescriptor[];
  tabs?: TabDescriptor[];
  activeTab?: string;
  footer?: ActionDescriptor[];
  body: BodyConfig;
}

export interface SummaryCardConfig {
  title: string;
  crumb?: string;
  badges?: BadgeDescriptor[];
  pairs?: { label: string; value: string }[];
  actions: ActionDescriptor[];
}

export interface ListHeaderConfig {
  search: FieldDescriptor;
  filters: FieldDescriptor[];
  add: ActionDescriptor;
}

export interface ModalEditorConfig {
  title: string;
  description?: string;
  size?: 'default' | 'wide';
  open?: boolean;
  body: BodyConfig;
  footer: ActionDescriptor[];
}

export interface P7ConfirmConfig {
  title: string;
  message: string;
  muted?: string;
  open?: boolean;
  dismiss: ActionDescriptor;
  confirm: ActionDescriptor;
}

export interface ToolShellConfig {
  toolbar: UpperBarConfig;
  bulkBar?: ActionDescriptor[];
  table: TableConfig;
  pageFooter?: ActionDescriptor[];
}

export interface UplShellConfig {
  upperBar: UpperBarConfig;
  moduleTabs?: TabDescriptor[];
  activeModule?: string;
  filterRow?: FilterRowConfig;
  sidebar: SidebarConfig;
  workspace: WorkspaceConfig;
}

export type ComponentSet =
  | ({ kind: 'action-cluster' } & ActionClusterConfig)
  | ({ kind: 'upper-bar' } & UpperBarConfig)
  | ({ kind: 'filter-query-row' } & FilterRowConfig)
  | ({ kind: 'sidebar' } & SidebarConfig)
  | ({ kind: 'main-workspace' } & WorkspaceConfig)
  | ({ kind: 'summary-card' } & SummaryCardConfig)
  | ({ kind: 'list-header' } & ListHeaderConfig)
  | ({ kind: 'table-chrome' } & TableConfig)
  | ({ kind: 'modal-editor' } & ModalEditorConfig)
  | ({ kind: 'p7-confirm' } & P7ConfirmConfig)
  | ({ kind: 'tool-shell' } & ToolShellConfig)
  | ({ kind: 'upl-shell' } & UplShellConfig);

export interface SetExample {
  id: string;
  title: string;
  /** Path of the demo composition this config was extracted from. */
  source: string;
  /** UX pattern ids (P1, P5, P7, …). */
  ux: string[];
  /** UI pattern sections (U1, U4.2, §5.2, …). */
  ui: string[];
  set: ComponentSet;
}

export interface ComponentSetHandlers {
  onAction?: (id: string) => void;
  onFieldChange?: (name: string, value: string | boolean) => void;
  onSelect?: (id: string) => void;
  onTabChange?: (value: string) => void;
  onToggleChange?: (name: string, value: string) => void;
}
