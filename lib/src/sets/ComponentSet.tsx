import type { ReactNode } from 'react';
import type { ColumnDef, TableColumnMeta } from '../ui/Table/Table';
import {
  LOFIBadge,
  LOFIButton,
  LOFICard,
  LOFIChip,
  LOFIEmptyState,
  LOFIMainWorkspace,
  LOFIModal,
  LOFINavTree,
  LOFITable,
  LOFITabs,
  LOFIText,
  LOFIToggle,
  LOFIToolbar,
  LOFITooltip,
  LOFITooltipMarker,
} from '../ui/index';
import { ActionCluster } from './ActionCluster';
import { FieldFromDescriptor } from './FieldFromDescriptor';
import type {
  BodyConfig,
  ComponentSet,
  ComponentSetHandlers,
  EmptyDescriptor,
  FilterChipGroupConfig,
  FilterRowConfig,
  ListHeaderConfig,
  ModalEditorConfig,
  P7ConfirmConfig,
  SidebarConfig,
  SuggestionRowConfig,
  SummaryCardConfig,
  TableConfig,
  TableRowDescriptor,
  ToolShellConfig,
  UpperBarConfig,
  UplShellConfig,
  WorkspaceConfig,
} from './types';
import './ComponentSet.scss';

export interface ComponentSetProps {
  set: ComponentSet;
  handlers?: ComponentSetHandlers;
  children?: ReactNode;
}

function noopHandlers(): ComponentSetHandlers {
  return {};
}

function EmptyFromConfig({
  empty,
  onAction,
}: {
  empty: EmptyDescriptor;
  onAction?: ComponentSetHandlers['onAction'];
}) {
  return (
    <LOFIEmptyState
      variant={empty.variant}
      title={empty.title}
      description={empty.description}
      action={
        empty.action ? (
          <ActionCluster host="empty-state" actions={[empty.action]} onAction={onAction} />
        ) : undefined
      }
    />
  );
}

function TableFromConfig({
  table,
  onAction,
}: {
  table: TableConfig;
  onAction?: ComponentSetHandlers['onAction'];
}) {
  const columns: ColumnDef<TableRowDescriptor, unknown>[] = table.columns.map((col) => ({
    id: col.id,
    accessorKey: col.field,
    header: col.header,
    meta: col.shrink ? ({ shrink: true } satisfies TableColumnMeta) : undefined,
    cell: ({ row }) => <LOFIText variant="sm">{row.original[col.field] ?? ''}</LOFIText>,
  }));

  if (table.rowActions && table.rowActions.length > 0) {
    columns.push({
      id: 'actions',
      header: 'Actions',
      meta: { shrink: true } satisfies TableColumnMeta,
      cell: () => (
        <ActionCluster host="row-actions" actions={table.rowActions ?? []} onAction={onAction} />
      ),
    });
  }

  return (
    <LOFITable<TableRowDescriptor>
      columns={columns}
      rows={table.rows}
      keyField="id"
      sortable={table.sortable}
      hint={table.hint}
      emptySlot={
        table.empty ? <EmptyFromConfig empty={table.empty} onAction={onAction} /> : undefined
      }
    />
  );
}

function BodyFromConfig({
  body,
  handlers,
}: {
  body: BodyConfig;
  handlers: ComponentSetHandlers;
}) {
  if (body.type === 'copy') {
    return (
      <>
        <LOFIText variant="body">{body.text}</LOFIText>
        {body.muted ? <LOFIText variant="muted">{body.muted}</LOFIText> : null}
      </>
    );
  }
  if (body.type === 'form') {
    return (
      <div className="component-set__form">
        {body.fields.map((field) => (
          <FieldFromDescriptor key={field.name} field={field} onFieldChange={handlers.onFieldChange} />
        ))}
      </div>
    );
  }
  if (body.type === 'table') {
    return <TableFromConfig table={body.table} onAction={handlers.onAction} />;
  }
  if (body.type === 'placeholder') {
    return <LOFIText variant="muted">{body.label}</LOFIText>;
  }
  return (
    <>
      <LOFIToggle
        ariaLabel={body.toggle.ariaLabel}
        value={body.toggle.value}
        onChange={(v) => handlers.onToggleChange?.(body.toggle.name, v)}
        options={body.toggle.options}
      />
      {body.panels
        .filter((panel) => panel.value === body.toggle.value)
        .map((panel) => (
          <BodyFromConfig key={panel.value} body={panel.body} handlers={handlers} />
        ))}
    </>
  );
}

function UpperBarFromConfig({
  config,
  onAction,
  onFieldChange,
}: {
  config: UpperBarConfig;
  onAction?: ComponentSetHandlers['onAction'];
  onFieldChange?: ComponentSetHandlers['onFieldChange'];
}) {
  if (config.variant === 'upl') {
    return (
      <LOFIToolbar
        left={
          <div className="component-set__upl-left">
            <div className="component-set__logo" aria-hidden />
            <div className="component-set__upl-titles">
              <LOFIText as="span" variant="body">
                {config.title}
              </LOFIText>
              {config.subtitle ? (
                <LOFIText as="span" variant="muted">
                  {config.subtitle}
                </LOFIText>
              ) : null}
            </div>
          </div>
        }
        right={
          <ActionCluster host="toolbar-right" actions={config.rightActions} onAction={onAction} />
        }
      />
    );
  }

  return (
    <LOFIToolbar
      left={
        config.identity ? (
          <span className="component-set__tool-identity">
            <LOFIText variant="sm">{config.identity.handle}</LOFIText>
            <LOFIBadge variant="tag" label={config.identity.role} />
          </span>
        ) : undefined
      }
      center={
        <LOFIText as="h1" variant="body">
          {config.title}
        </LOFIText>
      }
      right={
        config.catalog || config.counts || config.rightActions.length > 0 ? (
          <span className="component-set__tool-right">
            {config.catalog ? (
              <FieldFromDescriptor field={config.catalog} onFieldChange={onFieldChange} />
            ) : null}
            {config.counts ? (
              <span className="component-set__tool-counts">
                {config.counts.map((count) => (
                  <LOFIBadge key={count.label} variant="status" active={count.active} label={count.label} />
                ))}
              </span>
            ) : config.rightActions.length > 0 ? (
              <ActionCluster host="toolbar-right" actions={config.rightActions} onAction={onAction} />
            ) : null}
          </span>
        ) : undefined
      }
    />
  );
}

function FilterChipGroupFromConfig({
  config,
  onAction,
}: {
  config: FilterChipGroupConfig;
  onAction?: ComponentSetHandlers['onAction'];
}) {
  return (
    <div className="component-set__chip-group" role="group" aria-label={config.ariaLabel ?? 'Status filters'}>
      {config.chips.map((chip) => {
        const label = chip.count == null ? chip.label : `${chip.label} (${chip.count})`;
        return (
          <LOFIChip
            key={chip.id}
            label={label}
            selected={chip.selected}
            onClick={() => {
              if (!chip.selected) onAction?.(chip.id);
            }}
          />
        );
      })}
    </div>
  );
}

function SuggestionRowFromConfig({
  config,
  onAction,
}: {
  config: SuggestionRowConfig;
  onAction?: ComponentSetHandlers['onAction'];
}) {
  return (
    <div className="component-set__suggestion-row">
      <LOFIText variant="body">{config.external}</LOFIText>
      <LOFIBadge variant="tag" label={`${config.percent}%`} />
      <ActionCluster host="row-actions" actions={[config.map, config.unmap]} onAction={onAction} />
    </div>
  );
}

