import { useMemo, useState } from 'react';
import { LOFIButton, LOFINavTree, LOFIText } from 'lofi-kit';
import {
  DEFAULT_EXPANDED_IDS,
  DEFAULT_STORYBOOK_SELECTED_ID,
  STORYBOOK_NAV,
  ancestorIds,
  findNodeById,
  findNodeByPath,
  toNavTreeItems,
} from './storybookNav';

interface HubStorybookNavProps {
  storybookPath: string;
  onStorybookPathChange: (path: string) => void;
  onLeaveStorybook: () => void;
}

export function HubStorybookNav({
  storybookPath,
  onStorybookPathChange,
  onLeaveStorybook,
}: HubStorybookNavProps) {
  const selectedFromPath = findNodeByPath(STORYBOOK_NAV, storybookPath);
  const selectedId = selectedFromPath?.id ?? DEFAULT_STORYBOOK_SELECTED_ID;
  const items = useMemo(() => toNavTreeItems(STORYBOOK_NAV), []);
  const [expandedIds, setExpandedIds] = useState(() =>
    uniqueIds([...DEFAULT_EXPANDED_IDS, ...ancestorIds(STORYBOOK_NAV, selectedId)]),
  );

  function onSelect(id: string) {
    const node = findNodeById(STORYBOOK_NAV, id);
    if (!node) return;
    setExpandedIds((current) => uniqueIds([...current, ...ancestorIds(STORYBOOK_NAV, id), id]));
    if (node.path) {
      onStorybookPathChange(node.path);
    }
  }

  return (
    <div className="hub-sidebar__storybook">
      <nav className="hub-sidebar__breadcrumb" aria-label="AI Showcase breadcrumb">
        <LOFIButton
          variant="dismiss"
          size="compact"
          className="hub-sidebar__crumb"
          onClick={onLeaveStorybook}
        >
          AI Showcase
        </LOFIButton>
        <LOFIText as="span" variant="muted" className="hub-sidebar__crumb-sep">
          /
        </LOFIText>
        <LOFIText as="span" variant="strong" className="hub-sidebar__crumb-current">
          SketchFlowAI
        </LOFIText>
      </nav>

      <LOFINavTree
        className="hub-sidebar__tree"
        items={items}
        selectedId={selectedId}
        expandedIds={expandedIds}
        onExpandChange={setExpandedIds}
        onSelect={onSelect}
      />
    </div>
  );
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)];
}
