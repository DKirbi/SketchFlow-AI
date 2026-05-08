import { PdsBox, PdsMantineText } from '@podium-design-system/react-components';
import type { NotificationRow, OperatorId, Role } from '../../../types';

import { PressuredMatchesPanel } from './PressuredMatchesPanel';
import { SLAAlertCards } from './SLAAlertCards';
import { SeverityCounts } from './SeverityCounts';
import { SupervisorWidgets } from './SupervisorWidgets';
import type { Severity } from './severity';
import { priorityToSeverity } from './severity';

export interface OperationsSummaryProps {
  role: Role;
  filteredPending: NotificationRow[];
  nowMs: number;
  reducedMotion: boolean;
  laneFilter: Severity | null;
  onLaneFilter: (lane: Severity | null) => void;
  onSelectOperator: (id: OperatorId | null) => void;
  onSelectNotification: (id: string | null) => void;
  /** Highlights circle + narrows table to issues for one match (operator + supervisor). */
  focusedMatchId: string | null;
  onFocusMatch: (matchId: string | null) => void;
}

export function OperationsSummary({
  role,
  filteredPending,
  nowMs,
  reducedMotion,
  laneFilter,
  onLaneFilter,
  onSelectOperator,
  onSelectNotification,
  focusedMatchId,
  onFocusMatch,
}: OperationsSummaryProps) {
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

  return (
    <PdsBox
      direction="column"
      gap="sm"
      padding="sm"
      surface="on-dark"
      style={{
        flex: 2,
        minWidth: 0,
        minHeight: 0,
        overflow: 'hidden',
        borderLeft: '1px solid #334155',
      }}
    >
      <PdsBox
        direction="row"
        gap="sm"
        stretchHorizontal
        style={{
          flex: '1 1 50%',
          minHeight: 118,
          maxHeight: '50%',
          overflow: 'hidden',
        }}
      >
        <PdsBox
          direction="column"
          surface="on-dark"
          style={{ flex: '1 1 50%', minWidth: 0, minHeight: 0 }}
        >
          <PdsMantineText
            type="interface"
            fontSize="500"
            fontWeight="strong"
            surface="on-dark"
            style={{ marginBottom: 6 }}
          >
            Severity counts
          </PdsMantineText>
          <PdsBox style={{ flex: 1, minHeight: 0 }}>
            <SeverityCounts
              compact
              critical={critical}
              major={major}
              minor={minor}
              laneFilter={laneFilter}
              onLaneClick={onLaneFilter}
            />
          </PdsBox>
        </PdsBox>

        <PdsBox direction="column" surface="on-dark" style={{ flex: '1 1 50%', minWidth: 0, minHeight: 0 }}>
          <PressuredMatchesPanel
            filteredPending={filteredPending}
            activeMatchId={focusedMatchId}
            onFocusMatch={onFocusMatch}
          />
        </PdsBox>
      </PdsBox>

      <PdsBox
        surface="on-dark"
        style={{
          flex: '1 1 50%',
          minHeight: 0,
          overflow: 'auto',
          paddingTop: 4,
          borderTop: '1px solid #334155',
        }}
      >
        {role === 'supervisor' ? (
          <SupervisorWidgets
            filteredPending={filteredPending}
            nowMs={nowMs}
            onSelectOperator={onSelectOperator}
            onSelectNotification={onSelectNotification}
          />
        ) : (
          <SLAAlertCards filteredPending={filteredPending} nowMs={nowMs} reducedMotion={reducedMotion} />
        )}
      </PdsBox>
    </PdsBox>
  );
}
