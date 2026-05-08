import { PdsBox, PdsMantineText } from '@podium-design-system/react-components';
import type { Severity } from './severity';
import { LANE_BG } from './severity';

const LABEL: Record<Severity, string> = {
  critical: 'Critical',
  major: 'Major',
  minor: 'Minor',
};

export interface SeverityCountsProps {
  critical: number;
  major: number;
  minor: number;
  laneFilter: Severity | null;
  onLaneClick: (lane: Severity | null) => void;
  /** Tighter tiles for supervisor split layout (paired with pressured matches). */
  compact?: boolean;
}

export function SeverityCounts({
  critical,
  major,
  minor,
  laneFilter,
  onLaneClick,
  compact = false,
}: SeverityCountsProps) {
  const items: { lane: Severity; value: number }[] = [
    { lane: 'critical', value: critical },
    { lane: 'major', value: major },
    { lane: 'minor', value: minor },
  ];

  return (
    <PdsBox
      direction="row"
      gap="sm"
      stretchHorizontal
      style={{
        flex: compact ? '1 1 auto' : 1,
        minHeight: 0,
        alignSelf: 'stretch',
      }}
    >
      {items.map(({ lane, value }) => {
        const active = laneFilter === lane;
        return (
          <button
            key={lane}
            type="button"
            onClick={() => onLaneClick(active ? null : lane)}
            style={{
              flex: 1,
              minWidth: 0,
              cursor: 'pointer',
              border: active ? '1px solid #94a3b8' : '1px solid transparent',
              borderRadius: 8,
              padding: compact ? 6 : 8,
              background: '#1e293b',
              textAlign: 'left',
            }}
            aria-pressed={active}
            aria-label={`${LABEL[lane]} issues, ${value} pending. ${active ? 'Filter active' : 'Click to filter timeline lane.'}`}
          >
            <PdsMantineText type="interface" fontSize="400" surface="on-dark" style={{ marginBottom: 6 }}>
              {LABEL[lane]}
            </PdsMantineText>
            <div
              style={{
                height: compact ? 40 : 56,
                borderRadius: 4,
                background: LANE_BG[lane],
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingBottom: compact ? 4 : 6,
              }}
            >
              <PdsMantineText
                type="display"
                fontSize={compact ? '600' : '700'}
                fontWeight="strong"
                surface="on-dark"
              >
                {value}
              </PdsMantineText>
            </div>
          </button>
        );
      })}
    </PdsBox>
  );
}
