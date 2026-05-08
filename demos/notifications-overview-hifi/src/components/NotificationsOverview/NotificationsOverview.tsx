import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { useReducedMotion } from '@mantine/hooks';
import {
  PdsBox,
  PdsMantineBadge,
  PdsMantineButton,
  PdsMantineMultiselect,
  PdsMantineText,
  PdsTab,
  PdsTabGroup,
  PdsToast,
  PdsToastBody,
  PdsToastHeader,
  PdsToggleButton,
  PdsToggleButtonGroup,
  pdsNotify,
} from '@podium-design-system/react-components';
import { FILTER_OPTION_ALL } from '../../constants';
import { SEED_PENDING, SEED_RESOLVED } from '../../data/notifications';
import type {
  CityOfficeId,
  GroupByMode,
  MainTab,
  NotificationFilters,
  NotificationRow,
  OperatorId,
  PriorityBand,
  Role,
} from '../../types';
import { ALL_OFFICES_VALUE, cityOfficeSelectData } from '../../data/cityOffices';
import { operatorById } from '../../data/operators';
import { applyFilters, applyFiltersExceptPriority } from '../../lib/applyFilters';
import { filterRowsBySelection, selectionTitle } from '../../lib/selection';
import { sidebarLeafIdFromRow } from '../../lib/sidebarTree';
import type { EmptyReason } from './NotificationsTable';
import { NotificationsFilters } from './NotificationsFilters';
import { NotificationsSidebar } from './NotificationsSidebar';
import { NotificationsTable } from './NotificationsTable';
import type { FC, LazyExoticComponent } from 'react';
import type { NotificationsTimelineDockProps } from './NotificationsTimelineDock/types';
import { useTimelineNow } from './NotificationsTimelineDock/useTimelineNow';

const LazyNotificationsTimelineDock = lazy(
  () =>
    import('./NotificationsTimelineDock').then((m) => ({ default: m.NotificationsTimelineDock })),
) as unknown as LazyExoticComponent<FC<NotificationsTimelineDockProps>>;
import { DEMO_NOW_MS } from '../../data/notifications';

const defaultFilters: NotificationFilters = {
  daysBack: '7',
  sport: FILTER_OPTION_ALL,
  lsLevel: FILTER_OPTION_ALL,
  issueType: FILTER_OPTION_ALL,
  cityOffice: FILTER_OPTION_ALL,
  priorityBand: 'high',
};

const TOAST_CONTAINER_ID = 'notifications-hifi-toast';

/** The mock operator bound to the "Operator" role. */
const OPERATOR_SELF_ID: OperatorId = 'r.operator';

