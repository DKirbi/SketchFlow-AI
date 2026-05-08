import { useCallback, useMemo, useState } from 'react';
import { LOFIButton, LOFITabs, LOFIText, LOFIToggle, LOFIToast, LOFIToolbar } from 'lofi-kit';
import { BUCKET_BETTING_ID, FILTER_OPTION_ALL } from '../../constants';
import { SEED_NOTIFICATIONS } from '../../data/notifications';
import type {
  DatasetScope,
  GroupByMode,
  MainTab,
  NotificationFilters,
  NotificationRow,
} from '../../types';
import { applyFilters } from '../../lib/applyFilters';
import { filterRowsBySelection, selectionTitle } from '../../lib/selection';
import { NotificationsFilters } from './NotificationsFilters';
import { NotificationsSidebar } from './NotificationsSidebar';
import { NotificationsTable, type EmptyReason } from './NotificationsTable';
import './NotificationsOverview.scss';

const defaultFilters: NotificationFilters = {
  daysBack: '7',
  sport: FILTER_OPTION_ALL,
  lsLevel: FILTER_OPTION_ALL,
  issueType: FILTER_OPTION_ALL,
  datasetScope: 'all',
};

export function NotificationsOverview() {
  const [pending, setPending] = useState<NotificationRow[]>(SEED_NOTIFICATIONS);
  const [resolved, setResolved] = useState<NotificationRow[]>([]);
  const [mainTab, setMainTab] = useState<MainTab>('pending');
  const [filters, setFilters] = useState<NotificationFilters>(defaultFilters);
  const [groupBy, setGroupBy] = useState<GroupByMode>('message-type');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredPending = useMemo(() => applyFilters(pending, filters), [pending, filters]);

  const filteredResolved = useMemo(() => applyFilters(resolved, filters), [resolved, filters]);

  /** Selection is only “active” if the current tab’s filtered data still has matching rows. */
  const effectiveSelectedId = useMemo(() => {
    if (selectedId === undefined) return undefined;
    const source = mainTab === 'pending' ? filteredPending : filteredResolved;
    if (selectedId === BUCKET_BETTING_ID) {
      return source.some((r) => r.dataset === 'BETTING') ? selectedId : undefined;
    }
    return filterRowsBySelection(selectedId, source).length > 0 ? selectedId : undefined;
  }, [selectedId, filteredPending, filteredResolved, mainTab]);

  const handleClearAll = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDatasetScope = useCallback((value: string) => {
    setFilters((f) => ({
      ...f,
      datasetScope: value as DatasetScope,
    }));
  }, []);

  const handleGroupByChange = useCallback((mode: GroupByMode) => {
    setGroupBy(mode);
    setSelectedId(undefined);
  }, []);

  const handleResolve = useCallback((id: string) => {
    setResolvingId(id);
    const delay = 500 + Math.random() * 1000;
    window.setTimeout(() => {
      setPending((p) => {
        const row = p.find((x) => x.id === id);
        if (!row) return p;
        const stamped: NotificationRow = {
          ...row,
          resolvedAt: new Date().toISOString(),
        };
        setResolved((prev) => [stamped, ...prev]);
        return p.filter((x) => x.id !== id);
      });
      setResolvingId(null);
      setToastMessage('Notification resolved');
    }, delay);
  }, []);

  const { displayRows, totalAfterFilters, emptyReason, workspaceTitle } = useMemo(() => {
    const source = mainTab === 'pending' ? filteredPending : filteredResolved;
    const totalAfter = source.length;
    const rows = filterRowsBySelection(effectiveSelectedId, source);
    let empty: EmptyReason = null;
    if (effectiveSelectedId === undefined) {
      empty = 'no-selection';
    } else if (rows.length === 0) {
      empty = 'no-results';
    }
    const base = selectionTitle(effectiveSelectedId, rows[0]);
    const title = mainTab === 'resolved' ? `Resolved — ${base}` : base;
    return {
      displayRows: rows,
      totalAfterFilters: totalAfter,
      emptyReason: empty,
      workspaceTitle: title,
    };
  }, [effectiveSelectedId, filteredPending, filteredResolved, mainTab]);

  const pendingCount = pending.length;
  const resolvedCount = resolved.length;

  return (
    <div className="notifications-overview">
      <LOFIToolbar
        className="notifications-overview__upl-toolbar"
        left={
          <div className="notifications-overview__upl-left">
            <div className="notifications-overview__logo-placeholder" aria-hidden />
            <div className="notifications-overview__upl-titles">
              <LOFIText as="span" variant="body">
                Notifications Overview
              </LOFIText>
              <LOFIText as="span" variant="muted">
                Sports data management (prototype)
              </LOFIText>
            </div>
          </div>
        }
        right={
          <div className="notifications-overview__upl-right">
            <LOFIButton type="button" variant="dismiss" size="compact">
              Applications
            </LOFIButton>
            <LOFIButton type="button" variant="dismiss" size="compact">
              Configuration
            </LOFIButton>
            <LOFIText as="span" variant="micro">
              r.operator (Operator) — prototype role
            </LOFIText>
          </div>
        }
      />

      <div className="notifications-overview__tabs-wrap">
        <LOFITabs
          ariaLabel="Queue"
          value={mainTab}
          onChange={(v) => setMainTab(v as MainTab)}
          tabs={[
            { value: 'pending', label: 'Pending', badge: String(pendingCount) },
            { value: 'resolved', label: 'Resolved', badge: String(resolvedCount) },
          ]}
        />
      </div>

      <NotificationsFilters value={filters} onChange={setFilters} onClearAll={handleClearAll} />

      <div className="notifications-overview__dataset-scope">
        <LOFIText as="span" variant="sm" className="notifications-overview__dataset-label">
          Dataset
        </LOFIText>
        <LOFIToggle
          ariaLabel="Dataset scope filter"
          value={filters.datasetScope}
          onChange={handleDatasetScope}
          options={[
            { value: 'betting', label: 'Betting' },
            { value: 'media', label: 'Media' },
            { value: 'all', label: 'All' },
          ]}
        />
      </div>

      <div className="notifications-overview__workspace">
        <NotificationsSidebar
          groupBy={groupBy}
          onGroupByChange={handleGroupByChange}
          filteredPending={filteredPending}
          selectedId={effectiveSelectedId}
          onSelect={setSelectedId}
        />

        <div className="notifications-overview__main">
          <NotificationsTable
            variant={mainTab === 'pending' ? 'pending' : 'resolved'}
            title={workspaceTitle}
            displayRows={displayRows}
            totalAfterFilters={totalAfterFilters}
            emptyReason={emptyReason}
            onClearFilters={handleClearAll}
            onResolve={mainTab === 'pending' ? handleResolve : () => {}}
            resolvingId={mainTab === 'pending' ? resolvingId : null}
          />
        </div>
      </div>

      {toastMessage && (
        <LOFIToast
          className="notifications-overview__toast"
          severity="success"
          message={toastMessage}
          autoDismiss={3200}
          onDismiss={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
