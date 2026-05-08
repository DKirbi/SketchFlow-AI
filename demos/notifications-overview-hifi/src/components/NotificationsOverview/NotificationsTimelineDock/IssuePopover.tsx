import { Box, Popover } from '@mantine/core';
import {
  PdsBox,
  PdsMantineBadge,
  PdsMantineText,
} from '@podium-design-system/react-components';
import type { NotificationRow } from '../../../types';
import { operatorById } from '../../../data/operators';
import { formatGenerated } from '../../../lib/formatGenerated';
import type { SeverityLane } from './severity';
import { priorityToSeverity } from './severity';

export type AnchorRect = { left: number; top: number; width: number; height: number };

export interface IssuePopoverProps {
  opened: boolean;
  onChange: (open: boolean) => void;
  anchor: AnchorRect | null;
  row: NotificationRow | null;
  /** Simulated clock for uninterrupted / aging copy. */
  nowMs: number;
}

function severityBadgeColor(s: SeverityLane): 'warning' | 'attention' | 'neutral' {
  if (s === 'critical') return 'warning';
  if (s === 'major') return 'attention';
  return 'neutral';
}

function categoryPretty(category: NotificationRow['category']): string {
  return category.replace(/-/g, ' ');
}

function formatUntouched(nowMs: number, row: NotificationRow, pendingEffective: boolean): string | null {
  if (!pendingEffective) return null;
  const ageMs = nowMs - Date.parse(row.generatedAt);
  const min = Math.max(0, Math.round(ageMs / 60_000));
  if (row.issueUntouched) return `${min} min since alert (not opened)`;
  return `${min} min pending`;
}

function datasetLabel(ds: NotificationRow['dataset']): string {
  return ds === 'BETTING' ? 'Betting' : 'Media validated';
}

/** Mantine Popover (`withinPortal` default): dense triage tooltip for SVG nodes. */
export function IssuePopover({ opened, onChange, anchor, row, nowMs }: IssuePopoverProps) {
  const show = !!(opened && anchor && row);
  const pendingEffective = !!row && !row.resolvedAt;

  const sev = row ? priorityToSeverity(row.priority) : 'minor';
  const op = row ? operatorById(row.assignedOperatorId) : undefined;

  return (
    <Popover
      opened={show}
      onChange={onChange}
      withinPortal
      position="bottom"
      offset={10}
      middlewares={{ flip: true, shift: true }}
    >
      <Popover.Target>
        <Box
          style={{
            position: 'fixed',
            left: anchor?.left ?? 0,
            top: anchor?.top ?? 0,
            width: anchor?.width ?? 1,
            height: anchor?.height ?? 1,
            padding: 0,
            margin: 0,
            border: 'none',
            opacity: 0,
            pointerEvents: 'none',
            zIndex: 0,
          }}
          aria-hidden
        />
      </Popover.Target>
      <Popover.Dropdown
        p="sm"
        style={{
          maxWidth: 360,
          background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
          border: '1px solid #27303f',
        }}
      >
        {row && (
          <PdsBox direction="column" gap="xs">
            <PdsBox direction="row" gap="xs" alignItems="center" wrap="wrap">
              <PdsMantineBadge color={severityBadgeColor(sev)} variant="filled" size="sm" surface="on-dark">
                P{row.priority}
              </PdsMantineBadge>
              <PdsMantineBadge
                color={pendingEffective ? 'warning' : 'neutral'}
                variant="outline"
                size="sm"
                surface="on-dark"
              >
                {pendingEffective ? 'Pending' : 'Resolved'}
              </PdsMantineBadge>
            </PdsBox>
            <PdsMantineText type="interface" fontSize="700" fontWeight="strong" surface="on-dark">
              {row.issueTypeLabel}
            </PdsMantineText>
            <Field label="Match" value={row.matchLabel} />
            <Field label="Tournament" value={row.tournament} />
            <Field label="Operator" value={op?.displayName ?? '—'} />
            <Field label="Category" value={categoryPretty(row.category)} />
            <Field label="Dataset" value={datasetLabel(row.dataset)} />
            <Field label="Generated" value={formatGenerated(row.generatedAt)} />
            <Field label="Sport / LS" value={`${row.sport} · ${row.lsLevel}`} />
            {formatUntouched(nowMs, row, pendingEffective) != null ? (
              <Field label="Queue age" value={formatUntouched(nowMs, row, pendingEffective)!} emphasis />
            ) : null}
          </PdsBox>
        )}
      </Popover.Dropdown>
    </Popover>
  );
}

function Field({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <PdsBox direction="column" gap="xs">
      <PdsMantineText type="interface" fontSize="400" surface="on-dark" style={{ opacity: 0.75 }}>
        {label}
      </PdsMantineText>
      <PdsMantineText
        type="interface"
        fontSize={emphasis ? ('600' as const) : ('500' as const)}
        fontWeight={emphasis ? 'strong' : undefined}
        surface="on-dark"
        style={{ color: emphasis ? '#fecaca' : undefined }}
      >
        {value}
      </PdsMantineText>
    </PdsBox>
  );
}
