'use client';

import { motion } from 'framer-motion';
import { Icon } from "@iconify/react";
import { Card, CardContent } from "@/components/ui/card";
import { ConstructBox } from "@/components/ui/construct-box";
import { cn } from "@/lib/utils";
import SectionFadeIn from "@/components/ui/section-fade-in";
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface PlanFeature {
  label: string;
  icon?: string;
}

interface PricingPlan {
  name: string;
  price: string;
  cycle?: string;
  description: string;
  features: readonly (string | PlanFeature)[];
  ctaLabel: string;
  ctaTo?: string;
  highlighted?: boolean;
}

interface PricingPillarProps {
  variant?: 'fate' | 'grid' | 'glass' | 'industrial';
  theme?: 'default' | 'industrial' | 'glass' | 'minimal';
  title?: string;
  description?: string;
  plans?: readonly PricingPlan[];
  className?: string;
}

export default function PricingPillar({
  variant = 'fate',
  theme = 'default',
  title,
  description,
  plans = [],
  className
}: PricingPillarProps) {
  if (plans.length === 0 && !title) return null;

  const isMinimal = theme === 'minimal';
  const isIndustrialTheme = theme === 'industrial';
  const isGlassTheme = theme === 'glass';

  const gridCols = plans.length === 1
    ? "max-w-md mx-auto"
    : plans.length === 2
      ? "md:grid-cols-2 max-w-4xl mx-auto"
      : "md:grid-cols-3 max-w-7xl mx-auto";

  return (
    <section className={cn(
      "py-32 px-6 relative overflow-hidden",
      isIndustrialTheme ? "bg-black text-white" : "bg-background",
      isMinimal && "py-20",
      className
    )}>
      {/* Background Ambience */}
      {!isMinimal && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className={cn(
          "text-center mb-20 space-y-4",
          isMinimal && "mb-12 space-y-2"
        )}>
          <SectionFadeIn distance={20}>
            <h2 className={cn(
              "text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none",
              isMinimal && "text-3xl md:text-5xl tracking-tight not-italic font-bold normal-case"
            )}>
              {title || "Strategic Tiers"}
            </h2>
          </SectionFadeIn>
          {description && (
            <SectionFadeIn delay={0.2} distance={10}>
              <p className={cn(
                "text-muted-foreground text-lg max-w-2xl mx-auto font-medium italic",
                isMinimal && "text-base not-italic font-normal"
              )}>
                {description}
              </p>
            </SectionFadeIn>
          )}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className={cn("grid gap-8 items-stretch", gridCols)}
        >
          {plans.map((plan, i) => {
            const isFate = variant === 'fate';
            const isGlass = variant === 'glass' || isGlassTheme;
            const isGrid = variant === 'grid';
            const isIndustrial = variant === 'industrial' || isIndustrialTheme;

            const cardInner = (
              <Card
                className={cn(
                  "relative flex flex-col h-full overflow-hidden transition-all duration-500",
                  "bg-card/5 backdrop-blur-md border border-border/10 rounded-lg shadow-premium",
                  plan.highlighted && "ring-1 ring-primary/20 scale-[1.02] bg-card/10",
                  isGlass && "bg-card/20 border-white/5",
                  isGrid && "rounded-none border-l-2 border-primary/10",
                  isIndustrial && "bg-transparent border-none shadow-none rounded-none",
                  isMinimal && "bg-transparent border-none shadow-none rounded-none p-0"
                )}
              >
                {/* Glossy Overlay */}
                {!isMinimal && <div className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(140%_100%_at_50%_0%,rgba(255,255,255,0.03),transparent_60%)]" />}

                <CardContent className="p-8 md:p-12 flex flex-col h-full space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black tracking-tighter italic">{plan.price}</span>
                      {plan.cycle && (
                        <span className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.4em] ml-1">
                          / {plan.cycle}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="h-px w-full bg-border/10" />

                  <ul className="flex-1 space-y-5">
                    {plan.features?.map((feature, j) => {
                      const label = typeof feature === 'string' ? feature : feature.label;
                      const icon = typeof feature === 'string' ? 'lucide:check' : (feature.icon || 'lucide:check');
                      return (
                        <li key={j} className="flex items-start gap-4 group/item">
                          <div className="p-1 rounded-full bg-primary/10 text-primary mt-0.5 group-hover/item:scale-110 transition-transform">
                            <Icon icon={icon} className="h-3 w-3" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover/item:text-foreground transition-colors">
                            {label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  <a
                    href={plan.ctaTo || "#"}
                    className={cn(
                      "w-full h-12 flex items-center justify-center rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all",
                      plan.highlighted
                        ? "bg-primary text-primary-foreground hover:scale-[1.02] shadow-premium"
                        : "bg-secondary/50 text-foreground border border-border/10 hover:bg-secondary"
                    )}
                  >
                    {plan.ctaLabel}
                  </a>
                </CardContent>
              </Card>
            );

            if (isIndustrial) {
              return (
                <motion.div key={plan.name + i} variants={fadeInUp} className="h-full">
                  <ConstructBox noPadding className="h-full group">
                    {cardInner}
                  </ConstructBox>
                </motion.div>
              );
            }

            return (
              <motion.div key={plan.name + i} variants={fadeInUp} className="h-full">
                {cardInner}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
