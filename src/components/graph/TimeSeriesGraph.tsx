"use client";

import * as React from "react";
import * as d3 from "d3";
import { GraphTooltip } from "./GraphTooltip";
import { DataInsightCard } from "./DataInsightCard";
import { cn } from "@/lib/utils";

export type TimePoint = { date: Date; value: number };

type Props = {
  data: TimePoint[];
  height?: number;
  color?: string;
  area?: boolean;
  labelY?: string;
  fillHeight?: boolean;
};

export default function TimeSeriesBlock({
  data = [],
  title,
  description,
  metrics,
  height = 240,
  color = "hsl(var(--primary))",
  area = false,
  labelY,
  fillHeight = false,
  className
}: Props & { title?: string; description?: string; metrics?: any[]; className?: string }) {
  return (
    <section className={cn("py-24 px-6", className)}>
      <div className="max-w-6xl mx-auto">
        <DataInsightCard
          title={title}
          description={description}
          metrics={metrics}
          chartPosition="left"
        >
          <TimeSeriesGraph 
            data={data} 
            height={height}
            color={color}
            area={area}
            labelY={labelY}
            fillHeight={fillHeight}
          />
        </DataInsightCard>
      </div>
    </section>
  );
}

export function TimeSeriesGraph({
  data,
  height = 240,
  color = "hsl(var(--primary))",
  area = false,
  labelY,
  fillHeight = false,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(600);
  const [containerHeight, setContainerHeight] = React.useState<number | null>(null);
  const metricLabel = labelY ?? "Count";
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);

  // Resize observer
  React.useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      setWidth(Math.max(320, e.contentRect.width));
      if (fillHeight) {
        setContainerHeight(Math.max(160, e.contentRect.height));
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [fillHeight]);

  // Sort by date safely and normalize strings to Date objects
  const sorted = React.useMemo<TimePoint[]>(
    () => {
      if (!Array.isArray(data) || data.length === 0) return [];
      
      return data
        .map(d => ({
          ...d,
          date: d.date instanceof Date ? d.date : new Date(d.date)
        }))
        .filter(d => d.date && !isNaN(d.date.getTime()))
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    },
    [data]
  );

  const hasData = sorted.length > 0;

  const margin = React.useMemo(
    () => ({
      top: labelY ? 32 : 12,
      right: 16,
      bottom: 28,
      left: 44,
    }),
    [labelY]
  );

  const resolvedHeight = fillHeight
    ? Math.max(160, containerHeight ?? height)
    : height;

  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, resolvedHeight - margin.top - margin.bottom);

  // Safe defaults if no data
  const defaultStart = React.useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 1);
    return start;
  }, []);
  const defaultEnd = React.useMemo(() => new Date(), []);

  const [minX, maxX]: [Date, Date] = hasData
    ? (d3.extent(sorted, (d) => d.date) as [Date, Date])
    : [defaultStart, defaultEnd];

  const maxY = hasData ? (d3.max(sorted, (d) => d.value) ?? 0) : 0;

  const x: d3.ScaleTime<number, number> = React.useMemo(() => {
    const s = d3.scaleTime<number, number>();
    return s.domain([minX, maxX]).range([0, iw]);
  }, [minX, maxX, iw]);

  const y: d3.ScaleLinear<number, number> = React.useMemo(() => {
    const s = d3.scaleLinear<number, number>();
    return s.domain([0, Math.max(1, maxY * 1.05)]).range([ih, 0]).nice();
  }, [ih, maxY]);

  const ticksX: Date[] = React.useMemo(() => {
    if (!hasData) {
      return x.ticks(6);
    }

    const desiredTickCount = Math.min(6, sorted.length);

    if (sorted.length === 0) {
      return [];
    }

    if (desiredTickCount <= 1) {
      return [sorted[0].date];
    }

    const ticks: Date[] = [];
    const seen = new Set<number>();

    for (let index = 0; index < desiredTickCount; index += 1) {
      const pointIndex = Math.round((index * (sorted.length - 1)) / (desiredTickCount - 1));
      const tickDate = sorted[pointIndex]?.date;

      if (!tickDate) {
        continue;
      }

      const tickTime = tickDate.getTime();
      if (seen.has(tickTime)) {
        continue;
      }

      seen.add(tickTime);
      ticks.push(tickDate);
    }

    return ticks;
  }, [hasData, sorted, x]);
  const ticksY: number[] = React.useMemo(() => y.ticks(5), [y]);

  const pathD: string | null = React.useMemo(() => {
    if (!hasData) return null;
    return d3.line<TimePoint>()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX)(sorted);
  }, [hasData, sorted, x, y]);

  const dateBisect = React.useMemo(
    () => d3.bisector<TimePoint, Date>((d) => d.date).center,
    []
  );

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<SVGRectElement>) => {
      if (!hasData) return;
      const svg = e.currentTarget.ownerSVGElement!;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const screenCTM = svg.getScreenCTM();
      if (!screenCTM) return;
      const cursor = pt.matrixTransform(screenCTM.inverse());

      const innerX = cursor.x - margin.left;
      if (innerX < 0 || innerX > iw) {
        setHoverIndex(null);
        return;
      }

      const hoveredDate = x.invert(innerX);
      const idx = dateBisect(sorted, hoveredDate);
      setHoverIndex(
        isNaN(idx) ? null : Math.max(0, Math.min(sorted.length - 1, idx))
      );
    },
    [hasData, dateBisect, sorted, x, iw, margin.left]
  );

  const onPointerLeave = React.useCallback(() => setHoverIndex(null), []);

  const hovered = hasData && hoverIndex != null ? sorted[hoverIndex] : null;
  const hx: number | null = hovered ? x(hovered.date) : null;
  const hy: number | null = hovered ? y(hovered.value) : null;

  const formatDate = (d: Date) =>
    d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  return (
    <div ref={containerRef} className="h-full w-full">
      {!hasData ? (
        <div
          className="grid w-full place-items-center text-sm text-muted-foreground"
          style={{ height: resolvedHeight }}
        >
          No data available
        </div>
      ) : (
        <svg width={width} height={resolvedHeight}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* y ticks */}
            {ticksY.map((t, i) => (
              <g key={i} transform={`translate(0,${y(t)})`}>
                <line x1={0} x2={iw} stroke="hsl(var(--border) / 0.5)" />
                <text
                  x={-8}
                  y={0}
                  dominantBaseline="middle"
                  textAnchor="end"
                  fill="hsl(var(--muted-foreground))"
                  fontSize={11}
                >
                  {t}
                </text>
              </g>
            ))}

            {/* x ticks */}
            <g transform={`translate(0,${ih})`}>
              {ticksX.map((t, i) => (
                <g key={i} transform={`translate(${x(t)},0)`}>
                  <line y1={0} y2={6} stroke="hsl(var(--border))" />
                  <text y={16} fill="hsl(var(--muted-foreground))" textAnchor="middle" fontSize={11}>
                    {t.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </text>
                </g>
              ))}
            </g>

            {/* area */}
            {area && pathD && (
              <path 
                d={`${pathD} L ${iw},${ih} L 0,${ih} Z`} 
                fill={color} 
                opacity={0.1}
              />
            )}

            {/* line */}
            {pathD && <path d={pathD} fill="none" stroke={color} strokeWidth={2} />}

            {/* interaction layer */}
            <rect
              x={0}
              y={0}
              width={iw}
              height={ih}
              fill="transparent"
              pointerEvents="all"
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
            />

            {/* hover guide line */}
            {hovered && hx != null && (
              <line
                x1={hx}
                x2={hx}
                y1={0}
                y2={ih}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="4 4"
                shapeRendering="crispEdges"
              />
            )}

            {/* hover dot */}
            {hovered && hx != null && hy != null && (
              <g transform={`translate(${hx},${hy})`}>
                <circle r={4} fill={color} stroke="hsl(var(--background))" strokeWidth={2} />
              </g>
            )}

            {/* tooltip */}
            {hovered && hx != null && hy != null && (
              <GraphTooltip
                x={hx + 8}
                y={hy - 56}
                width={170}
                height={70}
                containerWidth={iw}
                containerHeight={ih}
              >
                <div className="space-y-1">
                  <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{metricLabel}</div>
                  <div className="text-xs font-medium">{formatDate(hovered.date)}</div>
                  <div className="text-sm font-black text-primary">
                    {hovered.value.toLocaleString()}
                  </div>
                </div>
              </GraphTooltip>
            )}
          </g>
        </svg>
      )}
    </div>
  );
}
