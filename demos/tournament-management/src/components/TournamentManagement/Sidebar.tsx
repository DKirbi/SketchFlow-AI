import { LOFIButton, LOFINavTree, LOFIText } from 'lofi-kit';
import type { NavTreeItem } from 'lofi-kit';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  items: NavTreeItem[];
  expandedIds?: string[];
  onExpandChange?: (ids: string[]) => void;
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  items,
  expandedIds,
  onExpandChange,
  selectedId,
  onSelect,
}: SidebarProps) {
  if (collapsed) {
    return (
      <aside className="tmgmt__sidebar tmgmt__sidebar--collapsed" aria-label="Tournament tree">
        <LOFIButton type="button" variant="dismiss" size="compact" onClick={onToggleCollapse}>
          ▶
        </LOFIButton>
      </aside>
    );
  }

  return (
    <aside className="tmgmt__sidebar" aria-label="Tournament tree">
      <div className="tmgmt__sidebar-head">
        <LOFIText variant="caps" className="tmgmt__sidebar-title">
          Tournaments
        </LOFIText>
        <LOFIButton type="button" variant="dismiss" size="compact" onClick={onToggleCollapse}>
          ◀
        </LOFIButton>
      </div>
      {items.length === 0 ? (
        <LOFIText variant="description" className="tmgmt__sidebar-empty">
          No rows match the current filters. Clear all or run a broader Search.
        </LOFIText>
      ) : (
        <LOFINavTree
          className="tmgmt__nav-tree"
          items={items}
          selectedId={selectedId}
          onSelect={onSelect}
          expandedIds={expandedIds}
          onExpandChange={onExpandChange}
        />
      )}
    </aside>
  );
}
