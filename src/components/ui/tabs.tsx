import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextType = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextType | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    throw new Error("Tabs components must be used inside <Tabs>");
  }
  return ctx;
}

type TabsProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
};

export function Tabs({
  value: controlledValue,
  defaultValue,
  onValueChange,
  className,
  children,
}: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? ""
  );

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabsListProps = {
  className?: string;
  children: React.ReactNode;
};

export function TabsList({ className, children }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex w-full rounded-md bg-muted p-1",
        className
      )}
    >
      {children}
    </div>
  );
}

type TabsTriggerProps = {
  value: string;
  className?: string;
  children: React.ReactNode;
};

export function TabsTrigger({
  value,
  className,
  children,
}: TabsTriggerProps) {
  const { value: activeValue, setValue } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setValue(value)}
      className={cn(
        "flex items-center justify-center gap-2 whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

type TabsContentProps = {
  value: string;
  className?: string;
  children: React.ReactNode;
};

export function TabsContent({
  value,
  className,
  children,
}: TabsContentProps) {
  const { value: activeValue } = useTabsContext();

  if (activeValue !== value) return null;

  return (
    <div role="tabpanel" className={cn("mt-4", className)}>
      {children}
    </div>
  );
}