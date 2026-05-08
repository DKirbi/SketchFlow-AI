import { Panel, useViewport } from '@xyflow/react';
import type { RoundColumn } from '../lib/roundGuideColumns';

interface Props {
  columns: RoundColumn[];
}

/**
 * Sticky round-name belt rendered inside the ReactFlow Panel (above the
 * panned/zoomed viewport). Labels track their bracket columns via the
 * same `useViewport` transform used by the world-layer guides.
 */
export function RoundHeaderBelt({ columns }: Props) {
  const { x: panX, zoom } = useViewport();

  const toScreen = (cx: number) => cx * zoom + panX;

  return (
    <Panel position="top-left" className="round-header-belt">
      {columns.map((col) => {
        const leftPx = toScreen(col.startX);
        const widthPx = (col.endX - col.startX) * zoom;
        return (
          <div
            key={col.round}
            className="round-belt-label"
            style={{ left: leftPx, width: widthPx }}
          >
            {col.label}
          </div>
        );
      })}
    </Panel>
  );
}
