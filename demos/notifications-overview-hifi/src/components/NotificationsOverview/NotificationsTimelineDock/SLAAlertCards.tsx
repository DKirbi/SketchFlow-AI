import { useEffect, useRef, useState } from 'react';
import { PdsBox, PdsMantineText } from '@podium-design-system/react-components';
import type { NotificationRow } from '../../../types';
import { priorityToSeverity } from './severity';

export interface SLAAlertCardsProps {
  filteredPending: NotificationRow[];
  nowMs: number;
  reducedMotion: boolean;
}

function tierCount(rows: NotificationRow[], nowMs: number, test: (ageSec: number, r: NotificationRow) => boolean): number {
  let n = 0;
  for (const r of rows) {
    if (r.resolvedAt) continue;
    const ageSec = (nowMs - Date.parse(r.generatedAt)) / 1000;
    if (ageSec >= 0 && test(ageSec, r)) n++;
  }
  return n;
}

function sampleLabels(rows: NotificationRow[], nowMs: number, test: (ageSec: number, r: NotificationRow) => boolean): string[] {
  const labels: string[] = [];
  for (const r of rows) {
    if (r.resolvedAt) continue;
    const ageSec = (nowMs - Date.parse(r.generatedAt)) / 1000;
    if (ageSec >= 0 && test(ageSec, r)) {
      labels.push(r.matchLabel);
      if (labels.length >= 2) break;
    }
  }
  return labels;
}

function Card({
  title,
  count,
  footerLabels,
  borderTint,
  reducedMotion,
}: {
  title: string;
  count: number;
  footerLabels: string[];
  borderTint: string;
  reducedMotion: boolean;
}) {
  const prev = useRef(count);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      prev.current = count;
      return;
    }
    if (count > prev.current) {
      setBump(true);
      const t = window.setTimeout(() => setBump(false), 420);
      prev.current = count;
      return () => clearTimeout(t);
    }
    prev.current = count;
  }, [count, reducedMotion]);

  return (
    <PdsBox
      padding="sm"
      direction="column"
      gap="xs"
      surface="on-dark"
      style={{
        border: `1px solid ${borderTint}`,
        borderRadius: 8,
        background: '#0f172a',
        transform: bump ? 'scale(1.02)' : undefined,
        transition: reducedMotion ? undefined : 'transform 200ms ease',
      }}
    >
      <PdsMantineText type="interface" fontSize="400" surface="on-dark">
        {title}
      </PdsMantineText>
      <PdsMantineText type="display" fontSize="800" fontWeight="strong" surface="on-dark">
        {count}
      </PdsMantineText>
      <PdsMantineText type="interface" fontSize="300" surface="on-dark" style={{ opacity: 0.85 }}>
        {footerLabels.length > 0 ? footerLabels.join(' · ') : '—'}
      </PdsMantineText>
    </PdsBox>
  );
}

export function SLAAlertCards({ filteredPending, nowMs, reducedMotion }: SLAAlertCardsProps) {
  const criticalRows = filteredPending.filter((r) => !r.resolvedAt && priorityToSeverity(r.priority) === 'critical');
  const majorRows = filteredPending.filter((r) => !r.resolvedAt && priorityToSeverity(r.priority) === 'major');

  const c1 = tierCount(criticalRows, nowMs, (age) => age >= 60);
  const c2 = tierCount(criticalRows, nowMs, (age) => age >= 180);
  const m1 = tierCount(majorRows, nowMs, (age) => age >= 600);

  return (
    <PdsBox direction="column" gap="sm" stretchHorizontal>
      <Card
        title="Critical untouched > 1 min"
        count={c1}
        footerLabels={sampleLabels(criticalRows, nowMs, (age) => age >= 60)}
        borderTint="#b91c1c88"
        reducedMotion={reducedMotion}
      />
      <Card
        title="Critical untouched > 3 min"
        count={c2}
        footerLabels={sampleLabels(criticalRows, nowMs, (age) => age >= 180)}
        borderTint="#991b1baa"
        reducedMotion={reducedMotion}
      />
      <Card
        title="Major untouched > 10 min"
        count={m1}
        footerLabels={sampleLabels(majorRows, nowMs, (age) => age >= 600)}
        borderTint="#b4530988"
        reducedMotion={reducedMotion}
      />
    </PdsBox>
  );
}
