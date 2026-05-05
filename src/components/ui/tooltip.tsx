"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type ChildMouseHandlers = {
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
};

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement<ChildMouseHandlers>;
  side?: "top" | "bottom" | "left" | "right";
  delayMs?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = "top",
  delayMs = 200,
  className,
}: TooltipProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [coords, setCoords] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const timer = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  function handleEnter(e: React.MouseEvent | React.FocusEvent) {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    setCoords({ x, y });
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delayMs);
  }

  function handleLeave() {
    if (timer.current) window.clearTimeout(timer.current);
    setOpen(false);
  }

  const child = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      children.props.onMouseEnter?.(e);
      handleEnter(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props.onMouseLeave?.(e);
      handleLeave();
    },
    onFocus: (e: React.FocusEvent) => {
      children.props.onFocus?.(e);
      handleEnter(e);
    },
    onBlur: (e: React.FocusEvent) => {
      children.props.onBlur?.(e);
      handleLeave();
    },
  });

  return (
    <>
      {child}
      {open &&
        createPortal(
          <div
            ref={ref}
            className={cn(
              "pointer-events-none fixed z-50 rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs shadow-md",
              "text-zinc-800",
              className
            )}
            style={{
              left:
                side === "left"
                  ? coords.x - 12
                  : side === "right"
                  ? coords.x + 12
                  : coords.x,
              top:
                side === "top"
                  ? coords.y - 24
                  : side === "bottom"
                  ? coords.y + 24
                  : coords.y,
              transform:
                side === "top"
                  ? "translate(-50%, -100%)"
                  : side === "bottom"
                  ? "translate(-50%, 0)"
                  : side === "left"
                  ? "translate(-100%, -50%)"
                  : "translate(0, -50%)",
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
