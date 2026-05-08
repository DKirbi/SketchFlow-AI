import { group } from 'd3-array';
import type { SimulationNodeDatum } from 'd3-force';
import { forceCollide, forceSimulation, forceX, forceY } from 'd3-force';
import { scaleBand, scaleTime } from 'd3-scale';
import { select } from 'd3-selection';
import { timeMinute } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { zoom, zoomIdentity } from 'd3-zoom';
import { type KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PdsBox, PdsMantineText } from '@podium-design-system/react-components';
import type { NotificationRow, Role } from '../../../types';
import type { AnchorRect } from './IssuePopover';
import { IssuePopover } from './IssuePopover';
import {
  escalationTier,
  laneJitter,
  LANES,
  LANE_BG,
  operatorRingColor,
  priorityBandOffset,
  priorityToSeverity,
  SEVERITY_DOT,
  type Severity,
} from './severity';

/** ~20×20 px visible dots — easier targeting than the legacy 10 px diameter circles. */
const DOT_R_BASE = 10;
const DOT_R_EMPHASIS = 11;
const DOT_SPOTLIGHT_R = 28;
const CLUSTER_MERGE_GAP_PX = 26;

export interface OperationalTimelineProps {
  role: Role;
  filteredPending: NotificationRow[];
  filteredResolved: NotificationRow[];
  nowMs: number;
  windowHours?: number;
  selectedNotificationId: string | null;
  onSelectNotification: (id: string | null) => void;
  laneFilter: Severity | null;
  reducedMotion: boolean;
}

type TimelineEntry = {
  row: NotificationRow;
  pending: boolean;
  tMs: number;
  severity: Severity;
};

interface PlacedDot {
  entry: TimelineEntry;
  cx: number;
  cy: number;
  lane: Severity;
  laneCenterY: number;
}

