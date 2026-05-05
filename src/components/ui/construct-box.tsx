"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";
import SimpleBar from "simplebar-react";

type ConstructBoxProps = HTMLMotionProps<"div"> & {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  strokeClassName?: string;
  strokeWidth?: number;
  cornerRadius?: number;
  scrambleDurationMs?: number;
  scrambleChars?: string;
  scrollable?: boolean;
  maxHeight?: string;
  scrollAreaClassName?: string;
  noPadding?: boolean;
};

const DEFAULT_SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";

function animateScrambleText(
  root: HTMLElement,
  totalDurationMs: number,
  chars: string
) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const targets: Array<{ node: Text; original: string }> = [];

  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const original = node.nodeValue ?? "";
    if (!original.trim()) continue;
    if (node.parentElement?.closest("[data-no-scramble='true']")) continue;
    targets.push({ node, original });
  }

  targets.forEach(({ node, original }, index) => {
    const span = document.createElement("span");
    span.style.whiteSpace = "pre-wrap";
    node.parentNode?.replaceChild(span, node);

    const localDuration = Math.max(260, totalDurationMs + index * 32);
    const start = performance.now();

    const frame = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / localDuration);
      const revealCount = Math.floor(original.length * progress);

      const next = original
        .split("")
        .map((ch, i) => {
          if (/\s/.test(ch)) return ch;
          if (i < revealCount) return ch;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      span.textContent = progress >= 1 ? original : next;
      if (progress < 1) requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  });
}

export function ConstructBox({
  children,
  className,
  delay = 0,
  duration = 3,
  amount = 0.2,
  once = true,
  transition,
  strokeClassName = "stroke-primary/40",
  strokeWidth = 1,
  cornerRadius = 0,
  scrambleDurationMs = 800,
  scrambleChars = DEFAULT_SCRAMBLE_CHARS,
  scrollable = false,
  maxHeight = "auto",
  scrollAreaClassName,
  noPadding = false,
  style,
  ...props
}: ConstructBoxProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const rectMeasureRef = React.useRef<SVGRectElement | null>(null);

  const isInView = useInView(ref, { once, amount });
  const shouldReduceMotion = useReducedMotion();
  const hasScrambledRef = React.useRef(false);
  const [pathLength, setPathLength] = React.useState(0);

  const childDelay = delay + duration * 0.5;
  const childDuration = Math.max(0.4, duration * 0.5);

  React.useLayoutEffect(() => {
    if (!rectMeasureRef.current) return;
    setPathLength(rectMeasureRef.current.getTotalLength());
  }, []);

  React.useEffect(() => {
    if (!ref.current || !isInView || hasScrambledRef.current) return;
    hasScrambledRef.current = true;

    if (shouldReduceMotion) return;

    const timeout = window.setTimeout(() => {
      if (!ref.current) return;
      animateScrambleText(ref.current, scrambleDurationMs, scrambleChars);
    }, Math.max(0, childDelay * 1000));

    return () => window.clearTimeout(timeout);
  }, [
    isInView,
    childDelay,
    scrambleDurationMs,
    scrambleChars,
    shouldReduceMotion,
  ]);

  const dash = pathLength > 0 ? `${pathLength} ${pathLength}` : undefined;

  const content = (
    <motion.div
      className="relative z-10 min-w-0"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        delay: childDelay,
        duration: childDuration,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );

  return (
    <motion.div
      ref={ref}
      className={cn(
        "relative w-full min-w-0 box-border bg-transparent",
        !noPadding && "p-4",
        className
      )}
      style={style}
      {...props}
    >
      {scrollable ? (
        <SimpleBar
          style={{ maxHeight }}
          className={cn("relative z-10 min-w-0", scrollAreaClassName)}
          autoHide={false}
        >
          {content}
        </SimpleBar>
      ) : (
        content
      )}

      <svg
        aria-hidden="true"
        data-no-scramble="true"
        className="pointer-events-none absolute inset-0 w-full h-full"
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <rect
          ref={rectMeasureRef}
          x="0.5"
          y="0.5"
          width="99"
          height="99"
          rx={cornerRadius}
          ry={cornerRadius}
          fill="none"
          stroke="transparent"
          strokeWidth={strokeWidth}
        />

        {pathLength > 0 && (
          <motion.rect
            x="0.5"
            y="0.5"
            width="99"
            height="99"
            rx={cornerRadius}
            ry={cornerRadius}
            fill="none"
            className={strokeClassName}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            strokeLinejoin="miter"
            strokeDasharray={dash}
            initial={{ strokeDashoffset: pathLength }}
            animate={isInView ? { strokeDashoffset: 0 } : { strokeDashoffset: pathLength }}
            transition={{
              delay,
              duration,
              ease: "easeInOut",
            }}
          />
        )}
      </svg>
    </motion.div>
  );
}