function FilterRowFromConfig({
  config,
  handlers,
}: {
  config: FilterRowConfig;
  handlers: ComponentSetHandlers;
}) {
  return (
    <div className="component-set__filter" role="search">
      {config.legend ? (
        <span className="component-set__filter-legend">
          <LOFITooltip content={config.legend}>
            <LOFITooltipMarker label="filters" />
          </LOFITooltip>
        </span>
      ) : null}
      <div className="component-set__filter-grid">
        {config.fields.map((field) => (
          <FieldFromDescriptor key={field.name} field={field} onFieldChange={handlers.onFieldChange} />
        ))}
        {config.actions.length > 0 ? (
          <div className="component-set__filter-actions">
            <ActionCluster host="filter-actions" actions={config.actions} onAction={handlers.onAction} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SidebarFromConfig({
  config,
  handlers,
}: {
  config: SidebarConfig;
  handlers: ComponentSetHandlers;
}) {
  if (config.collapsed) {
    return (
      <aside className="component-set__sidebar component-set__sidebar--collapsed" aria-label="Sidebar">
        <LOFIButton
          type="button"
          variant="dismiss"
          size="compact"
          onClick={() => handlers.onAction?.(config.collapseActionId ?? 'collapse')}
        >
          ▶
        </LOFIButton>
      </aside>
    );
  }

  return (
    <aside className="component-set__sidebar" aria-label="Sidebar">
      <div className="component-set__sidebar-head">
        {config.heading ? (
          <LOFIText as="p" variant="caps">
            {config.heading}
          </LOFIText>
        ) : null}
        {config.collapseActionId ? (
          <LOFIButton
            type="button"
            variant="dismiss"
            size="compact"
            onClick={() => handlers.onAction?.(config.collapseActionId ?? 'collapse')}
          >
            ◀
          </LOFIButton>
        ) : null}
      </div>
      {config.groupBy ? (
        <LOFIToggle
          ariaLabel={config.groupBy.ariaLabel}
          value={config.groupBy.value}
          onChange={(v) => handlers.onToggleChange?.(config.groupBy?.name ?? 'groupBy', v)}
          options={config.groupBy.options}
        />
      ) : null}
      {config.extraActions && config.extraActions.length > 0 ? (
        <ActionCluster host="card-toolbar" actions={config.extraActions} onAction={handlers.onAction} />
      ) : null}
      {config.items.length === 0 ? (
        <LOFIText variant="description">{config.emptyCopy ?? 'No rows match the current filters.'}</LOFIText>
      ) : (
        <LOFINavTree
          items={config.items}
          selectedId={config.selectedId}
          onSelect={handlers.onSelect}
        />
      )}
    </aside>
  );
}

function WorkspaceFromConfig({
  config,
  handlers,
}: {
  config: WorkspaceConfig;
  handlers: ComponentSetHandlers;
}) {
  const breadcrumb =
    config.breadcrumb && config.breadcrumb.length > 0 ? (
      <div className="component-set__breadcrumb">
        {config.breadcrumb.map((segment, index) => (
          <span key={`${segment.label}-${index}`}>
            {index > 0 ? <LOFIText variant="muted"> › </LOFIText> : null}
            {segment.actionId ? (
              <LOFIButton
                type="button"
                size="compact"
                variant="dismiss"
                onClick={() => handlers.onAction?.(segment.actionId ?? '')}
              >
                {segment.label}
              </LOFIButton>
            ) : (
              <LOFIText variant="muted">{segment.label}</LOFIText>
            )}
          </span>
        ))}
      </div>
    ) : undefined;

  return (
    <LOFIMainWorkspace
      breadcrumb={breadcrumb}
      title={config.title}
      titleBadges={
        config.badges
          ? config.badges.map((badge) => (
              <LOFIBadge
                key={badge.label}
                variant={badge.variant}
                label={badge.label}
                active={badge.active}
              />
            ))
          : undefined
      }
      titleActions={
        config.titleActions ? (
          <ActionCluster host="card-toolbar" actions={config.titleActions} onAction={handlers.onAction} />
        ) : undefined
      }
      tabs={
        config.tabs ? (
          <LOFITabs
            ariaLabel="Workspace sections"
            value={config.activeTab ?? config.tabs[0]?.value ?? ''}
            onChange={(v) => handlers.onTabChange?.(v)}
            tabs={config.tabs}
          />
        ) : undefined
      }
      footer={
        config.footer ? (
          <ActionCluster host="workspace-footer" actions={config.footer} onAction={handlers.onAction} />
        ) : undefined
      }
    >
      <BodyFromConfig body={config.body} handlers={handlers} />
    </LOFIMainWorkspace>
  );
}

function SummaryCardFromConfig({
  config,
  onAction,
}: {
  config: SummaryCardConfig;
  onAction?: ComponentSetHandlers['onAction'];
}) {
  return (
    <LOFICard
      title={config.title}
      footer={<ActionCluster host="card-toolbar" actions={config.actions} onAction={onAction} />}
    >
      {config.crumb ? (
        <LOFIText variant="micro">{config.crumb}</LOFIText>
      ) : null}
      {config.badges ? (
        <div className="component-set__card-flags">
          {config.badges.map((badge) => (
            <LOFIBadge
              key={badge.label}
              variant={badge.variant}
              label={badge.label}
              active={badge.active}
            />
          ))}
        </div>
      ) : null}
      {config.pairs ? (
        <div className="component-set__card-pairs">
          {config.pairs.map((pair) => (
            <div key={pair.label} className="component-set__card-pair">
              <LOFIText variant="body">{pair.label}</LOFIText>
              <LOFIText variant="muted">{pair.value}</LOFIText>
            </div>
          ))}
        </div>
      ) : null}
    </LOFICard>
  );
}

function ListHeaderFromConfig({
  config,
  handlers,
}: {
  config: ListHeaderConfig;
  handlers: ComponentSetHandlers;
}) {
  return (
    <div className="component-set__list-header">
      <div className="component-set__list-header-search">
        <FieldFromDescriptor field={config.search} onFieldChange={handlers.onFieldChange} />
      </div>
      <div className="component-set__list-header-filters">
        {config.filters.map((field) => (
          <FieldFromDescriptor key={field.name} field={field} onFieldChange={handlers.onFieldChange} />
        ))}
      </div>
      <ActionCluster host="list-header" actions={[config.add]} onAction={handlers.onAction} />
    </div>
  );
}

function ModalEditorFromConfig({
  config,
  handlers,
}: {
  config: ModalEditorConfig;
  handlers: ComponentSetHandlers;
}) {
  return (
    <LOFIModal
      open={config.open !== false}
      onClose={() => handlers.onAction?.('close')}
      title={config.title}
      description={config.description}
      size={config.size}
      footer={<ActionCluster host="modal-footer" actions={config.footer} onAction={handlers.onAction} />}
    >
      <BodyFromConfig body={config.body} handlers={handlers} />
    </LOFIModal>
  );
}

function P7FromConfig({
  config,
  handlers,
}: {
  config: P7ConfirmConfig;
  handlers: ComponentSetHandlers;
}) {
  return (
    <LOFIModal
      open={config.open !== false}
      onClose={() => handlers.onAction?.(config.dismiss.id)}
      title={config.title}
      footer={
        <ActionCluster
          host="p7-footer"
          actions={[config.dismiss, config.confirm]}
          onAction={handlers.onAction}
        />
      }
    >
      <LOFIText variant="body">{config.message}</LOFIText>
      {config.muted ? <LOFIText variant="description">{config.muted}</LOFIText> : null}
    </LOFIModal>
  );
}

function ToolShellFromConfig({
  config,
  handlers,
  children,
}: {
  config: ToolShellConfig;
  handlers: ComponentSetHandlers;
  children?: ReactNode;
}) {
  const framed = config.framed !== false;
  const rootCls = [
    'component-set',
    framed ? 'component-set--frame' : '',
    'component-set__tool-shell',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootCls}>
      <UpperBarFromConfig
        config={config.toolbar}
        onAction={handlers.onAction}
        onFieldChange={handlers.onFieldChange}
      />
      <div className="component-set__tool-body">
        {config.filterRow ? <FilterRowFromConfig config={config.filterRow} handlers={handlers} /> : null}
        <div className="component-set__tool-interface">
          {config.tabs ? (
            <LOFITabs
              ariaLabel="Mapping contexts"
              value={config.activeTab ?? config.tabs[0]?.value ?? ''}
              onChange={(v) => handlers.onTabChange?.(v)}
              tabs={config.tabs}
            />
          ) : null}
          {config.chipGroup ? (
            <FilterChipGroupFromConfig config={config.chipGroup} onAction={handlers.onAction} />
          ) : null}
          {config.bulkBar ? (
            <div className="component-set__bulk-bar">
              <ActionCluster host="bulk-bar" actions={config.bulkBar} onAction={handlers.onAction} />
            </div>
          ) : null}
          {children ?? (config.table ? <TableFromConfig table={config.table} onAction={handlers.onAction} /> : null)}
        </div>
      </div>
      {config.pageFooter ? (
        <div className="component-set__page-footer">
          <ActionCluster host="page-footer" actions={config.pageFooter} onAction={handlers.onAction} />
        </div>
      ) : null}
    </div>
  );
}

function UplShellFromConfig({
  config,
  handlers,
}: {
  config: UplShellConfig;
  handlers: ComponentSetHandlers;
}) {
  const collapsed = config.sidebar.collapsed === true;
  return (
    <div className="component-set component-set--frame component-set__upl-shell">
      <UpperBarFromConfig config={config.upperBar} onAction={handlers.onAction} />
      {config.moduleTabs ? (
        <LOFITabs
          ariaLabel="Modules"
          value={config.activeModule ?? config.moduleTabs[0]?.value ?? ''}
          onChange={(v) => handlers.onTabChange?.(v)}
          tabs={config.moduleTabs}
        />
      ) : null}
      {config.filterRow ? <FilterRowFromConfig config={config.filterRow} handlers={handlers} /> : null}
      <div
        className={
          collapsed
            ? 'component-set__upl-body component-set__upl-body--collapsed'
            : 'component-set__upl-body'
        }
      >
        <SidebarFromConfig config={config.sidebar} handlers={handlers} />
        <div className="component-set__upl-main">
          <LOFICard className="component-set__upl-main-card">
            <WorkspaceFromConfig config={config.workspace} handlers={handlers} />
          </LOFICard>
        </div>
      </div>
    </div>
  );
}

export function ComponentSetView({ set, handlers, children }: ComponentSetProps) {
  const h = handlers ?? noopHandlers();

  switch (set.kind) {
    case 'action-cluster':
      return <ActionCluster host={set.host} actions={set.actions} onAction={h.onAction} />;
    case 'upper-bar':
      return (
        <UpperBarFromConfig config={set} onAction={h.onAction} onFieldChange={h.onFieldChange} />
      );
    case 'filter-query-row':
      return <FilterRowFromConfig config={set} handlers={h} />;
    case 'filter-chip-group':
      return <FilterChipGroupFromConfig config={set} onAction={h.onAction} />;
    case 'sidebar':
      return <SidebarFromConfig config={set} handlers={h} />;
    case 'main-workspace':
      return (
        <div className="component-set component-set--frame">
          <WorkspaceFromConfig config={set} handlers={h} />
        </div>
      );
    case 'summary-card':
      return <SummaryCardFromConfig config={set} onAction={h.onAction} />;
    case 'list-header':
      return <ListHeaderFromConfig config={set} handlers={h} />;
    case 'table-chrome':
      return <TableFromConfig table={set} onAction={h.onAction} />;
    case 'suggestion-row':
      return <SuggestionRowFromConfig config={set} onAction={h.onAction} />;
    case 'modal-editor':
      return <ModalEditorFromConfig config={set} handlers={h} />;
    case 'p7-confirm':
      return <P7FromConfig config={set} handlers={h} />;
    case 'tool-shell':
      return <ToolShellFromConfig config={set} handlers={h}>{children}</ToolShellFromConfig>;
    case 'upl-shell':
      return <UplShellFromConfig config={set} handlers={h} />;
  }
}
