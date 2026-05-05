"use client";

import * as React from "react";
import * as d3 from "d3";

import { GraphTooltip } from "./GraphTooltip";

export interface StackedDatum {
  period: string;
  [key: string]: number | string | Date;
}

export interface StackedAreaChartProps {
  data?: StackedDatum[];
  height?: number;
  fillHeight?: boolean;
  keys?: string[];
  margin?: { top: number; right: number; bottom: number; left: number };
  seriesType?: "default" | "country" | "event-type";
}

type GroupedStackedDatum = {
  date: Date;
  [key: string]: number | Date;
};

const STACKED_CHART_COLORS = [
  "#0f766e",
  "#2563eb",
  "#9333ea",
  "#ea580c",
  "#dc2626",
  "#65a30d",
];

export function StackedAreaChart({
  data = [],
  height: initialHeight = 240,
  fillHeight = false,
  keys = [],
  margin = { top: 20, right: 16, bottom: 32, left: 48 },
  seriesType = "default",
}: StackedAreaChartProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [size, setSize] = React.useState(() => ({
    width: 600,
    height: initialHeight,
  }));

  React.useEffect(() => {
    if (!containerRef.current) return;

    const minWidth = 320;
    const minHeight = 160;

    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const { width, height } = entry.contentRect;

      setSize((prev) => ({
        width: Math.max(minWidth, width || prev.width || 0),
        height: fillHeight
          ? Math.max(minHeight, height || prev.height || minHeight)
          : initialHeight,
      }));
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [fillHeight, initialHeight]);

  const hasData = data.length > 0;
  const parseMonth = React.useMemo(() => d3.timeParse("%Y-%m"), []);
  const parseDay = React.useMemo(() => d3.timeParse("%Y-%m-%d"), []);

  const parsedData = React.useMemo<Array<StackedDatum & { date: Date }>>(() => {
    if (!hasData) return [];

    return data.map((datum) => ({
      ...datum,
      date: parseDay?.(datum.period) ?? parseMonth?.(datum.period) ?? new Date(datum.period),
    }));
  }, [data, hasData, parseDay, parseMonth]);

  const [now] = React.useState(() => Date.now());
  const defaultStart = new Date(now - 24 * 60 * 60 * 1000);
  const defaultEnd = new Date(now);

  const groupedByDate = React.useMemo<GroupedStackedDatum[]>(() => {
    const map = new Map<number, GroupedStackedDatum>();

    parsedData.forEach((datum) => {
      const key = datum.date.getTime();
      const existing = map.get(key) ?? { date: datum.date };

      keys.forEach((seriesKey) => {
        const raw = datum[seriesKey];
        if (typeof raw === "number") {
          existing[seriesKey] = raw;
        }
      });

      map.set(key, existing);
    });

    return Array.from(map.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [keys, parsedData]);

  const stackedSeries = React.useMemo(
    () =>
      d3.stack<GroupedStackedDatum, string>()
        .keys(keys)
        .value((datum, key) => (typeof datum[key] === "number" ? datum[key] : 0))(groupedByDate),
    [groupedByDate, keys]
  );

  const [minX, maxX]: [Date, Date] = hasData
    ? (d3.extent(groupedByDate, (datum) => datum.date) as [Date, Date])
    : [defaultStart, defaultEnd];

  const maxY = hasData ? d3.max(stackedSeries, (layer) => d3.max(layer, (datum) => datum[1])) ?? 0 : 0;

  const svgWidth = size.width;
  const svgHeight = size.height;
  const iw = Math.max(0, svgWidth - margin.left - margin.right);
  const ih = Math.max(0, svgHeight - margin.top - margin.bottom);

  const x = React.useMemo(
    () => d3.scaleTime<number, number>().domain([minX, maxX]).range([0, iw]),
    [iw, maxX, minX]
  );

  const y = React.useMemo(
    () =>
      d3.scaleLinear<number, number>()
        .domain([0, Math.max(1, maxY * 1.05)])
        .range([ih, 0])
        .nice(),
    [ih, maxY]
  );

  const color = React.useMemo(
    () => d3.scaleOrdinal<string, string>().domain(keys).range(STACKED_CHART_COLORS),
    [keys]
  );

  const getSeriesColor = React.useCallback((key: string) => color(key), [color]);

  const area = React.useMemo(
    () =>
      d3.area<d3.SeriesPoint<GroupedStackedDatum>>()
        .x((datum) => x(datum.data.date))
        .y0((datum) => y(datum[0]))
        .y1((datum) => y(datum[1]))
        .curve(d3.curveMonotoneX),
    [x, y]
  );

  const ticksX: Date[] = React.useMemo(() => {
    if (!hasData) {
      return x.ticks(6);
    }

    const desiredTickCount = Math.min(6, groupedByDate.length);

    if (desiredTickCount <= 1) {
      return [groupedByDate[0].date];
    }

    const ticks: Date[] = [];
    const seen = new Set<number>();

    for (let index = 0; index < desiredTickCount; index += 1) {
      const pointIndex = Math.round((index * (groupedByDate.length - 1)) / (desiredTickCount - 1));
      const tickDate = groupedByDate[pointIndex]?.date;

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
  }, [groupedByDate, hasData, x]);
  const ticksY = React.useMemo(() => y.ticks(5), [y]);

  const axisColor = "hsl(var(--border))";
  const gridColor = "hsl(var(--muted) / 0.72)";
  const labelColor = "hsl(var(--muted-foreground))";
  const hoverGuideColor = "hsl(var(--muted-foreground))";

  const dateBisect = React.useMemo(() => d3.bisector<GroupedStackedDatum, Date>((datum) => datum.date).center, []);

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent<SVGRectElement>) => {
      if (!hasData || groupedByDate.length === 0) return;

      const svg = e.currentTarget.ownerSVGElement;
      if (!svg) return;

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
      const idx = dateBisect(groupedByDate, hoveredDate);
      setHoverIndex(isNaN(idx) ? null : Math.max(0, Math.min(groupedByDate.length - 1, idx)));
    },
    [dateBisect, groupedByDate, hasData, iw, margin.left, x]
  );

  const onPointerLeave = React.useCallback(() => setHoverIndex(null), []);

  const hovered = hasData && hoverIndex != null ? groupedByDate[hoverIndex] : null;
  const hx = hovered ? x(hovered.date) : null;
  const tooltipKeys = hovered
    ? keys.filter((key) => (typeof hovered[key] === "number" ? hovered[key] : 0) > 1)
    : [];
  const totalAtHover = hovered
    ? keys.reduce((sum, key) => sum + (typeof hovered[key] === "number" ? hovered[key] : 0), 0)
    : 0;
  const hy = hovered ? y(totalAtHover) : null;
  const tooltipHeight = Math.max(72, 28 + tooltipKeys.length * 18);

  return (
    <div ref={containerRef} className="h-full w-full">
      {!hasData ? (
        <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">
          No data
        </div>
      ) : (
        <svg width={svgWidth} height={svgHeight}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            <line x1={0} y1={ih} x2={iw} y2={ih} stroke={axisColor} />
            <line x1={0} y1={0} x2={0} y2={ih} stroke={axisColor} />

            {ticksY.map((tick, index) => (
              <g key={index} transform={`translate(0,${y(tick)})`}>
                <line x1={0} x2={iw} stroke={gridColor} />
                <text
                  x={-8}
                  y={0}
                  dominantBaseline="middle"
                  textAnchor="end"
                  fill={labelColor}
                  fontSize={11}
                >
                  {tick}
                </text>
              </g>
            ))}

            <g transform={`translate(0,${ih})`}>
              {ticksX.map((tick, index) => (
                <g key={index} transform={`translate(${x(tick)},0)`}>
                  <line y1={0} y2={6} stroke={axisColor} />
                  <text y={16} fill={labelColor} textAnchor="middle" fontSize={11}>
                    {tick.toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </text>
                </g>
              ))}
            </g>

            {stackedSeries.map((layer, index) => (
              <path
                key={layer.key || index}
                d={area(layer) ?? undefined}
                fill={getSeriesColor(layer.key)}
                opacity={0.3}
              />
            ))}

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

            {hovered && hx != null && (
              <line
                x1={hx}
                x2={hx}
                y1={0}
                y2={ih}
                stroke={hoverGuideColor}
                strokeDasharray="3 3"
                shapeRendering="crispEdges"
              />
            )}

            {hovered && hx != null && hy != null && (
              <GraphTooltip
                x={hx + 8}
                y={hy - 64}
                width={190}
                height={tooltipHeight}
                containerWidth={iw}
                containerHeight={ih}
              >
                <div className="font-semibold">
                  {hovered.date.toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                {tooltipKeys.map((key) => (
                <div key={key} className="mt-1 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: getSeriesColor(key) }}
                    />
                    <span>{key}</span>
                  </div>
                    <span className="font-medium">
                      {(typeof hovered[key] === "number" ? hovered[key] : 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </GraphTooltip>
            )}
          </g>

          <g transform={`translate(${margin.left},${svgHeight - 6})`}>
           
          </g>
        </svg>
      )}
    </div>
  );
}

export default StackedAreaChart;
