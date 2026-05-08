import { useMemo } from 'react';
import {
  PdsBox,
  PdsMantineAccordion,
  PdsMantineAccordionControl,
  PdsMantineAccordionItem,
  PdsMantineAccordionPanel,
  PdsMantineBadge,
  PdsMantineButton,
  PdsMantineText,
  PdsToggleButton,
  PdsToggleButtonGroup,
} from '@podium-design-system/react-components';
import { Group, Stack } from '@mantine/core';
import type { GroupByMode, NotificationRow, PriorityBand, Sport } from '../../types';
import { buildNavTreeForMode, type NavTreeItem } from '../../lib/sidebarTree';
import { SportIcon } from '../../lib/sportIcon';

export interface NotificationsSidebarProps {
  groupBy: GroupByMode;
  onGroupByChange: (mode: GroupByMode) => void;
  filteredPending: NotificationRow[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
  priorityBand: PriorityBand;
}

/** L-shape SVG connector rendered before child rows in the tree. */
function HierarchyArrow() {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d="M4 0 L4 12 L16 12" stroke="#999" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function NotificationsSidebar({
  groupBy,
  onGroupByChange,
  filteredPending,
  selectedId,
  onSelect,
  priorityBand,
}: NotificationsSidebarProps) {
  const treeItems = useMemo((): NavTreeItem[] => {
    return buildNavTreeForMode(groupBy, filteredPending);
  }, [filteredPending, groupBy]);

  const branchIds = useMemo(() => treeItems.map((b) => b.id), [treeItems]);
  const accordionKey = `${groupBy}:${branchIds.join(',')}`;

  return (
    <PdsBox
      padding="md"
      direction="column"
      gap="md"
      stretchHorizontal
      style={{ minHeight: 0, alignSelf: 'stretch', overflow: 'auto' }}
    >
      <PdsBox direction="column" gap="xs">
        <PdsMantineText type="interface" fontSize="500" fontWeight="strong" surface="on-light">
          Group by:
        </PdsMantineText>
        <PdsToggleButtonGroup
          value={groupBy}
          onChange={(v) => onGroupByChange(v as GroupByMode)}
          size="sm"
          color="neutral"
          surface="on-light"
        >
          <PdsToggleButton value="message-type">Message type</PdsToggleButton>
          <PdsToggleButton value="match">Match</PdsToggleButton>
        </PdsToggleButtonGroup>
      </PdsBox>

      {treeItems.length === 0 ? (
        <PdsMantineText type="interface" fontSize="600" surface="on-light">
          No pending groups match the current filters.
        </PdsMantineText>
      ) : (
        <PdsMantineAccordion
          key={accordionKey}
          multiple
          defaultValue={branchIds}
          variant="contained"
          surface="on-light"
          color="neutral"
          style={{ flex: 1, minHeight: 0 }}
        >
          {treeItems.map((branch) => (
            <PdsMantineAccordionItem key={branch.id} value={branch.id}>
              <PdsMantineAccordionControl>
                <Group gap="xs" wrap="nowrap" align="center">
                  {branch.sport && <SportIcon sport={branch.sport as Sport} size="sm" />}
                  <PdsMantineText
                    type="interface"
                    fontSize="600"
                    fontWeight="strong"
                    surface="on-light"
                  >
                    {branch.label}
                  </PdsMantineText>
                </Group>
              </PdsMantineAccordionControl>
              <PdsMantineAccordionPanel>
                <Stack gap="xs" pt="xs">
                  {branch.children?.map((leaf) => (
                    <Group key={leaf.id} gap={0} wrap="nowrap" align="center">
                      <HierarchyArrow />
                      <PdsMantineButton
                        fullWidth
                        justify="flex-start"
                        rank={selectedId === leaf.id ? 'subtle' : 'ghost'}
                        color="neutral"
                        surface="on-light"
                        size="sm"
                        title={leaf.label}
                        styles={{
                          inner: {
                            overflow: 'hidden',
                            justifyContent: 'flex-start',
                            minWidth: 0,
                          },
                          label: {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            minWidth: 0,
                            textAlign: 'left',
                          },
                        }}
                        onClick={() => onSelect(leaf.id)}
                        leadingIcon={leaf.sport ? <SportIcon sport={leaf.sport as Sport} size="sm" /> : undefined}
                        trailingIcon={
                          leaf.leafBandCounts ? (
                            <Group gap={4} wrap="nowrap" justify="flex-end">
                              {(priorityBand === 'high' || priorityBand === 'all') &&
                              leaf.leafBandCounts.high > 0 ? (
                                <PdsMantineBadge
                                  color="warning"
                                  surface="on-light"
                                  variant="light"
                                  size="sm"
                                  value={leaf.leafBandCounts.high}
                                />
                              ) : null}
                              {(priorityBand === 'low' || priorityBand === 'all') &&
                              leaf.leafBandCounts.low > 0 ? (
                                <PdsMantineBadge
                                  color="attention"
                                  surface="on-light"
                                  variant="light"
                                  size="sm"
                                  value={leaf.leafBandCounts.low}
                                />
                              ) : null}
                            </Group>
                          ) : undefined
                        }
                      >
                        {leaf.label}
                      </PdsMantineButton>
                    </Group>
                  ))}
                </Stack>
              </PdsMantineAccordionPanel>
            </PdsMantineAccordionItem>
          ))}
        </PdsMantineAccordion>
      )}
    </PdsBox>
  );
}
