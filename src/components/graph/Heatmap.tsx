"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { DataInsightCard } from "./DataInsightCard";
import { cn } from "@/lib/utils";

export interface HeatmapDatum {
  x: number;
  y: number;
  value: number;
}

interface HeatmapProps {
  data?: HeatmapDatum[];
  xLabels?: string[];
  yLabels?: string[];
  height?: number;
  colorRange?: [string, string];
  valueFormatter?: (value: number) => string;
  fillHeight?: boolean;
}

export default function HeatmapBlock({
  data = [],
  xLabels = [],
  yLabels = [],
  title,
  description,
  metrics,
  height = 360,
  colorRange = ["hsl(var(--muted))", "hsl(var(--primary))"],
  valueFormatter = (value) => value.toLocaleString(),
  fillHeight = false,
  className,
}: HeatmapProps & { title?: string; description?: string; metrics?: any[]; className?: string }) {
  return (
    <section className={cn("py-24 px-6", className)}>
      <div className="max-w-6xl mx-auto">
        <DataInsightCard
          title={title}
          description={description}
          metrics={metrics}
          chartPosition="left"
        >
          <Heatmap
            data={data}
            xLabels={xLabels}
            yLabels={yLabels}
            height={height}
            colorRange={colorRange}
            valueFormatter={valueFormatter}
            fillHeight={fillHeight}
          />
        </DataInsightCard>
      </div>
    </section>
  );
}

export function Heatmap({
  data = [],
  xLabels = [],
  yLabels = [],
  height = 360,
  colorRange = ["hsl(var(--muted))", "hsl(var(--primary))"],
  valueFormatter = (value) => value.toLocaleString(),
  fillHeight = false,
}: HeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(320, entry.contentRect.width));
      if (fillHeight) {
        setContainerHeight(Math.max(200, entry.contentRect.height));
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [fillHeight]);

  const normalizedData = useMemo(() =>
    data.map((datum) => ({
      x: datum.x,
      y: datum.y,
      value: Number.isFinite(datum.value) ? datum.value : 0,
    })),
    [data]);

  const valueMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const datum of normalizedData) {
      const key = `${datum.x}|${datum.y}`;
      map.set(key, Math.max(0, datum.value));
    }
    return map;
  }, [normalizedData]);

  const inferredXLabels = useMemo(() => {
    if (xLabels.length > 0) return xLabels;
    const max = normalizedData.reduce((m, d) => Math.max(m, d.x), 0);
    return Array.from({ length: max + 1 }, (_, i) => `${i}`);
  }, [xLabels, normalizedData]);

  const inferredYLabels = useMemo(() => {
    if (yLabels.length > 0) return yLabels;
    const max = normalizedData.reduce((m, d) => Math.max(m, d.y), 0);
    return Array.from({ length: max + 1 }, (_, i) => `${i}`);
  }, [yLabels, normalizedData]);

  const margin = useMemo(
    () => ({ top: 16, right: 12, bottom: 40, left: 72 }),
    [],
  );

  const resolvedHeight = fillHeight
    ? Math.max(240, containerHeight ?? height)
    : height;

  const innerWidth = Math.max(1, width - margin.left - margin.right);
  const innerHeight = Math.max(1, resolvedHeight - margin.top - margin.bottom);

  const cellWidth = innerWidth / Math.max(1, inferredXLabels.length);
  const cellHeight = innerHeight / Math.max(1, inferredYLabels.length);

  const maxValue = useMemo(
    () => normalizedData.reduce((max, datum) => Math.max(max, datum.value), 0),
    [normalizedData],
  );

  const colorScale = useMemo(
    () =>
      d3.scaleLinear<string>()
        .domain([0, maxValue || 1])
        .range(colorRange)
        .clamp(true),
    [colorRange, maxValue],
  );

  const getValue = (x: number, y: number) => valueMap.get(`${x}|${y}`) ?? 0;

  return (
    <div ref={containerRef} className="h-full w-full">
      <svg width={width} height={resolvedHeight} role="img" aria-label="Heatmap">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* cells */}
          {inferredYLabels.map((_, rowIndex) =>
            inferredXLabels.map((_, colIndex) => {
              const value = getValue(colIndex, rowIndex);
              const fill = value === 0 ? "hsl(var(--muted) / 0.2)" : colorScale(value);

              return (
                <rect
                  key={`${colIndex}-${rowIndex}`}
                  x={colIndex * cellWidth}
                  y={rowIndex * cellHeight}
                  width={Math.max(0, cellWidth - 1)}
                  height={Math.max(0, cellHeight - 1)}
                  fill={fill}
                  rx={2}
                >
                  <title>{`${inferredYLabels[rowIndex]}, ${inferredXLabels[colIndex]}: ${valueFormatter(value)}`}</title>
                </rect>
              );
            }),
          )}

          {/* y-axis labels */}
          {inferredYLabels.map((label, rowIndex) => (
            <text
              key={label}
              x={-12}
              y={rowIndex * cellHeight + cellHeight / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={10}
              fontWeight="bold"
              fill="hsl(var(--muted-foreground))"
              className="uppercase tracking-tighter"
            >
              {label}
            </text>
          ))}

          {/* x-axis labels */}
          {inferredXLabels.map((label, colIndex) => (
            <text
              key={label}
              x={colIndex * cellWidth + cellWidth / 2}
              y={innerHeight + 16}
              textAnchor="middle"
              dominantBaseline="hanging"
              fontSize={10}
              fontWeight="bold"
              fill="hsl(var(--muted-foreground))"
              className="uppercase tracking-tighter"
            >
              {label}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
