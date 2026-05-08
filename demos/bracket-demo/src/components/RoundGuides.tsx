import { useViewport } from '@xyflow/react';
import { deriveDividerX } from '../lib/roundGuideColumns';
import type { RoundColumn } from '../lib/roundGuideColumns';

interface Props {
  /**
   * Ordered list of round columns derived from the active tournament brackets.
   * Each column provides the x-midpoint used to compute divider positions.
   */
  columns: RoundColumn[];
}

/**
 * World-layer dashed vertical dividers between round columns.
 * Text labels are handled by RoundHeaderBelt (viewport-pinned Panel).
 */
export function RoundGuides({ columns }: Props) {
  const { x: panX, zoom } = useViewport();

  const toScreen = (cx: number) => cx * zoom + panX;
  const dividerXs = deriveDividerX(columns);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {dividerXs.map((cx) => (
        <div
          key={cx}
          className="round-divider"
          style={{ left: toScreen(cx) }}
        />
      ))}
    </div>
  );
}
