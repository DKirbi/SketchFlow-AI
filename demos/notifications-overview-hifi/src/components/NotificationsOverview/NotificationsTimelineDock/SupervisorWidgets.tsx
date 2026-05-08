import { PdsBox, PdsMantineButton, PdsMantineText } from '@podium-design-system/react-components';
import { operatorById } from '../../../data/operators';
import type { NotificationRow, OperatorId } from '../../../types';
import { priorityToSeverity } from './severity';

export interface SupervisorWidgetsProps {
  filteredPending: NotificationRow[];
  nowMs: number;
  onSelectOperator: (id: OperatorId | null) => void;
  onSelectNotification: (id: string | null) => void;
}

function overloadedOperators(rows: NotificationRow[]) {
  const counts = new Map<OperatorId, number>();
  for (const r of rows) {
    if (r.resolvedAt) continue;
    counts.set(r.assignedOperatorId, (counts.get(r.assignedOperatorId) ?? 0) + 1);
  }
  const list = [...counts.entries()].map(([id, count]) => ({ id, count }));
  list.sort((a, b) => b.count - a.count);
  const max = list[0]?.count ?? 1;
  return list.slice(0, 3).map((x) => ({ ...x, max }));
}

function untouchedCriticals(rows: NotificationRow[]) {
  const crit = rows.filter(
    (r) =>
      !r.resolvedAt &&
      priorityToSeverity(r.priority) === 'critical' &&
      r.issueUntouched === true,
  );
  crit.sort((a, b) => Date.parse(a.generatedAt) - Date.parse(b.generatedAt));
  const ids = crit.slice(0, 3).map((r) => r.id);
  return { count: crit.length, ids };
}

function escalatingDensity(rows: NotificationRow[], nowMs: number) {
  const since = nowMs - 30 * 60 * 1000;
  const map = new Map<string, { matchLabel: string; count: number }>();
  for (const r of rows) {
    if (r.resolvedAt) continue;
    if (Date.parse(r.generatedAt) < since) continue;
    const cur = map.get(r.matchId) ?? { matchLabel: r.matchLabel, count: 0 };
    cur.count++;
    map.set(r.matchId, cur);
  }
  return [...map.entries()]
    .map(([matchId, v]) => ({ matchId, ...v }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

export function SupervisorWidgets({
  filteredPending,
  nowMs,
  onSelectOperator,
  onSelectNotification,
}: SupervisorWidgetsProps) {
  const oo = overloadedOperators(filteredPending);
  const uc = untouchedCriticals(filteredPending);
  const ed = escalatingDensity(filteredPending, nowMs);

  return (
    <PdsBox direction="column" gap="md" stretchHorizontal>
      <section aria-label="Overloaded operators">
        <PdsMantineText type="interface" fontSize="500" fontWeight="strong" surface="on-dark" style={{ marginBottom: 8 }}>
          Overloaded operators
        </PdsMantineText>
        <PdsBox direction="column" gap="xs" surface="on-dark">
          {oo.length === 0 && (
            <PdsMantineText type="interface" fontSize="400" surface="on-dark">
              No operator load
            </PdsMantineText>
          )}
          {oo.map((o) => {
            const op = operatorById(o.id);
            const frac = o.max > 0 ? Math.round((o.count / o.max) * 100) : 0;
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => onSelectOperator(o.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: 8,
                  borderRadius: 8,
                  border: '1px solid #334155',
                  background: '#0f172a',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                }}
                aria-label={`Drill into operator ${op?.displayName ?? o.id}, ${o.count} pending`}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: '#1e3a5f',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#e2e8f0',
                  }}
                >
                  {op?.initials ?? '?'}
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <PdsMantineText type="interface" fontSize="400" surface="on-dark" style={{ color: '#f1f5f9' }}>
                    {op?.displayName ?? o.id}
                  </PdsMantineText>
                  <div
                    style={{
                      height: 4,
                      borderRadius: 2,
                      background: '#334155',
                      marginTop: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{ width: `${frac}%`, height: '100%', background: '#38bdf8' }} />
                  </div>
                </span>
                <PdsMantineText type="interface" fontSize="500" fontWeight="strong" surface="on-dark">
                  {o.count}
                </PdsMantineText>
              </button>
            );
          })}
        </PdsBox>
      </section>

      <section aria-label="Most untouched criticals">
        <PdsMantineText type="interface" fontSize="500" fontWeight="strong" surface="on-dark" style={{ marginBottom: 8 }}>
          Most untouched criticals
        </PdsMantineText>
        <PdsBox direction="column" gap="sm" surface="on-dark">
          <PdsMantineText type="interface" fontSize="400" surface="on-dark">
            {uc.count} open
          </PdsMantineText>
          <PdsBox direction="row" gap="xs" wrap="wrap" surface="on-dark">
            {uc.ids.map((id) => (
              <PdsMantineButton
                key={id}
                rank="ghost"
                color="neutral"
                surface="on-dark"
                size="xs"
                onClick={() => onSelectNotification(id)}
              >
                {id}
              </PdsMantineButton>
            ))}
            {uc.ids.length === 0 && (
              <PdsMantineText type="interface" fontSize="400" surface="on-dark">
                None
              </PdsMantineText>
            )}
          </PdsBox>
        </PdsBox>
      </section>

      <section aria-label="Escalating density">
        <PdsMantineText type="interface" fontSize="500" fontWeight="strong" surface="on-dark" style={{ marginBottom: 8 }}>
          Escalating density (30 min)
        </PdsMantineText>
        <PdsBox direction="column" gap="xs" surface="on-dark">
          {ed.length === 0 && (
            <PdsMantineText type="interface" fontSize="400" surface="on-dark">
              No burst
            </PdsMantineText>
          )}
          {ed.map((e) => (
            <PdsBox key={e.matchId} direction="row" justifyContent="space-between" gap="sm" surface="on-dark">
              <PdsMantineText type="interface" fontSize="400" surface="on-dark" style={{ flex: 1, minWidth: 0 }}>
                {e.matchLabel}
              </PdsMantineText>
              <PdsMantineText type="interface" fontSize="400" surface="on-dark">
                {e.count}
              </PdsMantineText>
            </PdsBox>
          ))}
        </PdsBox>
      </section>
    </PdsBox>
  );
}
