"use client";

import * as React from "react";
import { Icon } from "@iconify/react";
import * as d3 from "d3";
import { Tooltip } from "@/components/ui/tooltip";
import { DataInsightCard } from "./DataInsightCard";
import { cn } from "@/lib/utils";

export type AgentProcessGraphStep = {
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

export type GenericStep = {
  id: string;
  label: string;
  status: "complete" | "active" | "pending";
  icon: string;
};

type AgentProcessGraphProps = {
  steps?: (AgentProcessGraphStep | GenericStep)[];
  isLoading?: boolean;
  awaitingUserInput?: boolean;
  statusMessage?: string | null;
  compact?: boolean;
  showIdlePlaceholder?: boolean;
};

const STEP_ICON_BY_OUTCOME = {
  authenticated: "mdi:shield-check",
  login_required: "mdi:shield-lock-outline",
  advanced: "mdi:chevron-right-circle",
  extracted: "mdi:form-select",
  stopped: "mdi:stop-circle-outline",
} as const satisfies Partial<Record<AgentProcessGraphStep["outcome"], string>>;

const STEP_ICON_BY_ACTION = {
  login: "mdi:login",
  click: "mdi:cursor-default-click-outline",
  analyze: "mdi:analysis",
} as const satisfies Record<AgentProcessGraphStep["action"], string>;

function isGenericStep(step: any): step is GenericStep {
  return step && typeof step === 'object' && 'label' in step && 'status' in step;
}

function getStepIcon(step: AgentProcessGraphStep | GenericStep) {
  if (isGenericStep(step)) return step.icon;
  return STEP_ICON_BY_OUTCOME[step.outcome] ?? STEP_ICON_BY_ACTION[step.action];
}

function getStepTone(step: AgentProcessGraphStep | GenericStep) {
  if (isGenericStep(step)) {
    if (step.status === "complete") {
      return {
        dot: "bg-primary border-primary/20 text-primary-foreground",
        line: "hsl(var(--primary))",
      };
    }
    if (step.status === "active") {
      return {
        dot: "bg-primary/80 border-primary/10 text-primary-foreground",
        line: "hsl(var(--primary) / 0.8)",
      };
    }
    return {
      dot: "bg-muted border-muted/20 text-muted-foreground",
      line: "hsl(var(--muted))",
    };
  }

  if (step.outcome === "authenticated" || step.outcome === "extracted") {
    return {
      dot: "bg-primary border-primary/20 text-primary-foreground",
      line: "hsl(var(--primary))",
    };
  }

  if (step.outcome === "login_required" || step.outcome === "stopped") {
    return {
      dot: "bg-accent border-accent/20 text-accent-foreground",
      line: "hsl(var(--accent))",
    };
  }

  return {
    dot: "bg-primary/80 border-primary/10 text-primary-foreground",
    line: "hsl(var(--primary) / 0.8)",
  };
}

function truncateText(value: string | null, fallback: string) {
  const text = (value ?? "").trim();
  if (!text) return fallback;
  return text;
}

function getStepLabel(step: AgentProcessGraphStep | GenericStep) {
  if (isGenericStep(step)) return step.label;
  if (step.outcome === "authenticated") return "Authenticated";
  if (step.outcome === "login_required") return "Login Required";
  if (step.outcome === "advanced" && step.reason === "candidate_final_submit") {
    return "Submitted";
  }
  if (step.outcome === "advanced") return "Advanced";
  if (step.outcome === "extracted") return "Form Analyzed";
  if (step.outcome === "stopped") return "Stopped";
  if (step.action === "login") return "Login";
  if (step.action === "click") return "Click";
  return "Analyze";
}

function formatStepReason(reason: string | null | undefined) {
  if (!reason) return "";
  const normalizedReason = reason.trim();
  if (normalizedReason === "candidate_final_submit") return "The agent identified the final submit control and advanced the application.";
  if (normalizedReason === "candidate_application_cta") return "The agent picked a high-confidence application action to keep the flow moving.";
  if (normalizedReason === "candidate_navigation_cta") return "The agent followed a navigation control that looked like the next valid application step.";
  if (normalizedReason === "login_screen_detected_without_stored_credentials") return "The flow hit an authentication wall and needs saved credentials.";
  if (normalizedReason === "login_screen_detected_and_credentials_applied") return "Saved credentials were applied and the browser submitted the form.";
  if (normalizedReason === "application_form_detected") return "The page looked like a real application step, so the agent analyzed it.";
  if (normalizedReason === "no_better_navigation_target_found") return "The agent stayed on the current page because no stronger target was available.";
  if (normalizedReason === "no_navigation_candidate_found") return "No safe next-step button or link was detected on the current page.";
  if (normalizedReason === "navigation_candidate_already_clicked") return "The best navigation target had already been used.";
  return normalizedReason.replace(/_/g, " ");
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
        "relative flex items-center justify-center rounded-full border-2 border-muted bg-muted/30 text-muted-foreground shadow-sm",
        compact ? "h-8 w-8" : "h-11 w-11",
      ].join(" ")}
    >
      <Icon
        icon="svg-spinners:90-ring"
        className="absolute inset-0 h-full w-full text-primary/20"
      />
      <Icon
        icon={statusMessage ? "mdi:progress-alert" : "mdi:progress-helper"}
        className={[
          "relative z-10 text-primary",
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
        "flex items-center justify-center rounded-full border-2 border-muted bg-muted/30 text-muted-foreground shadow-sm",
        compact ? "h-8 w-8" : "h-11 w-11",
      ].join(" ")}
    >
      <Icon
        icon="mdi:circle-outline"
        className={compact ? "h-4 w-4" : "h-5 w-5"}
      />
    </div>
  );
}

