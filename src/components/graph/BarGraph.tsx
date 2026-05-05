"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { DataInsightCard } from "./DataInsightCard";
import { cn } from "@/lib/utils";

export interface BarGraphDatum {
  label: string;
  value: number;
}

interface BarGraphProps {
  data?: readonly BarGraphDatum[];
  height?: number;
  fillHeight?: boolean;
  color?: string;
}

export default function BarGraphBlock({
  data = [],
  title,
  description,
  metrics,
  height = 360,
  fillHeight = false,
  color = "hsl(var(--primary))",
  className
}: BarGraphProps & { title?: string; description?: string; metrics?: any[]; className?: string }) {
  return (
    <section className={cn("py-24 px-6", className)}>
      <div className="max-w-6xl mx-auto">
        <DataInsightCard
          title={title}
          description={description}
          metrics={metrics}
        >
          <BarGraph 
            data={data} 
            height={height}
            fillHeight={fillHeight}
            color={color}
          />
        </DataInsightCard>
      </div>
    </section>
  );
}

export function BarGraph({
  data = [],
  height = 360,
  fillHeight = false,
  color = "hsl(var(--primary))",
}: BarGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

  if (data.length === 0) return <div className="h-full w-full flex items-center justify-center text-muted-foreground uppercase text-[10px] font-black">No Data Points</div>;

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(320, entry.contentRect.width));
      if (fillHeight) {
        setContainerHeight(Math.max(220, entry.contentRect.height));
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [fillHeight]);

  const margin = { top: 12, right: 60, bottom: 12, left: 180 };
  const resolvedHeight = fillHeight
    ? Math.max(240, containerHeight ?? height)
    : Math.max(height, data.length * 32 + margin.top + margin.bottom);

  const innerWidth = Math.max(1, width - margin.left - margin.right);
  const innerHeight = Math.max(1, resolvedHeight - margin.top - margin.bottom);

  const y = useMemo(
    () =>
      d3.scaleBand<string>()
        .domain(data.map((datum) => datum.label))
        .range([0, innerHeight])
        .padding(0.2),
    [data, innerHeight],
  );

  const maxValue = useMemo(
    () => data.reduce((max, datum) => Math.max(max, datum.value), 0),
    [data],
  );

  const x = useMemo(
    () => d3.scaleLinear().domain([0, Math.max(1, maxValue)]).range([0, innerWidth]).nice(),
    [innerWidth, maxValue],
  );

  return (
    <div ref={containerRef} className="h-full w-full">
      <svg width={width} height={resolvedHeight} role="img" aria-label="Bar graph">
        <g transform={`translate(${margin.left},${margin.top})`}>
          {data.map((datum) => {
            const yPos = y(datum.label);
            if (yPos === undefined) return null;

            const barWidth = x(datum.value);
            const barHeight = y.bandwidth();

            return (
              <g key={datum.label}>
                {/* Background Track */}
                <rect
                  x={0}
                  y={yPos}
                  width={innerWidth}
                  height={barHeight}
                  fill="hsl(var(--muted))"
                  opacity={0.3}
                  rx={2}
                />
                
                <text
                  x={-12}
                  y={yPos + barHeight / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize={10}
                  fontWeight={700}
                  className="uppercase tracking-tighter"
                >
                  {datum.label}
                </text>
                <rect
                  x={0}
                  y={yPos}
                  width={Math.max(0, barWidth)}
                  height={barHeight}
                  fill={color}
                  opacity={0.9}
                  rx={2}
                />
                <text
                  x={barWidth + 8}
                  y={yPos + barHeight / 2}
                  dominantBaseline="middle"
                  fill="hsl(var(--foreground))"
                  fontSize={11}
                  fontWeight={900}
                  className="tabular-nums"
                >
                  {datum.value.toLocaleString()}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
