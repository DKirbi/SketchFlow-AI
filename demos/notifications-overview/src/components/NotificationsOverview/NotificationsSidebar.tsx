import { useMemo } from 'react';
import { LOFIButton, LOFINavTree, LOFIText, LOFIToggle, type NavTreeItem } from 'lofi-kit';
import type { GroupByMode, NotificationRow } from '../../types';
import { buildNavTreeForMode } from '../../lib/sidebarTree';
import { BUCKET_BETTING_ID } from '../../constants';
import './NotificationsOverview.scss';

export interface NotificationsSidebarProps {
  groupBy: GroupByMode;
  onGroupByChange: (mode: GroupByMode) => void;
  filteredPending: NotificationRow[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}

export function NotificationsSidebar({
  groupBy,
  onGroupByChange,
  filteredPending,
  selectedId,
  onSelect,
}: NotificationsSidebarProps) {
  const bettingRows = useMemo(
    () => filteredPending.filter((r) => r.dataset === 'BETTING'),
    [filteredPending],
  );
  const bettingCount = bettingRows.length;

  const treeItems = useMemo((): NavTreeItem[] => {
    return buildNavTreeForMode(groupBy, filteredPending);
  }, [filteredPending, groupBy]);

  return (
    <aside className="notifications-overview__sidebar" aria-label="Notification groups">
      <LOFIText as="p" variant="caps" className="notifications-overview__sidebar-heading">
        Sidebar
      </LOFIText>

      <div className="notifications-overview__group-toggle">
        <LOFIText as="span" variant="sm" className="notifications-overview__group-toggle-label">
          Group by
        </LOFIText>
        <LOFIToggle
          ariaLabel="Group notifications by"
          value={groupBy}
          onChange={(v) => onGroupByChange(v as GroupByMode)}
          options={[
            { value: 'message-type', label: 'Message type' },
            { value: 'match', label: 'Match' },
          ]}
        />
      </div>

      <div className="notifications-overview__bucket-wrap">
        <LOFIButton
          type="button"
          variant={selectedId === BUCKET_BETTING_ID ? 'primary' : 'default'}
          className="notifications-overview__bucket"
          onClick={() => onSelect(BUCKET_BETTING_ID)}
        >
          Betting — solve immediately ({bettingCount})
        </LOFIButton>
      </div>

      <LOFINavTree
        className="notifications-overview__nav-tree"
        items={treeItems}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </aside>
  );
}