export function AgentProcessGraph({
  steps = [],
  isLoading = false,
  awaitingUserInput = false,
  statusMessage = null,
  compact = false,
  showIdlePlaceholder = false,
}: AgentProcessGraphProps) {
  const safeSteps = Array.isArray(steps) ? steps : [];
  const nodeSize = compact ? 32 : 44;
  const halfNodeSize = nodeSize / 2;
  const nodeSpacing = compact ? 64 : 180;
  const lineY = compact ? 16 : 28;
  const svgHeight = compact ? 32 : 56;
  const viewBoxHeight = compact ? 48 : 88;
  const hasPendingNode = isLoading || awaitingUserInput;
  const nodeCount = safeSteps.length + (hasPendingNode ? 1 : 0);
  const width = Math.max(compact ? 112 : 320, Math.max(nodeCount, 1) * nodeSpacing);
  const scale = React.useMemo(
    () =>
      d3.scalePoint<number>()
        .domain(Array.from({ length: Math.max(nodeCount, 1) }, (_, index) => index))
        .range([halfNodeSize, width - halfNodeSize]),
    [halfNodeSize, nodeCount, width],
  );

  if (safeSteps.length === 0 && !hasPendingNode && !showIdlePlaceholder) {
    return null;
  }

  return (
    <div className={compact ? "overflow-x-auto" : "mt-3 overflow-x-auto"}>
      <div className="relative" style={{ width }}>
        <svg
          width={width}
          height={svgHeight}
          viewBox={`0 0 ${width} ${viewBoxHeight}`}
          className="block"
          aria-label="Agent process graph"
          role="img"
        >
          {safeSteps.slice(0, -1).map((step, index) => {
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
          {hasPendingNode && safeSteps.length > 0 ? (
            <line
              x1={scale(safeSteps.length - 1) ?? halfNodeSize}
              y1={lineY}
              x2={scale(safeSteps.length) ?? width - halfNodeSize}
              y2={lineY}
              stroke="hsl(var(--muted))"
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.8}
            />
          ) : null}
        </svg>

        {safeSteps.map((step, index) => {
          const x = scale(index) ?? 32;
          const tone = getStepTone(step);

          return (
            <div
              key={isGenericStep(step) ? `${step.id}-${index}` : `${step.action}-${step.outcome}-${index}`}
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
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {getStepLabel(step)}
                      </div>
                      <div className="text-xs font-medium text-foreground">
                        {isGenericStep(step) ? step.label : truncateText(step.target, "No target")}
                      </div>
                      <div className="text-[11px] leading-4 text-muted-foreground">
                        {isGenericStep(step) ? "" : formatStepReason(step.reason)}
                      </div>
                    </div>
                  }
                >
                  <button
                    type="button"
                    aria-label={isGenericStep(step) ? step.label : `${truncateText(step.target, "No target")}: ${step.reason}`}
                    className={[
                      compact
                        ? "flex h-8 w-8 items-center justify-center rounded-full border-2 shadow-sm transition duration-150 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:scale-105 focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                        : "flex h-11 w-11 items-center justify-center rounded-full border-2 shadow-sm transition duration-150 ease-out hover:-translate-y-0.5 hover:scale-105 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:scale-105 focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
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

        {hasPendingNode ? (
          <div
            className="absolute top-0"
            style={{
              left: `${(((scale(safeSteps.length > 0 ? safeSteps.length : 0) ?? width - halfNodeSize) / width) * 100)}%`,
              transform: "translateX(-50%)",
              width: nodeSize,
            }}
          >
            <div className="flex flex-col items-center text-center">
              <Tooltip
                side="bottom"
                content={
                  <div className="w-72 max-w-[min(18rem,calc(100vw-2rem))] space-y-1 text-left">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      In Progress
                    </div>
                    <div className="text-xs font-medium text-foreground">
                      {truncateText(statusMessage, "Waiting for the next update")}
                    </div>
                  </div>
                }
              >
                <div>
                  <PendingStepNode statusMessage={statusMessage} compact={compact} />
                </div>
              </Tooltip>
            </div>
          </div>
        ) : showIdlePlaceholder && safeSteps.length === 0 ? (
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
        ) : null}
      </div>
    </div>
  );
}

export function GraphProcess({
  theme = 'default',
  title,
  description,
  steps = [],
  className,
}: {
  theme?: string;
  title?: string;
  description?: string | null;
  steps: GenericStep[];
  className?: string;
}) {
  return (
    <section className={cn("py-24 px-6", className)}>
      <div className="max-w-6xl mx-auto">
        <DataInsightCard
          title={title}
          description={description ?? undefined}
          chartPosition="left"
        >
          <AgentProcessGraph steps={steps} />
        </DataInsightCard>
      </div>
    </section>
  );
}

export default GraphProcess;
