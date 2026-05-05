"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import * as d3 from "d3";

import { Tooltip } from "@/components/ui/tooltip";

export type FormNavigationTraceStep = {
  action: "analyze" | "click" | "login";
  outcome:
    | "extracted"
    | "advanced"
    | "stopped"
    | "authenticated"
    | "login_required";
  reason: string;
  target: string | null;
};

type FormNavigationTraceProps = {
  steps?: FormNavigationTraceStep[];
  isLoading?: boolean;
  statusMessage?: string | null;
  compact?: boolean;
  showIdlePlaceholder?: boolean;
};

function getStepIcon(step: FormNavigationTraceStep) {
  if (step.outcome === "authenticated") return "mdi:lock-open-check-outline";
  if (step.outcome === "login_required") return "mdi:lock-outline";
  if (step.outcome === "advanced") return "mdi:cursor-default-click-outline";
  if (step.outcome === "extracted") return "mdi:file-document-check-outline";
  if (step.outcome === "stopped") return "mdi:stop-circle-outline";
  if (step.action === "login") return "mdi:login";
  if (step.action === "click") return "mdi:gesture-tap-button";
  return "mdi:magnify";
}

function getStepTone(step: FormNavigationTraceStep) {
  if (step.outcome === "authenticated" || step.outcome === "extracted") {
    return {
      dot: "bg-emerald-600 border-emerald-700 text-white",
      line: "#059669",
    };
  }

  if (step.outcome === "login_required" || step.outcome === "stopped") {
    return {
      dot: "bg-amber-500 border-amber-600 text-white",
      line: "#f59e0b",
    };
  }

  return {
    dot: "bg-blue-600 border-blue-700 text-white",
    line: "#2563eb",
  };
}

function truncateText(value: string | null, fallback: string) {
  const text = (value ?? "").trim();
  if (!text) return fallback;
  return text;
}

function getPendingStepIcon(statusMessage: string | null) {
  const message = (statusMessage ?? "").toLowerCase();

  if (message.includes("login")) {
    return "mdi:login";
  }

  if (message.includes("credential") || message.includes("password")) {
    return "mdi:key-variant";
  }

  if (message.includes("click")) {
    return "mdi:cursor-default-click-outline";
  }

  if (message.includes("fill")) {
    return "mdi:text-box-edit-outline";
  }

  if (message.includes("form")) {
    return "mdi:file-document-edit-outline";
  }

  if (message.includes("wait")) {
    return "mdi:timer-sand";
  }

  if (message.includes("open") || message.includes("page")) {
    return "mdi:web";
  }

  return "mdi:magnify";
}

function PendingStepNode({
  statusMessage,
  compact,
}: {
  statusMessage: string | null;
  compact: boolean;
}) {
  return (
    <div
      className={[
        "relative flex items-center justify-center rounded-full border-2 border-zinc-300 bg-zinc-200 text-zinc-500 shadow-sm",
        compact ? "h-8 w-8" : "h-11 w-11",
      ].join(" ")}
    >
      <Icon icon="svg-spinners:90-ring-with-bg" className="absolute inset-0 h-full w-full text-zinc-400" />
      <Icon
        icon={getPendingStepIcon(statusMessage)}
        className={[
          "relative z-10 text-zinc-700",
          compact ? "h-3.5 w-3.5" : "h-4.5 w-4.5",
        ].join(" ")}
      />
    </div>
  );
}

function IdleStepNode({ compact }: { compact: boolean }) {
  return (
    <div
      className={[
        "flex items-center justify-center rounded-full border-2 border-zinc-300 bg-zinc-200 text-zinc-500 shadow-sm",
        compact ? "h-8 w-8" : "h-11 w-11",
      ].join(" ")}
    >
      <Icon
        icon="mdi:circle-small"
        className={compact ? "h-4 w-4" : "h-5 w-5"}
      />
    </div>
  );
}

export function FormNavigationTrace({
  steps = [],
  isLoading = false,
  statusMessage = null,
  compact = false,
  showIdlePlaceholder = false,
}: FormNavigationTraceProps) {
  const nodeSize = compact ? 32 : 44;
  const halfNodeSize = nodeSize / 2;
  const nodeSpacing = compact ? 64 : 180;
  const lineY = compact ? 16 : 28;
  const svgHeight = compact ? 32 : 56;
  const viewBoxHeight = compact ? 48 : 88;
  const nodeCount = steps.length + (isLoading ? 1 : 0);
  const width = Math.max(compact ? 112 : 320, Math.max(nodeCount, 1) * nodeSpacing);
  const scale = React.useMemo(
    () =>
      d3.scalePoint<number>()
        .domain(Array.from({ length: Math.max(nodeCount, 1) }, (_, index) => index))
        .range([halfNodeSize, width - halfNodeSize]),
    [halfNodeSize, nodeCount, width],
  );

  if (steps.length === 0 && !isLoading && !showIdlePlaceholder) {
    return null;
  }

  if (steps.length === 0 && !isLoading && showIdlePlaceholder) {
    return (
      <div className={compact ? "overflow-x-auto" : "mt-3 overflow-x-auto"}>
        <div className="relative" style={{ width }}>
          <svg
            width={width}
            height={svgHeight}
            viewBox={`0 0 ${width} ${viewBoxHeight}`}
            className="block"
            aria-label="Navigation trace"
            role="img"
          />

          <div
            className="absolute top-0"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              width: nodeSize,
            }}
          >
            <div className="flex flex-col items-center text-center">
              <IdleStepNode compact={compact} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (steps.length === 0 && isLoading) {
    return (
      <div className={compact ? "overflow-x-auto" : "mt-3 overflow-x-auto"}>
        <div className="relative" style={{ width }}>
          <svg
            width={width}
            height={svgHeight}
            viewBox={`0 0 ${width} ${viewBoxHeight}`}
            className="block"
            aria-label="Navigation trace"
            role="img"
          />

          <div
            className="absolute top-0"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              width: nodeSize,
            }}
          >
            <div className="flex flex-col items-center text-center">
              <PendingStepNode statusMessage={statusMessage} compact={compact} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className={compact ? "overflow-x-auto" : "mt-3 overflow-x-auto"}>
        <div className="relative" style={{ width }}>
          <svg
            width={width}
            height={svgHeight}
            viewBox={`0 0 ${width} ${viewBoxHeight}`}
            className="block"
            aria-label="Navigation trace"
            role="img"
          >
            {steps.slice(0, -1).map((step, index) => {
              const x1 = scale(index) ?? 32;
              const x2 = scale(index + 1) ?? x1;
              const tone = getStepTone(step);

              return (
                <line
                  key={`line-${index}`}
                  x1={x1}
                  y1={lineY}
                  x2={x2}
                  y2={lineY}
                  stroke={tone.line}
                  strokeWidth={3}
                  strokeLinecap="round"
                  opacity={0.35}
                />
              );
            })}
            {isLoading && steps.length > 0 ? (
              <line
                x1={scale(steps.length - 1) ?? halfNodeSize}
                y1={lineY}
                x2={scale(steps.length) ?? width - halfNodeSize}
                y2={lineY}
                stroke="#d4d4d8"
                strokeWidth={3}
                strokeLinecap="round"
                opacity={0.8}
              />
            ) : null}
          </svg>

          {steps.map((step, index) => {
            const x = scale(index) ?? 32;
            const tone = getStepTone(step);

            return (
              <div
                key={`${step.action}-${step.outcome}-${index}`}
                className="absolute top-0"
                style={{
                  left: `${(x / width) * 100}%`,
                  transform: "translateX(-50%)",
                  width: nodeSize,
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <Tooltip
                    side="bottom"
                    content={
                      <div className="w-72 max-w-[min(18rem,calc(100vw-2rem))] space-y-1 text-left">
                        <div className="text-xs font-medium text-zinc-900">
                          {truncateText(step.target, "No target")}
                        </div>
                        <div className="text-[11px] leading-4 text-zinc-500">
                          {step.reason}
                        </div>
                      </div>
                    }
                  >
                    <button
                      type="button"
                      aria-label={`${truncateText(step.target, "No target")}: ${step.reason}`}
                      className={[
                        compact
                          ? "flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-sm transition duration-150 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:scale-105 focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300"
                          : "flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-sm transition duration-150 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:scale-105 focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300",
                        tone.dot,
                      ].join(" ")}
                    >
                      <Icon
                        icon={getStepIcon(step)}
                        className={compact ? "h-4 w-4" : "h-5 w-5"}
                      />
                    </button>
                  </Tooltip>
                </div>
              </div>
            );
          })}

          {isLoading && steps.length > 0 ? (
            <div
              className="absolute top-0"
              style={{
                left: `${(((scale(steps.length) ?? width - halfNodeSize) / width) * 100)}%`,
                transform: "translateX(-50%)",
                width: nodeSize,
              }}
            >
              <div className="flex flex-col items-center text-center">
                <PendingStepNode statusMessage={statusMessage} compact={compact} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
  );
}

export default FormNavigationTrace;
