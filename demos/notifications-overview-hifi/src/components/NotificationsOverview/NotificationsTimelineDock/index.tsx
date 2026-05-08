import { Group } from '@mantine/core';
import {
  PdsBox,
  PdsMantineButton,
  PdsMantineIconButton,
  PdsMantineText,
} from '@podium-design-system/react-components';
import { PdsChevronDownSmIcon, PdsChevronUpSmIcon } from '@podium-design-system/react-components/icons.js';
import { useMemo, useState } from 'react';

import { operatorById } from '../../../data/operators';
import type { OperatorId, Role } from '../../../types';
import { OperationalTimeline } from './OperationalTimeline';
import { OperationsSummary } from './OperationsSummary';
import type { Severity } from './severity';
import { priorityToSeverity } from './severity';
import type { NotificationsTimelineDockProps } from './types';

export type { NotificationsTimelineDockProps } from './types';

const COLLAPSED_HEIGHT = 44;
const EXPANDED_HEIGHT = 448;

export function NotificationsTimelineDock({
  role,
  filteredPending,
  filteredResolved,
  selectedOperatorId,
  onSelectOperator,
  selectedNotificationId,
  onSelectNotification,
  nowMs,
  isLive,
  reducedMotion,
  focusedMatchId,
  onFocusMatch,
}: NotificationsTimelineDockProps) {
  const [expanded, setExpanded] = useState(true);
  const [laneFilter, setLaneFilter] = useState<Severity | null>(null);

  const counts = useMemo(() => {
    let critical = 0;
    let major = 0;
    let minor = 0;
    for (const r of filteredPending) {
      if (r.resolvedAt) continue;
      const s = priorityToSeverity(r.priority);
      if (s === 'critical') critical++;
      else if (s === 'major') major++;
      else minor++;
    }
    return { critical, major, minor };
  }, [filteredPending]);

  const liveLabel = useMemo(() => {
    const d = new Date(nowMs);
    const clock = d.toLocaleTimeString(undefined, {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    return isLive ? `LIVE · ${clock}` : `Reduced motion · ${clock}`;
  }, [nowMs, isLive]);

  const selectedDockIssue = useMemo(() => {
    if (!selectedNotificationId) return null;
    const row =
      filteredPending.find((r) => r.id === selectedNotificationId) ??
      filteredResolved.find((r) => r.id === selectedNotificationId) ??
      null;
    return row
      ? { matchLabel: row.matchLabel, messageName: row.messageName }
      : { missing: true as const };
  }, [selectedNotificationId, filteredPending, filteredResolved]);

  const opLabel =
    role === 'supervisor' && selectedOperatorId ? operatorById(selectedOperatorId)?.displayName : null;

  return (
    <PdsBox
      surface="on-dark"
      direction="column"
      stretchHorizontal
      style={{
        flexShrink: 0,
        height: expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
        transition: reducedMotion ? undefined : 'height 220ms ease',
        overflow: 'hidden',
        borderTop: '1px solid #334155',
        background: '#020617',
      }}
    >
      <PdsBox
        padding="sm"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        stretchHorizontal
        surface="on-dark"
        style={{
          flexShrink: 0,
          minHeight: COLLAPSED_HEIGHT,
          borderBottom: expanded ? '1px solid #334155' : 'none',
        }}
      >
        <Group gap="sm" wrap="nowrap" align="center" style={{ flex: 1, minWidth: 0 }}>
          <PdsMantineText type="interface" fontSize="600" fontWeight="strong" surface="on-dark">
            Operational timeline
          </PdsMantineText>
          <PdsBox
            direction="row"
            gap="xs"
            alignItems="center"
            padding="xs"
            surface="on-dark"
            style={{
              borderRadius: 999,
              border: '1px solid #334155',
              background: '#1e293b',
            }}
            aria-live="polite"
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isLive ? '#22c55e' : '#64748b',
                boxShadow: isLive ? '0 0 8px rgba(34,197,94,0.75)' : undefined,
              }}
              aria-hidden
            />
            <PdsMantineText type="interface" fontSize="400" surface="on-dark">
              {liveLabel}
            </PdsMantineText>
          </PdsBox>
          {selectedNotificationId && selectedDockIssue && (
            <>
              <span
                style={{
                  width: 1,
                  alignSelf: expanded ? 'stretch' : 'center',
                  minHeight: expanded ? 28 : 16,
                  background: '#475569',
                  flexShrink: 0,
                }}
                aria-hidden
              />
              {selectedDockIssue.missing ? (
                <PdsMantineText type="interface" fontSize="400" surface="on-dark" style={{ opacity: 0.75 }}>
                  Issue not in current filters
                </PdsMantineText>
              ) : expanded ? (
                <PdsBox direction="column" gap="xs" style={{ minWidth: 0, flex: '1 1 200px', maxWidth: 520 }}>
                  <PdsMantineText
                    type="interface"
                    fontSize="600"
                    fontWeight="strong"
                    surface="on-dark"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.25,
                    }}
                    title={selectedDockIssue.matchLabel}
                  >
                    {selectedDockIssue.matchLabel}
                  </PdsMantineText>
                  <PdsMantineText
                    type="interface"
                    fontSize="500"
                    surface="on-dark"
                    style={{
                      opacity: 0.92,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.25,
                    }}
                    title={selectedDockIssue.messageName}
                  >
                    {selectedDockIssue.messageName}
                  </PdsMantineText>
                </PdsBox>
              ) : (
                <PdsMantineText
                  type="interface"
                  fontSize="400"
                  surface="on-dark"
                  style={{
                    minWidth: 0,
                    flex: '1 1 120px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={`${selectedDockIssue.matchLabel} — ${selectedDockIssue.messageName}`}
                >
                  {selectedDockIssue.matchLabel} — {selectedDockIssue.messageName}
                </PdsMantineText>
              )}
            </>
          )}
          {role === 'supervisor' && selectedOperatorId ? (
            <Group gap={6} wrap="nowrap">
              <PdsMantineButton
                rank="outline"
                color="neutral"
                surface="on-dark"
                size="xs"
                onClick={() => onSelectOperator(null)}
              >
                Back to all operators
              </PdsMantineButton>
              <PdsMantineText type="interface" fontSize="400" surface="on-dark" style={{ opacity: 0.9 }}>
                {opLabel ?? 'Operator drill-in'}
              </PdsMantineText>
            </Group>
          ) : null}
          {!expanded && (
            <PdsMantineText
              type="interface"
              fontSize="400"
              surface="on-dark"
              style={{ opacity: 0.92 }}
              aria-label={`${counts.critical} critical, ${counts.major} major, ${counts.minor} minor pending`}
            >
              {counts.critical} Critical · {counts.major} Major · {counts.minor} Minor
              {laneFilter ? ` · Lane: ${laneFilter}` : ''}
            </PdsMantineText>
          )}
          {expanded && selectedNotificationId && (
            <PdsMantineButton
              rank="ghost"
              color="neutral"
              surface="on-dark"
              size="xs"
              onClick={() => onSelectNotification(null)}
            >
              Clear selection
            </PdsMantineButton>
          )}
        </Group>

        <PdsMantineIconButton
          rank="ghost"
          color="neutral"
          surface="on-dark"
          size="xs"
          icon={expanded ? <PdsChevronDownSmIcon size="xs" /> : <PdsChevronUpSmIcon size="xs" />}
          aria-label={expanded ? 'Collapse operational timeline' : 'Expand operational timeline'}
          onClick={() => setExpanded((e) => !e)}
        />
      </PdsBox>

      {expanded && (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
          }}
        >
          <OperationalTimeline
            role={role}
            filteredPending={filteredPending}
            filteredResolved={filteredResolved}
            nowMs={nowMs}
            selectedNotificationId={selectedNotificationId}
            onSelectNotification={onSelectNotification}
            laneFilter={laneFilter}
            reducedMotion={reducedMotion}
          />
          <OperationsSummary
            role={role}
            filteredPending={filteredPending}
            nowMs={nowMs}
            reducedMotion={reducedMotion}
            laneFilter={laneFilter}
            onLaneFilter={setLaneFilter}
            onSelectOperator={onSelectOperator}
            onSelectNotification={onSelectNotification}
            focusedMatchId={focusedMatchId}
            onFocusMatch={onFocusMatch}
          />
        </div>
      )}
    </PdsBox>
  );
}
