import type { ReactNode } from 'react';
import type { ChangelogEntry, Role, SimpleTournament } from '../../types';
import type { NavSelectionKind } from '../../lib/listScope';
import { DetailView } from './DetailView';
import { ListView } from './ListView';
import { MainEmptyState } from './MainEmptyState';
import { SportManagementView } from './SportManagementView';

export interface MainPaneProps {
  hadSearchWithNoMatches: boolean;
  selectedNavId: string | undefined;
  selectionKind: NavSelectionKind;
  breadcrumb?: ReactNode;
  intermediateNav: boolean;
  showList: boolean;
  showSport: boolean;
  showDetail: boolean;
  selectedTournament: SimpleTournament | undefined;
  detailUniqueTournamentLabel: string;
  listTitle: string;
  listRows: SimpleTournament[];
  listLoading: boolean;
  uniqueTournamentLabels: Map<string, string>;
  role: Role;
  selectedRowIds: Set<string>;
  changelog: ChangelogEntry[];
  filtersActive: boolean;
  onSelectRow: (id: string, checked: boolean) => void;
  onSelectAllRows: (checked: boolean) => void;
  onClearAllFilters: () => void;
  onNavigateToNavId: (id: string) => void;
  onCreate: () => void;
  onEdit: (id: string) => void;
  onClone: (id: string) => void;
  onRemove: (id: string) => void;
  onMove: (id: string) => void;
  onToggleDisabled: (id: string) => void;
  onBulkMove: (ids: string[]) => void;
  onBulkClone: (ids: string[]) => void;
  onBulkRemove: (ids: string[]) => void;
  onBulkToggleDisabled: (ids: string[]) => void;
  onRetrySearch: () => void;
}

/** P1.2.3 — Stable main workspace frame: list, detail, or empty states. */
export function MainPane({
  hadSearchWithNoMatches,
  selectedNavId,
  selectionKind,
  breadcrumb,
  intermediateNav,
  showList,
  showSport,
  showDetail,
  selectedTournament,
  detailUniqueTournamentLabel,
  listTitle,
  listRows,
  listLoading,
  uniqueTournamentLabels,
  role,
  selectedRowIds,
  changelog,
  filtersActive,
  onSelectRow,
  onSelectAllRows,
  onClearAllFilters,
  onNavigateToNavId,
  onCreate,
  onEdit,
  onClone,
  onRemove,
  onMove,
  onToggleDisabled,
  onBulkMove,
  onBulkClone,
  onBulkRemove,
  onBulkToggleDisabled,
  onRetrySearch,
}: MainPaneProps) {
  if (hadSearchWithNoMatches) {
    return (
      <MainEmptyState
        variant="no-matching-data"
        onClearAll={() => {
          onClearAllFilters();
        }}
      />
    );
  }

  if (!selectedNavId) {
    return (
      <MainEmptyState
        variant="pick-sidebar"
        onClearAll={filtersActive ? onClearAllFilters : undefined}
      />
    );
  }

  if (intermediateNav) {
    return <MainEmptyState variant="pick-browse" />;
  }

  if (showDetail && selectedTournament) {
    return (
      <DetailView
        tournament={selectedTournament}
        uniqueTournamentLabel={detailUniqueTournamentLabel}
        changelog={changelog}
        role={role}
        onEdit={() => onEdit(selectedTournament.id)}
        onClone={() => onClone(selectedTournament.id)}
        onRemove={() => onRemove(selectedTournament.id)}
        onMove={() => onMove(selectedTournament.id)}
        onToggleDisabled={() => onToggleDisabled(selectedTournament.id)}
        onNavigateToNavId={onNavigateToNavId}
      />
    );
  }

  if (showSport) {
    return (
      <SportManagementView
        title="Sport tournament management"
        breadcrumb={breadcrumb}
        rows={listRows}
        uniqueTournamentLabels={uniqueTournamentLabels}
        role={role}
        selectedRowIds={selectedRowIds}
        onToggleRowSelection={onSelectRow}
        onToggleAllRows={onSelectAllRows}
        onCreate={onCreate}
        onEdit={onEdit}
        onClone={onClone}
        onRemove={onRemove}
        onMove={onMove}
        onToggleDisabled={onToggleDisabled}
        onBulkMove={onBulkMove}
        onBulkClone={onBulkClone}
        onBulkRemove={onBulkRemove}
        onBulkToggleDisabled={onBulkToggleDisabled}
      />
    );
  }

  if (showList) {
    return (
      <ListView
        title={selectionKind === 'unique' ? 'Unique tournament management' : listTitle}
        breadcrumb={breadcrumb}
        rows={listRows}
        uniqueTournamentLabels={uniqueTournamentLabels}
        role={role}
        loading={listLoading}
        selectedRowIds={selectedRowIds}
        onToggleRowSelection={onSelectRow}
        onToggleAllRows={onSelectAllRows}
        onCreate={onCreate}
        onEdit={onEdit}
        onClone={onClone}
        onRemove={onRemove}
        onMove={onMove}
        onToggleDisabled={onToggleDisabled}
        onBulkMove={onBulkMove}
        onBulkClone={onBulkClone}
        onBulkRemove={onBulkRemove}
        onBulkToggleDisabled={onBulkToggleDisabled}
        onRetrySearch={onRetrySearch}
      />
    );
  }

  return <MainEmptyState variant="pick-browse" />;
}
