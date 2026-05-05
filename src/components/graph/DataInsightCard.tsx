"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface DataInsightCardProps {
  title?: string;
  description?: string;
  metrics?: { label: string; value: string; trend?: string }[];
  children: React.ReactNode;
  className?: string;
  chartPosition?: 'left' | 'right';
}

export function DataInsightCard({
  title = "Intelligence Synthesis",
  description = "A detailed analysis of operational metrics and performance indices synchronized from the edge nodes.",
  metrics = [],
  children,
  className,
  chartPosition = 'right'
}: DataInsightCardProps) {
  return (
    <div className={cn(
      "w-full rounded-xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-2xl shadow-2xl border-none overflow-hidden",
      className
    )}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Content Side */}
        <div className={cn(
          "lg:col-span-5 p-8 md:p-12 flex flex-col justify-center space-y-8",
          chartPosition === 'left' ? "lg:order-last" : ""
        )}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-6"
          >
            <div className="space-y-2">
              <motion.h3 variants={fadeInUp} className="text-2xl font-black tracking-tighter uppercase italic text-primary">
                {title}
              </motion.h3>
              <motion.p variants={fadeInUp} className="text-sm font-bold tracking-widest text-muted-foreground uppercase leading-relaxed opacity-80">
                {description}
              </motion.p>
            </div>

            {metrics.length > 0 && (
              <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4 pt-4">
                {metrics.map((metric, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                      {metric.label}
                    </div>
                    <div className="text-xl font-black tracking-tight flex items-baseline gap-2">
                      {metric.value}
                      {metric.trend && (
                        <span className="text-[10px] text-emerald-500 font-bold tracking-normal italic">
                          {metric.trend}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Chart Side */}
        <div className="lg:col-span-7 p-4 md:p-8 bg-black/10 min-h-[300px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          <div className="w-full h-full relative z-10 flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataInsightCard;
