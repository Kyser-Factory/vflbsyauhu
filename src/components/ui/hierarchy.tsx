"use client";

import React, { useCallback, type ReactNode } from "react";
import { Collapsible } from "./collapsible";

export type TreeNode = {
  id: string;
  label: ReactNode;
  children?: TreeNode[];
  icon?: ReactNode;
  actions?: ReactNode;
  defaultExpanded?: boolean;
  expanded?: boolean;
  disabled?: boolean;
  meta?: Record<string, unknown>;
  selected?: boolean;
};

export type HierarchyProps = {
  nodes: TreeNode[];
  onToggle?: (node: TreeNode, expanded: boolean) => void;
  selectedId?: string;
  selectedIds?: string[];
  className?: string;
  renderLabel?: (node: TreeNode, depth: number) => ReactNode;
  showGuides?: boolean; // kept for API parity
};

export function Hierarchy({
  nodes,
  onToggle,
  selectedId,
  selectedIds,
  className,
  renderLabel,
}: HierarchyProps) {
  const renderTree = useCallback(
    (list: TreeNode[], depth = 0) => {
      return list.map((node) => {
        const hasChildren = !!(node.children && node.children.length > 0);
        const baseLabel = renderLabel ? renderLabel(node, depth) : node.label;

        const fallbackSelected =
          (Array.isArray(selectedIds) && selectedIds.includes(node.id)) ||
          (typeof selectedId === "string" && node.id === selectedId);

        const isSelected = node.selected ?? fallbackSelected;

        const commonRow =
  "flex w-full items-center gap-2 min-h-7  p-0 cursor-pointer " +
  "border border-transparent border-r-0 rounded-md rounded-r-none " + // disable right border + bevels
  "data-[selected=true]:bg-blue-500/10 data-[selected=true]:border-blue-500/30 " +
  "aria-selected:bg-blue-500/10 aria-selected:border aria-selected:border-blue-500/30 " +
  "data-[disabled=true]:opacity-50";

        // ---------- LEAF ----------
        if (!hasChildren) {
          return (
            <div
              key={node.id}
              className={commonRow}
              role="treeitem"
              aria-selected={isSelected}
              data-disabled={!!node.disabled}
              data-selected={isSelected}
            >
              {/* Dot placeholder with SAME box as chevron box */}
              <span
                aria-hidden="true"
                className="inline-flex h-5 w-5 flex-none items-center justify-center"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current/60" />
              </span>

              <div className="inline-flex min-w-0 grow items-center gap-2">
                {node.icon ? <span className="shrink-0">{node.icon}</span> : null}
                <span className="truncate">{baseLabel}</span>
              </div>

              {node.actions && <div className="shrink-0">{node.actions}</div>}
            </div>
          );
        }

        // ---------- BRANCH ----------
        const branchLabel = (
          <div className="flex w-full min-w-0 items-center gap-2">
            <span className="inline-flex min-w-0 grow items-center gap-2">
              {node.icon ? <span className="shrink-0">{node.icon}</span> : null}
              <span className="truncate">{baseLabel}</span>
            </span>
            {node.actions && <div className="shrink-0">{node.actions}</div>}
          </div>
        );

        return (
          <div
            key={node.id}
            className={commonRow}
            role="treeitem"
            aria-expanded={node.expanded}
            aria-selected={isSelected}
            data-disabled={!!node.disabled}
            data-selected={isSelected}
          >
            <Collapsible
              open={node.expanded}
              defaultOpen={node.defaultExpanded}
              onOpenChange={(o) => onToggle?.(node, o)}
              className="w-full"
              triggerClassName="inline-flex w-full items-center gap-2 justify-start rounded-r-none"
              contentClassName="pl-3"
              label={branchLabel}
            >
              {node.children && renderTree(node.children, depth + 1)}
            </Collapsible>
          </div>
        );
      });
    },
    [onToggle, renderLabel, selectedId, selectedIds]
  );

  return (
    <div className={["w-full", className].filter(Boolean).join(" ")} role="tree">
      {renderTree(nodes, 0)}
    </div>
  );
}
