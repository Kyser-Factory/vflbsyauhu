"use client";

import React, {
  useId,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { Icon } from "@iconify/react";
import { Button } from "./button";

export type CollapsibleProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: (open: boolean) => ReactNode;
  label?: ReactNode;
  triggerLabel?: string;
  children?: ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  mountNoAnimate?: boolean;
  chevronIcon?: string;
  transitionMs?: number;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

export function Collapsible({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  label,
  triggerLabel = "Toggle section",
  children,
  disabled,
  id,
  className,
  triggerClassName,
  contentClassName,
  mountNoAnimate = true,
  chevronIcon = "mdi:chevron-down",
  transitionMs = 200,
  ...rest
}: CollapsibleProps) {
  const autoId = useId();
  const contentId = id ?? `collapsible-${autoId}`;
  const isControlled = typeof open === "boolean";
  const [internalOpen, setInternalOpen] = useState<boolean>(
    defaultOpen ?? false
  );
  const isOpen = isControlled ? (open as boolean) : internalOpen;

  const contentRef = useRef<HTMLDivElement | null>(null);
  const firstMountRef = useRef(true);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  const toggle = useCallback(() => {
    if (disabled) return;
    setOpen(!isOpen);
  }, [disabled, isOpen, setOpen]);

  // height animation
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    el.style.transition = `height ${transitionMs}ms ease`;
    const full = el.scrollHeight;

    if (firstMountRef.current && mountNoAnimate) {
      firstMountRef.current = false;
      el.style.height = isOpen ? "auto" : "0px";
      el.style.overflow = isOpen ? "visible" : "hidden";
      return;
    }
    firstMountRef.current = false;

    if (isOpen) {
      el.style.overflow = "hidden";
      el.style.height = "0px";
      void el.offsetHeight;
      el.style.height = `${full}px`;
      const onEnd = () => {
        el.style.height = "auto";
        el.style.overflow = "visible";
        el.removeEventListener("transitionend", onEnd);
      };
      el.addEventListener("transitionend", onEnd);
    } else {
      el.style.overflow = "hidden";
      el.style.height = `${full}px`;
      void el.offsetHeight;
      el.style.height = "0px";
      const onEnd = () => {
        el.removeEventListener("transitionend", onEnd);
      };
      el.addEventListener("transitionend", onEnd);
    }
  }, [isOpen, mountNoAnimate, transitionMs]);

  const DefaultTrigger = (
    <>
      {/* Fixed-width chevron box (match leaf dot box) */}
      <span
        className="inline-flex h-5 w-5 flex-none items-center justify-center"
        aria-hidden="true"
      >
        <Icon
          icon={chevronIcon}
          className="h-4 w-4"
          style={{
            transition: "transform 200ms ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </span>

      {/* Make the label area grow + allow truncation of its contents */}
      <span className="flex min-w-0 flex-1 items-center gap-2">
        {/* If label is plain text, let it truncate; if it’s a node, let that manage layout */}
        {typeof label === "string" ? (
          <span className="truncate">{label ?? triggerLabel}</span>
        ) : (
          label ?? <span className="truncate">{triggerLabel}</span>
        )}
      </span>
    </>
  );

  return (
    <div
      className={["data-[disabled=true]:opacity-50", className].filter(Boolean).join(" ")}
      data-disabled={!!disabled}
      data-open={isOpen}
      {...rest}
    >
      <Button
        variant='ghost'
        className={[
          // IMPORTANT: use flex (not inline-flex) and let it stretch
          "p-0 w-6 h-6",
          "overflow-hidden", // so min-w-0 truncation works
          triggerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={toggle}
        disabled={disabled}
        aria-label={trigger ? triggerLabel : undefined}
      >
        {trigger ? trigger(isOpen) : DefaultTrigger}
      </Button>

      <div
        id={contentId}
        role="region"
        aria-hidden={!isOpen}
        ref={contentRef}
        className={[
          "block overflow-hidden will-change-[height]",
          contentClassName,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ height: 0 }}
      >
        {children}
      </div>
    </div>
  );
}
