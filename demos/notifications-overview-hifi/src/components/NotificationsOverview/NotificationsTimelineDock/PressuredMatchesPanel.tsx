import { PdsBox, PdsMantineText } from '@podium-design-system/react-components';

import type { NotificationRow } from '../../../types';

import { pressuredMatchEntries, type PressuredMatchEntry } from './pressuredMatchEntries';

/** Lane-style fills for pressured-match circles (severity-weighted accent). */
function circleFill(entry: PressuredMatchEntry): string {
  if (entry.criticalCount > 0) return '#b91c1c';
  if (entry.majorCount > 0) return '#c2410c';
  return '#475569';
}

export interface PressuredMatchesPanelProps {
  filteredPending: NotificationRow[];
  activeMatchId: string | null;
  onFocusMatch: (matchId: string | null) => void;
}

export function PressuredMatchesPanel({
  filteredPending,
  activeMatchId,
  onFocusMatch,
}: PressuredMatchesPanelProps) {
  const pm = pressuredMatchEntries(filteredPending);

  return (
    <section aria-label="Top time pressured matches" style={{ minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PdsMantineText type="interface" fontSize="500" fontWeight="strong" surface="on-dark" style={{ marginBottom: 6 }}>
        Time pressured matches
      </PdsMantineText>
      <PdsBox
        direction="row"
        gap="sm"
        surface="on-dark"
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          alignItems: 'flex-start',
          justifyContent: 'space-around',
        }}
      >
        {pm.length === 0 ? (
          <PdsMantineText type="interface" fontSize="400" surface="on-dark" style={{ opacity: 0.85 }}>
            No pending pressure
          </PdsMantineText>
        ) : (
          pm.map((p) => {
            const fill = circleFill(p);
            const active = activeMatchId === p.matchId;
            return (
              <button
                key={p.matchId}
                type="button"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  minWidth: 0,
                  flex: '1 1 0',
                  cursor: 'pointer',
                  padding: 6,
                  background: '#0f172a',
                  borderRadius: 8,
                  border: active ? '1px solid #38bdf8' : '1px solid #334155',
                }}
                title={`${p.matchLabel}: ${p.count} issues`}
                aria-pressed={active}
                aria-label={`${p.matchLabel}, ${p.count} issues pending. Opens table.`}
                onClick={() => onFocusMatch(p.matchId)}
              >
                <span
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: fill,
                    border: active ? `2px solid #f8fafc` : `2px solid rgba(255,255,255,0.12)`,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#f8fafc',
                    flexShrink: 0,
                    boxSizing: 'border-box',
                  }}
                >
                  {p.count}
                </span>
                <PdsMantineText
                  type="interface"
                  fontSize="400"
                  surface="on-dark"
                  style={{
                    textAlign: 'center',
                    lineHeight: 1.25,
                    maxWidth: '100%',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                  title={p.matchLabel}
                >
                  {p.matchLabel}
                </PdsMantineText>
              </button>
            );
          })
        )}
      </PdsBox>
    </section>
  );
}
