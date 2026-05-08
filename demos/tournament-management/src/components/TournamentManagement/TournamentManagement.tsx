import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { LOFIButton, LOFIText, LOFIToast } from 'lofi-kit';

import {
  UNIQUE_TOURNAMENTS,
  categoryById,
  sportById,
  uniqueTournamentById,
} from '../../data/catalog';
import { applyTournamentFilters } from '../../lib/applyFilters';
import { prototypeUserHandle } from '../../lib/formatChangelogTime';
import { filtersAreActive } from '../../lib/filtersActive';
import {
  detectSelectionKind,
  firstSidebarSelectionId,
  isIntermediateNavSelection,
  listForNavigationSelection,
  normalizeNavigationSelection,
  selectionIsSimpleTournamentLeaf,
} from '../../lib/listScope';
import { buildSidebarTree } from '../../lib/sidebarTree';
import {
  createNewSimpleTournamentId,
  emptySnapshot,
  parseBrowseCategoryId,
  parseBrowseUtId,
  prefillCreateFromNav,
  snapshotToTournament,
  snapshotForClone,
  tournamentToSnapshot,
} from '../../lib/tournamentFormMappers';
import { useTournamentStore } from '../../store/useTournamentStore';
import type { ModalMode } from '../../types';
import type { SimpleTournament, TournamentFormSnapshot } from '../../types';
import { ConfirmDialog } from './ConfirmDialog';
import { FilterRow } from './FilterRow';
import { MainPane } from './MainPane';
import { ModuleTabs } from './ModuleTabs';
import { MoveTournamentModal } from './MoveTournamentModal';
import { Sidebar } from './Sidebar';
import { TournamentModal } from './TournamentModal';
import { UPLToolbar } from './UPLToolbar';
import './TournamentManagement.scss';

type EditorState =
  | { open: false }
  | {
      open: true;
      mode: ModalMode;
      seed: TournamentFormSnapshot;
      source?: SimpleTournament;
    };

export function TournamentManagement() {
  const tournaments = useTournamentStore((s) => s.tournaments);
  const filtersDraft = useTournamentStore((s) => s.filtersDraft);
  const filters = useTournamentStore((s) => s.filters);
  const selectedNavId = useTournamentStore((s) => s.selectedNavId);
  const setSelectedNavId = useTournamentStore((s) => s.setSelectedNavId);
  const role = useTournamentStore((s) => s.role);
  const cycleRole = useTournamentStore((s) => s.cycleRole);
  const changelog = useTournamentStore((s) => s.changelog);
  const toast = useTournamentStore((s) => s.toast);
  const clearToast = useTournamentStore((s) => s.clearToast);
  const setFiltersDraft = useTournamentStore((s) => s.setFiltersDraft);
  const commitSearch = useTournamentStore((s) => s.commitSearch);
  const resetAllFilters = useTournamentStore((s) => s.resetAllFilters);
  const toggleDemoFailNextMutation = useTournamentStore(
    (s) => s.toggleDemoFailNextMutation,
  );
  const upsertTournament = useTournamentStore((s) => s.upsertTournament);
  const removeTournament = useTournamentStore((s) => s.removeTournament);
  const moveTournamentToBranch = useTournamentStore(
    (s) => s.moveTournamentToBranch,
  );
  const toggleDisabledFlag = useTournamentStore((s) => s.toggleDisabledFlag);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  const [editor, setEditor] = useState<EditorState>({ open: false });
  const [moveTarget, setMoveTarget] = useState<SimpleTournament | undefined>(
    undefined,
  );
  const [bulkMoveIds, setBulkMoveIds] = useState<string[] | undefined>(undefined);
  const [removeTargetIds, setRemoveTargetIds] = useState<string[] | undefined>(undefined);
  const [disableTargetIds, setDisableTargetIds] = useState<string[] | undefined>(undefined);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(
    () => applyTournamentFilters(tournaments, filters),
    [tournaments, filters],
  );

  const treeItems = useMemo(() => buildSidebarTree(filtered), [filtered]);

  useEffect(() => {
    const normalized = normalizeNavigationSelection(selectedNavId, filtered);
    if (normalized !== selectedNavId) {
      setSelectedNavId(normalized);
    }
  }, [filtered, selectedNavId, setSelectedNavId]);

  useEffect(() => {
    if (selectedNavId || treeItems.length === 0) return;
    const first = firstSidebarSelectionId(treeItems);
    if (first) setSelectedNavId(first);
  }, [selectedNavId, setSelectedNavId, treeItems]);

  const utLabelMap = useMemo(
    () => new Map(UNIQUE_TOURNAMENTS.map((u) => [u.id, u.label] as const)),
    [],
  );

  const listRows = listForNavigationSelection(filtered, selectedNavId);
  const selectedLeaf = selectionIsSimpleTournamentLeaf(selectedNavId, filtered);
  const selectionKind = detectSelectionKind(selectedNavId, filtered);
  const filtersActive = filtersAreActive(filters);
  const hadSearchWithNoMatches = filtersActive && filtered.length === 0;
  const intermediateNav = selectedNavId
    ? isIntermediateNavSelection(selectedNavId, filtered)
    : false;
  const showSport = selectionKind === 'sport' && listRows !== undefined;
  const showList = !showSport && listRows !== undefined;
  const showDetail = selectedLeaf !== undefined;

  const listTitle =
    selectedNavId?.startsWith('browse-cat')
      ? 'Simple tournaments in category (Browse scope)'
      : selectedNavId?.startsWith('browse-ut')
        ? 'Simple tournaments in unique tournament (Browse scope)'
        : selectionKind === 'unique'
          ? 'Simple tournaments in unique tournament'
          : selectionKind === 'category'
            ? 'Simple tournaments in category'
            : selectionKind === 'sport'
              ? 'Sport tournament management'
              : '';

  const breadcrumb = useMemo<ReactNode>(() => {
    if (!selectedNavId) return undefined;
    const segments: { id?: string; label: string }[] = [];
    if (selectionKind === 'sport') {
      segments.push({ id: selectedNavId, label: sportById(selectedNavId)?.label ?? selectedNavId });
    } else if (selectionKind === 'category') {
      const rows = listRows ?? [];
      const first = rows[0];
      if (first) {
        segments.push({ id: first.sportId, label: sportById(first.sportId)?.label ?? first.sportId });
      }
      segments.push({
        id: selectedNavId,
        label: categoryById(selectedNavId)?.label ?? selectedNavId,
      });
    } else if (selectionKind === 'unique') {
      const rows = listRows ?? [];
      const first = rows[0];
      if (first) {
        segments.push({ id: first.sportId, label: sportById(first.sportId)?.label ?? first.sportId });
        segments.push({ label: categoryById(first.categoryId)?.label ?? first.categoryId });
      }
      segments.push({
        id: selectedNavId,
        label:
          selectedNavId.startsWith('ut-none-')
            ? 'No cross-season grouping'
            : uniqueTournamentById(selectedNavId)?.label ?? selectedNavId,
      });
    } else if (selectionKind === 'browse-category') {
      const categoryId = parseBrowseCategoryId(selectedNavId);
      const rows = listRows ?? [];
      const first = rows[0];
      if (first) {
        segments.push({ id: first.sportId, label: sportById(first.sportId)?.label ?? first.sportId });
      }
      segments.push({ label: categoryById(categoryId)?.label ?? categoryId });
      segments.push({ label: 'All simple tournaments' });
    } else if (selectionKind === 'browse-unique') {
      const branchId = parseBrowseUtId(selectedNavId);
      const rows = listRows ?? [];
      const first = rows[0];
      if (first) {
        segments.push({ id: first.sportId, label: sportById(first.sportId)?.label ?? first.sportId });
        segments.push({ label: categoryById(first.categoryId)?.label ?? first.categoryId });
      }
      segments.push({
        id: branchId,
        label:
          branchId.startsWith('ut-none-')
            ? 'No cross-season grouping'
            : uniqueTournamentById(branchId)?.label ?? branchId,
      });
      segments.push({ label: 'All simple tournaments' });
    }
    if (segments.length === 0) return undefined;
    return (
      <>
        {segments.map((seg, idx) => (
          <span key={`${seg.label}-${idx}`} className="tmgmt__crumb-segment">
            {seg.id ? (
              <LOFIButton type="button" variant="dismiss" size="compact" onClick={() => setSelectedNavId(seg.id)}>
                {seg.label}
              </LOFIButton>
            ) : (
              <LOFIText variant="muted">{seg.label}</LOFIText>
            )}
            {idx < segments.length - 1 ? <LOFIText variant="muted"> › </LOFIText> : null}
          </span>
        ))}
      </>
    );
  }, [listRows, selectedNavId, selectionKind, setSelectedNavId]);

  const openCreate = () =>
    setEditor({
      open: true,
      mode: 'create',
      seed: prefillCreateFromNav(emptySnapshot(), selectedNavId),
      source: undefined,
    });

  const openEdit = (id: string) => {
    const st = tournaments.find((x) => x.id === id);
    if (!st) return;
    setEditor({
      open: true,
      mode: 'edit',
      seed: tournamentToSnapshot(st),
      source: st,
    });
  };

  const cloneTournamentInstant = (id: string) => {
    const source = tournaments.find((x) => x.id === id);
    if (!source) return;
    const snap = snapshotForClone(source);
    const clone = snapshotToTournament(createNewSimpleTournamentId(), snap, false);
    void upsertTournament('clone', clone);
  };

  const roleChip = `${prototypeUserHandle(role)} (${role}) — prototype role`;
  const detailUniqueTournamentLabel =
    selectedLeaf?.uniqueTournamentId === ''
      ? 'No cross-season grouping'
      : selectedLeaf?.uniqueTournamentId
        ? uniqueTournamentById(selectedLeaf.uniqueTournamentId)?.label ??
          selectedLeaf.uniqueTournamentId
        : '';

  const startListLoading = () => {
    setListLoading(true);
    const ms = 500 + Math.random() * 1000;
    window.setTimeout(() => setListLoading(false), ms);
  };

  const handleSelectNav = (id: string) => {
    const isBrowseSelection = id.startsWith('browse-cat-') || id.startsWith('browse-ut-');
    if (isBrowseSelection) {
      startListLoading();
    } else {
      setListLoading(false);
    }
    setSelectedNavId(id);
  };

  const scopedRowIds = useMemo(() => new Set((listRows ?? []).map((row) => row.id)), [listRows]);

  useEffect(() => {
    setSelectedRowIds(new Set());
  }, [selectedNavId]);

  const toggleRowSelection = (id: string, checked: boolean) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleAllRows = (checked: boolean) => {
    if (!listRows) return;
    setSelectedRowIds(checked ? new Set(listRows.map((row) => row.id)) : new Set());
  };

  const runBulkClone = async (ids: string[]) => {
    for (const id of ids) {
      const source = tournaments.find((row) => row.id === id);
      if (!source) continue;
      const snap = snapshotForClone(source);
      const clone = snapshotToTournament(createNewSimpleTournamentId(), snap, false);
      await upsertTournament('clone', clone);
    }
    setSelectedRowIds(new Set());
  };

  const commitDisableForIds = (ids: string[]) => {
    const targets = tournaments.filter((row) => ids.includes(row.id));
    const shouldDisable = targets.some((row) => !row.disabled);
    for (const row of targets) {
      if (!scopedRowIds.has(row.id)) continue;
      if (row.disabled !== shouldDisable) {
        toggleDisabledFlag(row.id);
      }
    }
    setSelectedRowIds(new Set());
  };

  const disableTargets = useMemo(
    () => tournaments.filter((row) => (disableTargetIds ?? []).includes(row.id)),
    [disableTargetIds, tournaments],
  );
  const disableConfirmAction: 'disable' | 'enable' = disableTargets.some((row) => !row.disabled)
    ? 'disable'
    : 'enable';
  const disableConfirmTitle =
    (disableTargetIds?.length ?? 0) > 1
      ? `Confirm ${disableConfirmAction}`
      : `Confirm ${disableConfirmAction}`;
  const disableConfirmMessage = 'Are you sure?';

  return (
    <div className="tmgmt">
      <UPLToolbar onCycleRole={cycleRole} roleLabel={roleChip} />

      <ModuleTabs />

      <FilterRow
        draft={filtersDraft}
        applied={filters}
        onPatchDraft={setFiltersDraft}
        onCommitSearch={commitSearch}
        onClearAll={resetAllFilters}
        onToggleDemoFailNext={toggleDemoFailNextMutation}
      />

      <div
        className={`tmgmt__workspace${sidebarCollapsed ? ' tmgmt__workspace--sidebar-collapsed' : ''}`}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          items={treeItems}
          selectedId={selectedNavId}
          onSelect={handleSelectNav}
        />

        <div className="tmgmt__main">
          <MainPane
            hadSearchWithNoMatches={hadSearchWithNoMatches}
            selectedNavId={selectedNavId}
            selectionKind={selectionKind}
            breadcrumb={breadcrumb}
            intermediateNav={intermediateNav}
            showList={showList}
            showSport={showSport}
            showDetail={showDetail}
            selectedTournament={selectedLeaf}
            detailUniqueTournamentLabel={detailUniqueTournamentLabel}
            listTitle={listTitle}
            listRows={listRows ?? []}
            listLoading={listLoading}
            uniqueTournamentLabels={utLabelMap}
            role={role}
            selectedRowIds={selectedRowIds}
            changelog={changelog}
            filtersActive={filtersActive}
            onSelectRow={toggleRowSelection}
            onSelectAllRows={toggleAllRows}
            onClearAllFilters={resetAllFilters}
            onNavigateToNavId={handleSelectNav}
            onCreate={openCreate}
            onEdit={openEdit}
            onClone={cloneTournamentInstant}
            onRemove={(id) => setRemoveTargetIds([id])}
            onMove={(id) => {
              const st = tournaments.find((x) => x.id === id);
              if (st) setMoveTarget(st);
            }}
            onToggleDisabled={(id) => setDisableTargetIds([id])}
            onBulkMove={(ids) => {
              const first = tournaments.find((row) => row.id === ids[0]);
              if (!first) return;
              setBulkMoveIds(ids);
              setMoveTarget(first);
            }}
            onBulkClone={(ids) => {
              void runBulkClone(ids);
            }}
            onBulkRemove={(ids) => setRemoveTargetIds(ids)}
            onBulkToggleDisabled={(ids) => setDisableTargetIds(ids)}
            onRetrySearch={commitSearch}
          />
        </div>
      </div>

      {toast && (
        <LOFIToast
          className="tmgmt__toast"
          severity={toast.severity}
          message={toast.message}
          autoDismiss={30000}
          onDismiss={clearToast}
        />
      )}

      {editor.open && (
        <TournamentModal
          key={`tm-${editor.mode}-${editor.source?.id ?? 'new'}`}
          open={editor.open}
          onClose={() => setEditor({ open: false })}
          mode={editor.mode}
          seed={editor.seed}
          sourceTournament={editor.source}
          onCommit={async (mode, row, prev) => upsertTournament(mode, row, prev)}
        />
      )}

      <MoveTournamentModal
        key={moveTarget?.id ?? 'move-none'}
        open={moveTarget !== undefined}
        tournament={moveTarget}
        onClose={() => {
          setMoveTarget(undefined);
          setBulkMoveIds(undefined);
        }}
        onMoveCommit={async (categoryId, utBranchId) =>
          moveTarget
            ? bulkMoveIds && bulkMoveIds.length > 0
              ? (
                  await Promise.all(
                    bulkMoveIds.map((id) => moveTournamentToBranch(id, categoryId, utBranchId)),
                  )
                ).every(Boolean)
              : moveTournamentToBranch(moveTarget.id, categoryId, utBranchId)
            : false
        }
      />

      <ConfirmDialog
        open={removeTargetIds !== undefined}
        onClose={() => setRemoveTargetIds(undefined)}
        title={removeTargetIds && removeTargetIds.length > 1 ? 'Remove tournaments' : 'Remove tournament'}
        message={
          removeTargetIds && removeTargetIds.length > 1
            ? `Remove ${removeTargetIds.length} tournaments? This mocked flow deletes selected rows permanently.`
            : removeTargetIds && removeTargetIds[0]
              ? `Remove tournament ${removeTargetIds[0]}? This mocked flow deletes the row permanently.`
            : ''
        }
        confirmLabel="Remove"
        destructive
        onConfirm={() => {
          if (!removeTargetIds?.length) return;
          void Promise.all(removeTargetIds.map((id) => removeTournament(id))).then(() => {
            setSelectedRowIds(new Set());
          });
        }}
      />

      <ConfirmDialog
        open={disableTargetIds !== undefined && disableTargetIds.length > 0}
        onClose={() => setDisableTargetIds(undefined)}
        title={disableConfirmTitle}
        message={disableConfirmMessage}
        confirmLabel="Confirm"
        onConfirm={() => {
          if (!disableTargetIds?.length) return;
          commitDisableForIds(disableTargetIds);
        }}
      />
    </div>
  );
}
