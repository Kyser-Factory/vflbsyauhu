import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";
type Color = "primary" | "neutral" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  color?: Color;
  size?: Size;
  loading?: boolean;
  block?: boolean;
  asChild?: boolean;
}

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs rounded-full",
  md: "h-11 px-6 text-sm rounded-full",
  lg: "h-14 px-8 text-base rounded-full",
};

const styles: Record<Color, Record<Variant, string>> = {
  primary: {
    solid:
      "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20",
    outline:
      "border border-primary text-primary hover:bg-primary/5",
    ghost: "text-primary hover:text-accent",
  },
  neutral: {
    solid:
      "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
    outline:
      "border border-border text-foreground hover:bg-accent hover:text-accent-foreground",
    ghost: "text-foreground/60 hover:text-foreground hover:bg-accent",
  },
  danger: {
    solid:
      "bg-destructive text-destructive-foreground hover:opacity-90 shadow-lg shadow-destructive/20",
    outline:
      "border border-destructive text-destructive hover:bg-destructive/5",
    ghost: "text-destructive hover:bg-destructive/5",
  },
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "solid",
      color = "neutral",
      size = "md",
      type = "button",
      loading,
      block,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-loading={loading ? "" : undefined}
        className={cn(
          "inline-flex items-center justify-center select-none font-medium transition-all active:scale-95",
          "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
          sizes[size],
          styles[color][variant],
          block && "w-full",
          className
        )}
        disabled={asChild ? undefined : (props.disabled || loading)}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && (
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-b-transparent" />
            )}
            {children}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";
