"use client";

import * as React from "react";
import { motion, useInView, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionFadeInProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amount?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean;
};

export default function SectionFadeIn({
  children,
  className,
  delay = 0,
  duration = 0.7,
  amount = 0.2,
  distance = 32,
  direction = 'up',
  once = true,
  transition,
  ...props
}: SectionFadeInProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once, amount });
  const [delayComplete, setDelayComplete] = React.useState(delay <= 0);

  React.useEffect(() => {
    if (delay <= 0) {
      setDelayComplete(true);
      return;
    }

    setDelayComplete(false);

    const timeout = window.setTimeout(() => {
      setDelayComplete(true);
    }, delay * 1000);

    return () => window.clearTimeout(timeout);
  }, [delay]);

  const shouldShow = isInView && delayComplete;

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { opacity: 0, y: distance };
      case 'down': return { opacity: 0, y: -distance };
      case 'left': return { opacity: 0, x: distance };
      case 'right': return { opacity: 0, x: -distance };
      default: return { opacity: 0, y: distance };
    }
  };

  const getAnimatePosition = () => {
    if (!shouldShow) return getInitialPosition();
    return { opacity: 1, x: 0, y: 0 };
  };

  return (
    <div ref={ref} className={cn(className)}>
      <motion.div
        initial={getInitialPosition()}
        animate={getAnimatePosition()}
        transition={{
          duration,
          ease: "easeOut",
          ...transition,
        }}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
}