function formatClock(ms: number): string {
  const d = new Date(ms);
  return d.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

function formatAriaAge(sec: number): string {
  if (sec < 60) return `${Math.floor(sec)} seconds`;
  const m = Math.floor(sec / 60);
  return `${m} minutes`;
}

function circleAriaLabel(row: NotificationRow, pending: boolean, nowMs: number): string {
  const ageSec = Math.max(0, (nowMs - Date.parse(row.generatedAt)) / 1000);
  const dur = pending ? `${formatAriaAge(ageSec)} active` : 'resolved';
  return `${row.messageName}, ${row.matchLabel}, priority ${row.priority}, ${dur}`;
}

export function OperationalTimeline({
  role,
  filteredPending,
  filteredResolved,
  nowMs,
  windowHours = 12,
  selectedNotificationId,
  onSelectNotification,
  laneFilter,
  reducedMotion,
}: OperationalTimelineProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 640, h: 380 });
  const [transform, setTransform] = useState(zoomIdentity);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [kbdIndex, setKbdIndex] = useState(0);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [popoverTarget, setPopoverTarget] = useState<{
    row: NotificationRow;
    anchor: AnchorRect;
  } | null>(null);

  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr && cr.width > 40 && cr.height > 40) {
        setSize({ w: Math.floor(cr.width), h: Math.floor(cr.height) });
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const margin = { top: 26, right: 10, bottom: 36, left: 56 };
  const width = size.w;
  const height = size.h;
  const innerW = width - margin.left - margin.right;

  const windowStart = nowMs - windowHours * 3600000;
  const windowEnd = nowMs + 5 * 60 * 1000;

  const entries = useMemo(() => {
    const inWindow = (tMs: number) => tMs >= windowStart && tMs <= windowEnd;
    const list: TimelineEntry[] = [];

    for (const r of filteredPending) {
      if (r.resolvedAt) continue;
      const tMs = Date.parse(r.generatedAt);
      if (!inWindow(tMs)) continue;
      list.push({
        row: r,
        pending: true,
        tMs,
        severity: priorityToSeverity(r.priority),
      });
    }

    for (const r of filteredResolved) {
      const anchor = r.resolvedAt ?? r.generatedAt;
      const tMs = Date.parse(anchor);
      if (!inWindow(tMs)) continue;
      list.push({
        row: r,
        pending: false,
        tMs,
        severity: priorityToSeverity(r.priority),
      });
    }
    return list;
  }, [filteredPending, filteredResolved, windowStart, windowEnd]);

  const filteredEntries = useMemo(() => {
    if (!laneFilter) return entries;
    return entries.filter((e) => e.severity === laneFilter);
  }, [entries, laneFilter]);

  // Keep timeline keyboard/highlight focus aligned when selection comes from the table (external).
  useEffect(() => {
    if (selectedNotificationId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync external table selection into local focus
      setFocusId(selectedNotificationId);
    }
  }, [selectedNotificationId]);

  const focusEntry = useMemo(() => {
    if (!focusId) return null;
    return filteredEntries.find((e) => e.row.id === focusId) ?? null;
  }, [focusId, filteredEntries]);

  const xScaleBase = useMemo(
    () =>
      scaleTime()
        .domain([new Date(windowStart), new Date(windowEnd)])
        .range([margin.left, width - margin.right]),
    [windowStart, windowEnd, margin.left, margin.right, width],
  );

  const xScale = useMemo(() => transform.rescaleX(xScaleBase), [transform, xScaleBase]);

  const yBand = useMemo(() => {
    return scaleBand<Severity>()
      .domain(LANES)
      .range([margin.top, height - margin.bottom])
      .paddingInner(0.18);
  }, [margin.top, margin.bottom, height]);

  const placedDots = useMemo(() => {
    const bandwidth = yBand.bandwidth();
    const raw: PlacedDot[] = filteredEntries.map((entry) => {
      const lane = entry.severity;
      const laneY0 = yBand(lane) ?? margin.top;
      const laneCenterY = laneY0 + bandwidth / 2;
      const jitter = laneJitter(entry.row.id) * bandwidth * 0.32;
      const po = priorityBandOffset(entry.row.priority, lane);
      const cy = laneCenterY + jitter + (po - 0.5) * bandwidth * 0.55;
      const cx = xScale(new Date(entry.tMs));
      return { entry, cx, cy, lane, laneCenterY };
    });

    const byLane = group(raw, (d) => d.lane);
    for (const [, arr] of byLane) {
      arr.sort((a, b) => a.cx - b.cx);
      let i = 0;
      while (i < arr.length) {
        let j = i + 1;
        while (j < arr.length && arr[j].cx - arr[i].cx <= CLUSTER_MERGE_GAP_PX) j++;
        const cluster = arr.slice(i, j);
        if (cluster.length >= 6) {
          type SimN = SimulationNodeDatum & { refX: number; laneCenterY: number };
          const nodes: SimN[] = cluster.map((d) => ({
            x: d.cx,
            y: d.cy,
            refX: d.cx,
            laneCenterY: d.laneCenterY,
          }));
          const sim = forceSimulation(nodes)
            .force(
              'x',
              forceX<SimN>((n) => n.refX).strength(1),
            )
            .force(
              'y',
              forceY<SimN>((n) => n.laneCenterY).strength(0.4),
            )
            .force('collide', forceCollide<SimN>(DOT_R_BASE + 2).strength(0.9))
            .stop();
          for (let t = 0; t < 30; t++) sim.tick();
          cluster.forEach((d, idx) => {
            const n = nodes[idx];
            if (n && n.x != null && n.y != null) {
              d.cx = n.x;
              d.cy = n.y;
            }
          });
        }
        i = j;
      }
    }
    return raw;
  }, [filteredEntries, xScale, yBand, margin.top]);

  const sortedForKeys = useMemo(
    () => [...placedDots].sort((a, b) => a.entry.tMs - b.entry.tMs),
    [placedDots],
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', (event) => setTransform(event.transform));

    const sel = select(svg);
    sel.call(z);
    sel.on('dblclick.zoom', (ev: MouseEvent) => {
      ev.preventDefault();
      sel.call(z.transform, zoomIdentity);
    });
    return () => {
      sel.on('.zoom', null);
      sel.on('dblclick.zoom', null);
    };
  }, [width, height]);

  const k = transform.k;
  const hourTickTarget = Math.max(4, Math.min(24, Math.floor(innerW / 100)));
  const hourTicks = xScale.ticks(hourTickTarget);
  const minorInterval = k >= 2 ? timeMinute.every(15) : null;
  const minorTicks = minorInterval !== null ? xScale.ticks(minorInterval) : [];

  const focusMatchId = focusEntry?.row.matchId;
  const focusCat = focusEntry?.row.category;
  const focusOp = focusEntry?.row.assignedOperatorId;
  const focusT = focusEntry?.tMs;

  const dotOpacity = useCallback(
    (d: PlacedDot) => {
      if (!focusId) return 1;
      const { row, tMs } = d.entry;
      if (row.id === focusId) return 1;
      if (focusMatchId && row.matchId === focusMatchId) return 1;
      if (focusCat && row.category === focusCat) return 1;
      if (focusOp && row.assignedOperatorId === focusOp) return 1;
      if (focusT !== null && focusT !== undefined && Math.abs(tMs - focusT) <= 5 * 60_000) return 1;
      return 0.18;
    },
    [focusId, focusMatchId, focusCat, focusOp, focusT],
  );

  const openPopover = (row: NotificationRow, el: Element) => {
    window.clearTimeout(closeTimer.current);
    const r = el.getBoundingClientRect();
    setPopoverTarget({
      row,
      anchor: { left: r.left, top: r.top, width: r.width, height: r.height },
    });
    setPopoverOpen(true);
  };

  const scheduleClosePopover = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setPopoverOpen(false);
      setPopoverTarget(null);
    }, 180);
  };

  const onCircleClick = (id: string) => {
    setFocusId(id);
    setKbdIndex(Math.max(0, sortedForKeys.findIndex((d) => d.entry.row.id === id)));
    onSelectNotification(id);
  };

  const onContainerKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setFocusId(null);
      onSelectNotification(null);
      setPopoverOpen(false);
      setPopoverTarget(null);
      return;
    }
    if (sortedForKeys.length === 0) return;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setKbdIndex((i) => {
        const n = (i + 1) % sortedForKeys.length;
        const id = sortedForKeys[n].entry.row.id;
        setFocusId(id);
        return n;
      });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setKbdIndex((i) => {
        const n = (i - 1 + sortedForKeys.length) % sortedForKeys.length;
        const id = sortedForKeys[n].entry.row.id;
        setFocusId(id);
        return n;
      });
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const order: Severity[] = ['critical', 'major', 'minor'];
      const cur = sortedForKeys[kbdIndex];
      if (!cur) return;
      const li = order.indexOf(cur.lane);
      const nextLane =
        e.key === 'ArrowDown'
          ? order[Math.min(order.length - 1, li + 1)]
          : order[Math.max(0, li - 1)];
      const inLane = sortedForKeys.filter((d) => d.lane === nextLane);
      if (inLane.length === 0) return;
      const nearest = inLane.reduce((best, d) =>
        Math.abs(d.entry.tMs - cur.entry.tMs) < Math.abs(best.entry.tMs - cur.entry.tMs) ? d : best,
      );
      const idx = sortedForKeys.findIndex((d) => d.entry.row.id === nearest.entry.row.id);
      setKbdIndex(idx);
      setFocusId(nearest.entry.row.id);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cur = sortedForKeys[kbdIndex];
      if (cur) onCircleClick(cur.entry.row.id);
    }
  };

  const connectorPaths = useMemo(() => {
    if (!focusId || !focusMatchId) return [];
    const main = placedDots.find((d) => d.entry.row.id === focusId);
    if (!main) return [];
    const related = placedDots.filter(
      (d) =>
        d.entry.row.matchId === focusMatchId &&
        d.entry.row.id !== focusId &&
        dotOpacity(d) >= 0.9,
    );
    return related.map((d) => {
      const x0 = main.cx;
      const y0 = main.cy;
      const x1 = d.cx;
      const y1 = d.cy;
      const mx = (x0 + x1) / 2;
      const my = Math.min(y0, y1) - 24;
      return `M ${x0} ${y0} Q ${mx} ${my} ${x1} ${y1}`;
    });
  }, [focusId, focusMatchId, placedDots, dotOpacity]);

  const emptyInWindow = filteredEntries.length === 0;

  return (
    <PdsBox surface="on-dark" style={{ flex: 3, minWidth: 0, minHeight: 0, position: 'relative' }}>
      <div ref={wrapRef} style={{ width: '100%', height: '100%', minHeight: 320 }}>
        <IssuePopover
          opened={popoverOpen}
          onChange={(o) => {
            if (!o) scheduleClosePopover();
            else setPopoverOpen(true);
          }}
          anchor={popoverTarget?.anchor ?? null}
          row={popoverTarget?.row ?? null}
          nowMs={nowMs}
        />
        <svg
          ref={svgRef}
          width={width}
          height={height}
          role="application"
          tabIndex={0}
          aria-label="Operational notification timeline. Use arrow keys to move between issues, Enter to select, Escape to clear focus."
          onKeyDown={onContainerKeyDown}
          style={{ display: 'block', outline: 'none' }}
        >
          <defs>
            <radialGradient id="dockSpotGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {LANES.map((lane) => {
            const y = yBand(lane) ?? 0;
            const h = yBand.bandwidth();
            return (
              <rect
                key={lane}
                x={margin.left}
                y={y}
                width={innerW}
                height={h}
                fill={LANE_BG[lane]}
                rx={4}
              />
            );
          })}

          {LANES.map((lane) => (
            <text
              key={`label-${lane}`}
              x={margin.left - 6}
              y={(yBand(lane) ?? 0) + yBand.bandwidth() / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fill="#cbd5e1"
              fontSize={11}
              style={{ textTransform: 'capitalize' }}
            >
              {lane}
            </text>
          ))}

          <g className="grid">
            {hourTicks.map((t, i) => {
              const x = xScale(t);
              return (
                <line
                  key={`h-${i}`}
                  x1={x}
                  x2={x}
                  y1={margin.top}
                  y2={height - margin.bottom}
                  stroke="#27303f"
                  strokeWidth={1}
                />
              );
            })}
            {minorTicks.map((t, i) => {
                const x = xScale(t);
                if (hourTicks.some((h) => Math.abs(h.getTime() - t.getTime()) < 60_000)) return null;
                return (
                  <line
                    key={`m-${i}`}
                    x1={x}
                    x2={x}
                    y1={margin.top}
                    y2={height - margin.bottom}
                    stroke="#27303f"
                    strokeOpacity={0.35}
                    strokeWidth={0.5}
                  />
                );
              })}
          </g>

          <line
            x1={xScale(new Date(nowMs))}
            x2={xScale(new Date(nowMs))}
            y1={margin.top}
            y2={height - margin.bottom}
            stroke={reducedMotion ? '#94a3b8' : '#38bdf8'}
            strokeWidth={1}
            strokeDasharray={reducedMotion ? undefined : '4 3'}
          />

          <text x={xScale(new Date(nowMs)) + 6} y={margin.top + 12} fill="#38bdf8" fontSize={11} fontWeight={600}>
            NOW {formatClock(nowMs)}
          </text>

          <g className="x-axis">
            {hourTicks.map((t, i) => {
              const x = xScale(t);
              return (
                <text key={`xt-${i}`} x={x} y={height - 10} textAnchor="middle" fill="#94a3b8" fontSize={10}>
                  {timeFormat('%H:%M')(t)}
                </text>
              );
            })}
          </g>

          {connectorPaths.map((d, i) => (
            <path key={`conn-${i}`} d={d} fill="none" stroke="#64748b" strokeWidth={1} strokeOpacity={0.5} />
          ))}

          {placedDots.map((d) => {
            const { row, pending } = d.entry;
            const ageSec = Math.max(0, (nowMs - Date.parse(row.generatedAt)) / 1000);
            const breach =
              role === 'supervisor' && pending && escalationTier(d.entry.severity, ageSec) !== 'none';
            const opRing = role === 'supervisor' ? operatorRingColor(row.assignedOperatorId) : null;
            const isFocus = focusId === row.id;
            const kbdFocus = sortedForKeys[kbdIndex]?.entry.row.id === row.id;
            const fill = SEVERITY_DOT[d.entry.severity];
            const vizR = hoverId === row.id || kbdFocus ? DOT_R_EMPHASIS : DOT_R_BASE;

            return (
              <g key={row.id} style={{ opacity: dotOpacity(d), pointerEvents: 'all' }}>
                {isFocus && (
                  <circle
                    cx={d.cx}
                    cy={d.cy}
                    r={DOT_SPOTLIGHT_R}
                    fill="url(#dockSpotGrad)"
                    style={{ pointerEvents: 'none' }}
                  />
                )}
                <circle
                  cx={d.cx}
                  cy={d.cy}
                  r={vizR}
                  fill={fill}
                  fillOpacity={pending ? 1 : 0.55}
                  stroke={opRing ?? (kbdFocus ? '#f8fafc' : 'transparent')}
                  strokeWidth={opRing ? 2 : kbdFocus ? 2 : 0}
                  aria-label={circleAriaLabel(row, pending || false, nowMs)}
                  onPointerEnter={(ev) => {
                    setHoverId(row.id);
                    openPopover(row, ev.currentTarget);
                  }}
                  onPointerLeave={() => {
                    setHoverId(null);
                    scheduleClosePopover();
                  }}
                  onClick={() => onCircleClick(row.id)}
                  style={{ cursor: 'pointer' }}
                />
                {breach && (
                  <polygon
                    points={`${d.cx + vizR + 4},${d.cy - vizR - 6} ${d.cx + vizR + 14},${d.cy - vizR - 6} ${d.cx + vizR + 9},${d.cy - vizR - 12}`}
                    fill="#fbbf24"
                    stroke="#0f172a"
                    strokeWidth={0.5}
                    style={{ pointerEvents: 'none' }}
                    aria-hidden
                  />
                )}
              </g>
            );
          })}
        </svg>

        {emptyInWindow && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              paddingTop: 24,
            }}
          >
            <PdsMantineText type="interface" fontSize="500" surface="on-dark" style={{ opacity: 0.85 }}>
              No events in the visible range
            </PdsMantineText>
          </div>
        )}
      </div>
    </PdsBox>
  );
}
