"use client";

import * as React from "react";

type GraphTooltipProps = {
  x: number;
  y: number;
  containerWidth: number;
  containerHeight: number;
  width?: number;
  height?: number;
  children: React.ReactNode;
  className?: string;
};

export function GraphTooltip({
  x,
  y,
  containerWidth,
  containerHeight,
  width = 180,
  height = 72,
  children,
  className,
}: GraphTooltipProps) {
  const clampedX = Math.min(Math.max(x, 0), Math.max(0, containerWidth - width));
  const clampedY = Math.min(Math.max(y, 0), Math.max(0, containerHeight - height));

  return (
    <foreignObject
      x={clampedX}
      y={clampedY}
      width={width}
      height={height}
      className="pointer-events-none overflow-visible"
    >
      <div
        className={
          className ??
          "rounded-md border border-zinc-200 bg-white/95 p-2 text-[11px] shadow-sm backdrop-blur-sm"
        }
      >
        {children}
      </div>
    </foreignObject>
  );
}

export default GraphTooltip;
