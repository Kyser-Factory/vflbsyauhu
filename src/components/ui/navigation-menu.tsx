"use client";

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import * as React from "react";

import { cn } from "@/lib/utils";

export const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(function NavigationMenu({ className, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Root
      ref={ref}
      className={cn("relative z-10 flex max-w-max items-center justify-center", className)}
      {...props}
    >
      {children}
      <NavigationMenuViewport />
    </NavigationMenuPrimitive.Root>
  );
});

export const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(function NavigationMenuList({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.List
      ref={ref}
      className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
      {...props}
    />
  );
});

export const NavigationMenuItem = NavigationMenuPrimitive.Item;

export const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(function NavigationMenuTrigger({ className, children, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Trigger
      ref={ref}
      className={cn(
        "group inline-flex h-6 items-center justify-center rounded px-2 text-xs font-medium",
        "bg-transparent text-zinc-900 transition-colors hover:bg-zinc-100",
        "focus:bg-zinc-100 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Trigger>
  );
});

export const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(function NavigationMenuContent({ className, ...props }, ref) {
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn(
        "left-0 top-0 w-max rounded-md border bg-white p-2 shadow-md",
        "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out",
        "data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out",
        className,
      )}
      {...props}
    />
  );
});

export const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(function NavigationMenuViewport({ className, ...props }, ref) {
  return (
    <div className="absolute left-0 top-full flex justify-center">
      <NavigationMenuPrimitive.Viewport
        ref={ref}
        className={cn(
          "relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)]",
          "w-[var(--radix-navigation-menu-viewport-width)] overflow-hidden rounded-md",
          className,
        )}
        {...props}
      />
    </div>
  );
});