export function NotificationsOverview() {
  const reducedMotion = useReducedMotion();
  const { nowMs, isLive } = useTimelineNow(DEMO_NOW_MS);
  const [pending, setPending] = useState<NotificationRow[]>(SEED_PENDING);
  const [resolved, setResolved] = useState<NotificationRow[]>(SEED_RESOLVED);
  const [mainTab, setMainTab] = useState<MainTab>('pending');
  const [filters, setFilters] = useState<NotificationFilters>(defaultFilters);
  const [groupBy, setGroupBy] = useState<GroupByMode>('message-type');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // Role and supervisor drill-in
  const [role, setRole] = useState<Role>('operator');
  const [selectedOperatorId, setSelectedOperatorId] = useState<OperatorId | null>(null);

  // Timeline click → single-row table focus
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  /** Supervisor dock: pressed-match circles narrow the table to one match. */
  const [focusedMatchId, setFocusedMatchId] = useState<string | null>(null);

  // ── Role-scoped row pools ─────────────────────────────────────────────────

  /**
   * Pending rows visible to the current role:
   *  - Operator: own assignments only
   *  - Supervisor: all (narrowed further by selectedOperatorId if set)
   */
  const rolePending = useMemo(() => {
    if (role === 'operator') {
      return pending.filter((r) => r.assignedOperatorId === OPERATOR_SELF_ID);
    }
    if (selectedOperatorId) {
      return pending.filter((r) => r.assignedOperatorId === selectedOperatorId);
    }
    return pending;
  }, [pending, role, selectedOperatorId]);

  const roleResolved = useMemo(() => {
    if (role === 'operator') {
      return resolved.filter((r) => r.resolvedByOperatorId === OPERATOR_SELF_ID);
    }
    if (selectedOperatorId) {
      return resolved.filter(
        (r) =>
          r.assignedOperatorId === selectedOperatorId ||
          r.resolvedByOperatorId === selectedOperatorId,
      );
    }
    return resolved;
  }, [resolved, role, selectedOperatorId]);

  // ── Filter application (sidebar + table source) ───────────────────────────

  const filteredPending = useMemo(
    () => applyFilters(rolePending, filters),
    [rolePending, filters],
  );

  const filteredResolved = useMemo(
    () => applyFilters(roleResolved, filters),
    [roleResolved, filters],
  );

  const effectiveSelectedId = useMemo(() => {
    if (selectedId === undefined) return undefined;
    const source = mainTab === 'pending' ? filteredPending : filteredResolved;
    return filterRowsBySelection(selectedId, source).length > 0 ? selectedId : undefined;
  }, [selectedId, filteredPending, filteredResolved, mainTab]);

  const priorityBandPool = useMemo(
    () => applyFiltersExceptPriority(rolePending, filters),
    [rolePending, filters],
  );

  const priorityBandCounts = useMemo(() => {
    let high = 0;
    let low = 0;
    for (const r of priorityBandPool) {
      if (r.priority > 5) high++;
      else low++;
    }
    return { high, low, total: priorityBandPool.length };
  }, [priorityBandPool]);

  // ── Event handlers ────────────────────────────────────────────────────────

  const handleClearAll = useCallback(() => {
    setFilters(defaultFilters);
    setSelectedOperatorId(null);
    setSelectedNotificationId(null);
    setFocusedMatchId(null);
    setSelectedId(undefined);
  }, []);

  const handleExitOperatorDrill = useCallback(() => {
    setSelectedOperatorId(null);
    setSelectedNotificationId(null);
    setFocusedMatchId(null);
    setSelectedId(undefined);
  }, []);

  const handleDockFocusMatch = useCallback((matchId: string | null) => {
    setFocusedMatchId(matchId);
    if (matchId !== null) {
      setSelectedNotificationId(null);
      setSelectedId(undefined);
      setMainTab('pending');
    }
  }, []);

  const handleSidebarSelect = useCallback((id: string) => {
    setFocusedMatchId(null);
    setSelectedId(id);
  }, []);

  const handlePriorityBand = useCallback((value: string) => {
    setFilters((f) => ({
      ...f,
      priorityBand: value as PriorityBand,
    }));
  }, []);

  const handleGroupByChange = useCallback(
    (mode: GroupByMode) => {
      setGroupBy(mode);
      setSelectedId(() => {
        if (!selectedNotificationId) return undefined;
        const row =
          pending.find((r) => r.id === selectedNotificationId) ??
          resolved.find((r) => r.id === selectedNotificationId);
        return row ? sidebarLeafIdFromRow(row, mode) : undefined;
      });
    },
    [pending, resolved, selectedNotificationId],
  );

  const handleRoleChange = useCallback((value: string) => {
    setRole(value as Role);
    setSelectedId(undefined);
    setSelectedNotificationId(null);
    setFocusedMatchId(null);
    setSelectedOperatorId(null);
  }, []);

  const handleTimelineNotificationSelect = useCallback(
    (id: string | null) => {
      setSelectedNotificationId(id);
      if (!id) {
        setSelectedId(undefined);
        return;
      }
      setFocusedMatchId(null);
      const row = pending.find((r) => r.id === id) ?? resolved.find((r) => r.id === id);
      if (row) {
        setSelectedId(sidebarLeafIdFromRow(row, groupBy));
      }
      const isInResolved = resolved.some((r) => r.id === id);
      if (isInResolved && mainTab !== 'resolved') {
        setMainTab('resolved');
      } else if (!isInResolved && mainTab !== 'pending') {
        setMainTab('pending');
      }
    },
    [resolved, mainTab, pending, groupBy],
  );

  const handleResolve = useCallback(
    (id: string) => {
      setResolvingId(id);
      const delay = 500 + Math.random() * 1000;
      window.setTimeout(() => {
        setPending((p) => {
          const row = p.find((x) => x.id === id);
          if (!row) return p;
          const stamped: NotificationRow = {
            ...row,
            resolvedAt: new Date().toISOString(),
            resolvedByOperatorId: OPERATOR_SELF_ID,
          };
          setResolved((prev) => [stamped, ...prev]);
          return p.filter((x) => x.id !== id);
        });
        setResolvingId(null);
        pdsNotify(
          <>
            <PdsToastHeader>Resolved</PdsToastHeader>
            <PdsToastBody>Notification resolved</PdsToastBody>
          </>,
          TOAST_CONTAINER_ID,
        );
      }, delay);
    },
    [],
  );

  // ── Display rows (sidebar scope + optional timeline single-row override) ──

  const { displayRows, totalAfterFilters, highlightedIds, emptyReason, workspaceTitle } = useMemo(() => {
    const source = mainTab === 'pending' ? filteredPending : filteredResolved;

    // Timeline single-row pin: show only that row, no highlights
    if (selectedNotificationId) {
      const pinned = source.filter((r) => r.id === selectedNotificationId);
      const base = pinned[0]?.messageName ?? 'Selected notification';
      return {
        displayRows: pinned,
        totalAfterFilters: source.length,
        highlightedIds: new Set<string>(),
        emptyReason: (pinned.length === 0 ? 'no-results' : null) as EmptyReason,
        workspaceTitle: mainTab === 'resolved' ? `Resolved — ${base}` : base,
      };
    }

    // Sidebar selection + optional supervisor match scope
    const afterMatchScope =
      focusedMatchId !== null ? source.filter((r) => r.matchId === focusedMatchId) : source;

    const matched = filterRowsBySelection(effectiveSelectedId, afterMatchScope);
    const ids = new Set(matched.map((r) => r.id));
    const poolEmpty = source.length === 0;
    const scopedEmpty = afterMatchScope.length === 0;
    const empty: EmptyReason = poolEmpty || scopedEmpty ? 'no-results' : null;

    let baseTitle: string;
    if (effectiveSelectedId !== undefined) {
      baseTitle = selectionTitle(
        effectiveSelectedId,
        matched[0] ?? afterMatchScope[0] ?? source[0],
      );
    } else if (focusedMatchId !== null) {
      baseTitle = `${afterMatchScope[0]?.matchLabel ?? focusedMatchId} · all issues`;
    } else {
      baseTitle = 'All notifications';
    }

    return {
      displayRows: afterMatchScope,
      totalAfterFilters: source.length,
      highlightedIds: ids,
      emptyReason: empty,
      workspaceTitle: mainTab === 'resolved' ? `Resolved — ${baseTitle}` : baseTitle,
    };
  }, [
    selectedNotificationId,
    effectiveSelectedId,
    filteredPending,
    filteredResolved,
    mainTab,
    focusedMatchId,
  ]);

  const focusedMatchLabel = useMemo(() => {
    if (!focusedMatchId) return '';
    const row =
      filteredPending.find((r) => r.matchId === focusedMatchId) ??
      filteredResolved.find((r) => r.matchId === focusedMatchId);
    return row?.matchLabel ?? focusedMatchId;
  }, [focusedMatchId, filteredPending, filteredResolved]);

  const pendingCount = rolePending.length;
  const resolvedCount = roleResolved.length;

  const supervisorOperatorContext = useMemo(() => {
    if (role !== 'supervisor' || !selectedOperatorId) return null;
    const op = operatorById(selectedOperatorId);
    if (!op) return null;
    const resolvedByOp = resolved.filter((r) => r.resolvedByOperatorId === selectedOperatorId);
    const completedFiltered = applyFilters(resolvedByOp, filters);
    const working = filteredPending;
    const maxShow = 6;
    return {
      op,
      completedCount: completedFiltered.length,
      activeCount: working.length,
      activePreview: working.slice(0, maxShow).map((r) => ({
        id: r.id,
        line: `${r.matchLabel} — ${r.messageName}`,
      })),
      moreActive: Math.max(0, working.length - maxShow),
    };
  }, [role, selectedOperatorId, resolved, filters, filteredPending]);

  return (
    <PdsBox direction="column" stretchHorizontal surface="on-light" style={{ minHeight: '100vh' }}>
      <PdsToast
        containerId={TOAST_CONTAINER_ID}
        position="top-right"
        autoClose={3200}
        color="success"
        surface="on-light"
        dismissible
        fixedWidth="360px"
      />

      {/* ── Header ── */}
      <PdsBox
        padding="md"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap="md"
        stretchHorizontal
        border
        surface="on-light"
      >
        <PdsBox direction="row" alignItems="center" gap="md">
          <PdsBox
            fixedWidth="40px"
            fixedHeight="40px"
            border
            borderRadius="sm"
            surface="on-light"
            aria-hidden
          />
          <PdsBox direction="column" gap="xs">
            <PdsMantineText type="interface" fontSize="700" fontWeight="strong" surface="on-light">
              Notifications Overview
            </PdsMantineText>
            <PdsMantineText type="interface" fontSize="500" surface="on-light">
              Sports data management (prototype)
            </PdsMantineText>
          </PdsBox>
        </PdsBox>
        <PdsBox direction="row" alignItems="center" gap="sm" wrap="wrap">
          <PdsMantineButton rank="ghost" color="neutral" surface="on-light" size="sm">
            Applications
          </PdsMantineButton>
          <PdsMantineButton rank="ghost" color="neutral" surface="on-light" size="sm">
            Configuration
          </PdsMantineButton>
          {/* Role toggle — replaces the static "r.operator (Operator)" text */}
          {/* Role + Office — timeline dock has no duplicate controls */}
          <PdsToggleButtonGroup
            value={role}
            onChange={handleRoleChange}
            size="sm"
            color="neutral"
            surface="on-light"
          >
            <PdsToggleButton value="operator">Operator</PdsToggleButton>
            <PdsToggleButton value="supervisor">Supervisor</PdsToggleButton>
          </PdsToggleButtonGroup>
          <PdsBox fixedWidth="200px">
            <PdsMantineMultiselect
              key={`office-${filters.cityOffice ?? ALL_OFFICES_VALUE}`}
              label="Office"
              labelSize="sm"
              size="sm"
              surface="on-light"
              opaqueBackground
              data={cityOfficeSelectData}
              predValue={
                filters.cityOffice === FILTER_OPTION_ALL || !filters.cityOffice
                  ? null
                  : filters.cityOffice
              }
              placeholder="All city offices"
              maxDisplayValues={1}
              clearable
              onClear={() =>
                setFilters((f) => ({
                  ...f,
                  cityOffice: FILTER_OPTION_ALL,
                }))
              }
              onSelect={(opt) =>
                setFilters((f) => ({
                  ...f,
                  cityOffice:
                    opt.value === ALL_OFFICES_VALUE ? FILTER_OPTION_ALL : (opt.value as CityOfficeId),
                }))
              }
            />
          </PdsBox>
        </PdsBox>
      </PdsBox>

      {/* ── Tab bar ── */}
      <PdsBox padding="md" topPadding="sm" stretchHorizontal surface="on-light">
        <PdsTabGroup
          key={mainTab}
          preSelectedTabValue={mainTab}
          onSelect={(v) => setMainTab(v as MainTab)}
          surface="on-light"
          color="neutral"
          size="md"
        >
          <PdsTab value="pending" contentID="tab-pending">
            Pending ({pendingCount})
          </PdsTab>
          <PdsTab value="resolved" contentID="tab-resolved">
            Resolved ({resolvedCount})
          </PdsTab>
        </PdsTabGroup>
      </PdsBox>

      <NotificationsFilters value={filters} onChange={setFilters} onClearAll={handleClearAll} />

      {/* ── Priority band toggle ── */}
      <PdsBox padding="md" direction="column" gap="sm" stretchHorizontal surface="on-light">
        <PdsMantineText type="interface" fontSize="600" fontWeight="strong" surface="on-light">
          Priority
        </PdsMantineText>
        <PdsToggleButtonGroup
          value={filters.priorityBand}
          onChange={handlePriorityBand}
          size="sm"
          color="neutral"
          surface="on-light"
        >
          <PdsToggleButton
            value="high"
            trailingIcon={
              <PdsMantineBadge
                color="warning"
                surface="on-light"
                variant="light"
                value={priorityBandCounts.high}
              />
            }
          >
            High priority
          </PdsToggleButton>
          <PdsToggleButton
            value="low"
            trailingIcon={
              <PdsMantineBadge
                color="attention"
                surface="on-light"
                variant="light"
                value={priorityBandCounts.low}
              />
            }
          >
            Low priority
          </PdsToggleButton>
          <PdsToggleButton
            value="all"
            trailingIcon={
              <PdsMantineBadge
                color="warning"
                surface="on-light"
                variant="light"
                value={priorityBandCounts.high}
              />
            }
          >
            All
          </PdsToggleButton>
        </PdsToggleButtonGroup>
      </PdsBox>

      {supervisorOperatorContext && (
        <PdsBox
          padding="md"
          direction="column"
          gap="sm"
          stretchHorizontal
          surface="on-light"
          style={{ borderBottom: '1px solid #e5e7eb', background: '#f8fafc' }}
        >
          <PdsBox direction="row" alignItems="center" gap="sm" wrap="wrap" style={{ minWidth: 0 }}>
            <PdsMantineButton rank="subtle" color="neutral" surface="on-light" size="sm" onClick={handleExitOperatorDrill}>
              Back to all operators
            </PdsMantineButton>
            <PdsMantineText type="interface" fontSize="700" fontWeight="strong" surface="on-light">
              {supervisorOperatorContext.op.displayName}
            </PdsMantineText>
            <PdsMantineText type="interface" fontSize="500" surface="on-light" style={{ opacity: 0.92 }}>
              {supervisorOperatorContext.completedCount} completed · {supervisorOperatorContext.activeCount} active now
            </PdsMantineText>
          </PdsBox>
          <PdsMantineText type="interface" fontSize="600" fontWeight="strong" surface="on-light">
            Working on now
          </PdsMantineText>
          {supervisorOperatorContext.activeCount === 0 ? (
            <PdsMantineText type="interface" fontSize="500" surface="on-light" style={{ opacity: 0.8 }}>
              No pending tickets match the current filters for this operator.
            </PdsMantineText>
          ) : (
            <PdsBox direction="column" gap="xs" style={{ maxWidth: 'min(920px, 100%)' }}>
              {supervisorOperatorContext.activePreview.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  style={{
                    textAlign: 'left',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    padding: '10px 12px',
                    cursor: 'pointer',
                    font: 'inherit',
                  }}
                  onClick={() => handleTimelineNotificationSelect(item.id)}
                >
                  <PdsMantineText type="interface" fontSize="500" surface="on-light">
                    {item.line}
                  </PdsMantineText>
                </button>
              ))}
              {supervisorOperatorContext.moreActive > 0 && (
                <PdsMantineText type="interface" fontSize="400" surface="on-light" style={{ opacity: 0.85 }}>
                  +{supervisorOperatorContext.moreActive} more in queue
                </PdsMantineText>
              )}
            </PdsBox>
          )}
          <PdsMantineText type="interface" fontSize="400" surface="on-light" style={{ opacity: 0.75 }}>
            Completed = tickets resolved by this operator within the filters above (days back, sport, office, etc.).
          </PdsMantineText>
        </PdsBox>
      )}

      {/* ── Workspace: sidebar + table column ── */}
      <PdsBox
        direction="column"
        stretchHorizontal
        surface="on-light"
        style={{ flex: 1, minHeight: 0 }}
      >
        {focusedMatchId && !selectedNotificationId && (
          <PdsBox
            padding="sm"
            direction="row"
            alignItems="center"
            gap="sm"
            surface="on-light"
            style={{ borderBottom: '1px solid #e5e7eb', background: '#eff6ff' }}
          >
            <PdsBox direction="row" alignItems="center" gap="xs" wrap="wrap">
              <PdsMantineText type="interface" fontSize="500" surface="on-light">
                Table scoped to match:
              </PdsMantineText>
              <PdsMantineText type="interface" fontSize="600" fontWeight="strong" surface="on-light">
                {focusedMatchLabel}
              </PdsMantineText>
            </PdsBox>
            <PdsMantineButton
              rank="ghost"
              color="neutral"
              surface="on-light"
              size="xs"
              onClick={() => handleDockFocusMatch(null)}
            >
              Clear match filter
            </PdsMantineButton>
          </PdsBox>
        )}
        {/* Timeline selection hint */}
        {selectedNotificationId && (
          <PdsBox
            padding="sm"
            direction="row"
            alignItems="center"
            gap="sm"
            surface="on-light"
            style={{ borderBottom: '1px solid #e5e7eb' }}
          >
            <PdsMantineText type="interface" fontSize="500" surface="on-light">
              Showing 1 notification selected from timeline
            </PdsMantineText>
            <PdsMantineButton
              rank="ghost"
              color="neutral"
              surface="on-light"
              size="xs"
              onClick={() => handleTimelineNotificationSelect(null)}
            >
              Clear
            </PdsMantineButton>
          </PdsBox>
        )}

        <PdsBox
          direction="row"
          stretchHorizontal
          surface="on-light"
          style={{ flex: 1, minHeight: 0, alignItems: 'stretch' }}
        >
          {/* Sidebar — widened to min(432px, 41vw) */}
          <PdsBox
            surface="on-light"
            border
            style={{
              width: 'min(432px, 41vw)',
              flexShrink: 0,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <NotificationsSidebar
              groupBy={groupBy}
              onGroupByChange={handleGroupByChange}
              filteredPending={filteredPending}
              selectedId={effectiveSelectedId}
              onSelect={handleSidebarSelect}
              priorityBand={filters.priorityBand}
            />
          </PdsBox>

          {/* Table */}
          <PdsBox flex="1" surface="on-light" style={{ minWidth: 0, minHeight: 0, display: 'flex' }}>
            <NotificationsTable
              variant={mainTab === 'pending' ? 'pending' : 'resolved'}
              title={workspaceTitle}
              displayRows={displayRows}
              totalAfterFilters={totalAfterFilters}
              highlightedIds={highlightedIds}
              emptyReason={emptyReason}
              onClearFilters={handleClearAll}
              onResolve={role === 'operator' && mainTab === 'pending' ? handleResolve : () => {}}
              resolvingId={mainTab === 'pending' ? resolvingId : null}
              canResolve={role === 'operator'}
              selectedNotificationId={selectedNotificationId}
            />
          </PdsBox>
        </PdsBox>

        {/* ── Timeline dock — both roles (async chunk: D3 + dock UI) ── */}
        <Suspense
          fallback={
            <PdsBox
              surface="on-dark"
              direction="column"
              stretchHorizontal
              aria-busy
              style={{
                flexShrink: 0,
                height: 448,
                overflow: 'hidden',
                borderTop: '1px solid #334155',
                background: '#020617',
              }}
            />
          }
        >
          <LazyNotificationsTimelineDock
            role={role}
            filteredPending={filteredPending}
            filteredResolved={filteredResolved}
            selectedOperatorId={selectedOperatorId}
            onSelectOperator={setSelectedOperatorId}
            selectedNotificationId={selectedNotificationId}
            onSelectNotification={handleTimelineNotificationSelect}
            nowMs={nowMs}
            isLive={isLive}
            reducedMotion={!!reducedMotion}
            focusedMatchId={focusedMatchId}
            onFocusMatch={handleDockFocusMatch}
          />
        </Suspense>
      </PdsBox>
    </PdsBox>
  );
}
