import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
> & {
  /** Optional leading icon (Iconify name, e.g. "mdi:compass") */
  icon?: string;
  /** Override chevron icon (Iconify name). Defaults to "mdi:chevron-down" */
  chevronIcon?: string;
};

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, icon, chevronIcon = "mdi:chevron-down", ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "group flex flex-1 items-center justify-between py-4 text-left text-sm font-medium transition-all hover:underline",
        className
      )}
      {...props}
    >
      <span className="flex min-w-0 items-center gap-3">
        {icon ? (
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border bg-muted/30">
            <Icon icon={icon} className="h-4 w-4" />
          </span>
        ) : null}

        <span className="min-w-0">{children}</span>
      </span>

      <Icon
        icon={chevronIcon}
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          "group-data-[state=open]:rotate-180"
        )}
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden text-sm transition-all",
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    )}
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };