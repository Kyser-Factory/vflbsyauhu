"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { GraphTooltip } from "./GraphTooltip";

export interface PieChartDatum {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data?: PieChartDatum[];
  width?: number;
  height?: number;
  innerRadius?: number;
  className?: string;
}

const PIE_CHART_PALETTE = [
  "hsl(var(--primary))",
  "hsl(var(--tertiary))",
  "hsl(var(--quaternary))",
  "hsl(var(--accent))",
  "hsl(var(--secondary))",
  "hsl(var(--primary) / 0.7)",
  "hsl(var(--tertiary) / 0.7)",
  "hsl(var(--quaternary) / 0.7)",
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
  innerRadius = 0,
) {
  const startOuter = polarToCartesian(cx, cy, outerRadius, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerRadius, startAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  if (innerRadius <= 0) {
    return [
      `M ${cx} ${cy}`,
      `L ${endOuter.x} ${endOuter.y}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${startOuter.x} ${startOuter.y}`,
      "Z",
    ].join(" ");
  }

  const startInner = polarToCartesian(cx, cy, innerRadius, endAngle);
  const endInner = polarToCartesian(cx, cy, innerRadius, startAngle);

  return [
    `M ${endOuter.x} ${endOuter.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${startOuter.x} ${startOuter.y}`,
    `L ${startInner.x} ${startInner.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${endInner.x} ${endInner.y}`,
    "Z",
  ].join(" ");
}

function getArcMidpoint(
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  return polarToCartesian(cx, cy, radius, startAngle + (endAngle - startAngle) / 2);
}

import { DataInsightCard } from "./DataInsightCard";

export default function PieChartBlock({
  data = [],
  title,
  description,
  metrics,
  innerRadius = 0,
  className,
}: PieChartProps & { title?: string; description?: string; metrics?: any[] }) {
  return (
    <section className={cn("py-24 px-6", className)}>
      <div className="max-w-6xl mx-auto">
        <DataInsightCard
          title={title}
          description={description}
          metrics={metrics}
        >
          <PieChart 
            data={data} 
            innerRadius={innerRadius} 
            width={500} 
            height={360} 
          />
        </DataInsightCard>
      </div>
    </section>
  );
}

export function PieChart({
  data = [],
  width: initialWidth = 640,
  height: initialHeight = 360,
  innerRadius = 0,
  className,
}: PieChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [size, setSize] = useState(() => ({
    width: initialWidth,
    height: initialHeight,
  }));
  const safeData = useMemo(
    () => data.filter((datum) => Number(datum.value) > 0),
    [data],
  );

  const total = useMemo(
    () => safeData.reduce((sum, datum) => sum + datum.value, 0),
    [safeData],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const minWidth = 240;
    const minHeight = initialHeight;

    const ro = new ResizeObserver(([entry]) => {
      if (!entry) return;

      const { width, height } = entry.contentRect;
      setSize((prev) => ({
        width: Math.max(minWidth, width || prev.width || 0),
        height: Math.max(minHeight, height || prev.height || minHeight),
      }));
    });

    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [initialHeight]);

  const width = size.width;
  const height = size.height;

  const margin = 24;
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.max(20, Math.min(width, height) / 2 - margin);

  const slices = useMemo(() => {
    if (total <= 0) return [];

    let currentAngle = 0;

    return safeData.map((datum, index) => {
      const angle = (datum.value / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const fill = datum.color ?? PIE_CHART_PALETTE[index % PIE_CHART_PALETTE.length];
      const percent = (datum.value / total) * 100;

      return {
        ...datum,
        fill,
        percent,
        startAngle,
        endAngle,
        midpoint: getArcMidpoint(cx, cy, radius * 0.62, startAngle, endAngle),
        path: describeArc(cx, cy, radius, startAngle, endAngle, innerRadius),
      };
    });
  }, [safeData, total, cx, cy, radius, innerRadius]);

  const activeSlice =
    hoveredSlice == null
      ? null
      : slices.find((slice) => slice.label === hoveredSlice) ?? null;

  if (total <= 0) {
    return (
      <div ref={containerRef} className="h-full w-full">
        <svg className={className} width={width} height={height} role="img" aria-label="Pie chart" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full w-full">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className={className}
        role="img"
        aria-label="Pie chart"
      >
        <g>
          {slices.map((slice) => (
            <g
              key={slice.label}
              transform={
                hoveredSlice === slice.label
                  ? `translate(${getSliceOffsetX(slice.startAngle, slice.endAngle)}, ${getSliceOffsetY(
                      slice.startAngle,
                      slice.endAngle,
                    )})`
                  : undefined
              }
              className="transition-transform duration-150 ease-out"
            >
              <path
                d={slice.path}
                fill={slice.fill}
                stroke="hsl(var(--card))"
                strokeWidth={1}
                onMouseEnter={() => setHoveredSlice(slice.label)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            </g>
          ))}
        </g>

        {activeSlice ? (
          <GraphTooltip
            x={activeSlice.midpoint.x + 16}
            y={activeSlice.midpoint.y - 34}
            width={170}
            height={70}
            containerWidth={width}
            containerHeight={height}
          >
            <div className="font-semibold">{activeSlice.label}</div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <span>Count</span>
              <span className="font-medium">{activeSlice.value.toLocaleString()}</span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <span>Share</span>
              <span className="font-medium">{activeSlice.percent.toFixed(1)}%</span>
            </div>
          </GraphTooltip>
        ) : null}

      </svg>
    </div>
  );
}

function getSliceOffsetX(startAngle: number, endAngle: number) {
  const midpoint = startAngle + (endAngle - startAngle) / 2;
  const angleRad = ((midpoint - 90) * Math.PI) / 180;
  return Math.cos(angleRad) * 10;
}

function getSliceOffsetY(startAngle: number, endAngle: number) {
  const midpoint = startAngle + (endAngle - startAngle) / 2;
  const angleRad = ((midpoint - 90) * Math.PI) / 180;
  return Math.sin(angleRad) * 10;
}
