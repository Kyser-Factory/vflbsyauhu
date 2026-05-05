'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import SectionFadeIn from "@/components/ui/section-fade-in";
import { ConstructBox } from "@/components/ui/construct-box";
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface Testimonial {
  content: string;
  author: string;
  role: string;
  avatar?: string;
}

interface TestimonialPillarProps {
  variant?: 'grid' | 'bento' | 'industrial';
  theme?: 'default' | 'industrial' | 'glass' | 'minimal';
  title?: string;
  description?: string;
  testimonials?: readonly Testimonial[];
  className?: string;
}

export default function TestimonialPillar({
  variant = 'grid',
  theme = 'default',
  title,
  description,
  testimonials = [],
  className
}: TestimonialPillarProps) {
  if (testimonials.length === 0 && !title) return null;

  const isMinimal = theme === 'minimal';
  const isIndustrial = theme === 'industrial' || variant === 'industrial';
  const isGlass = theme === 'glass';

  return (
    <section className={cn(
      "py-32 px-6 relative overflow-hidden",
      isIndustrial ? "bg-black text-white" : "bg-background",
      isMinimal && "py-20",
      className
    )}>
      <div className="relative z-10 max-w-7xl mx-auto space-y-20">
        <div className={cn(
          "text-center space-y-4 max-w-3xl mx-auto",
          isMinimal && "space-y-2"
        )}>
          <SectionFadeIn distance={20}>
            <h2 className={cn(
              "text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none",
              isMinimal && "text-3xl md:text-5xl tracking-tight not-italic font-bold normal-case"
            )}>
              {title || "User Verification"}
            </h2>
          </SectionFadeIn>
          {description && (
            <SectionFadeIn delay={0.2} distance={10}>
              <p className={cn(
                "text-muted-foreground text-lg font-medium italic",
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
          className={cn(
            "grid gap-8",
            variant === 'bento'
              ? "grid-cols-1 md:grid-cols-6"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {testimonials.map((t, i) => {
            const isBento = variant === 'bento';

            const cardContent = (
              <div className={cn(
                "p-10 flex flex-col justify-between h-full space-y-8 transition-all duration-500",
                isIndustrial ? "" :
                isMinimal ? "bg-transparent border-none shadow-none p-0 hover:translate-x-1" :
                "bg-card/5 backdrop-blur-md border border-border/10 rounded-lg hover:bg-card/10 hover:border-primary/20"
              )}>
                <div className="space-y-6">
                  {!isMinimal && <Icon icon="mdi:format-quote-open" className="text-primary/20 w-12 h-12 -ml-2" />}
                  <p className={cn(
                    "text-lg md:text-xl font-medium leading-relaxed italic text-foreground/90",
                    isMinimal && "text-base md:text-lg not-italic leading-normal"
                  )}>
                    "{t.content}"
                  </p>
                </div>

                <div className={cn(
                  "flex items-center gap-4 pt-6 border-t border-border/5",
                  isMinimal && "border-none pt-0"
                )}>
                  <div className="relative">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.author}
                        className={cn(
                          "w-12 h-12 rounded-full transition-all duration-700 object-cover",
                          isIndustrial ? "grayscale group-hover:grayscale-0" : "",
                          isMinimal && "w-10 h-10"
                        )}
                      />
                    ) : (
                      <div className={cn(
                        "w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary",
                        isMinimal && "w-10 h-10 rounded-full"
                      )}>
                        <Icon icon="mdi:account" width={isMinimal ? 20 : 24} />
                      </div>
                    )}
                    {!isMinimal && (
                      <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5 border-2 border-background shadow-sm">
                        <Icon icon="mdi:check-decagram" className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className={cn(
                      "font-black uppercase tracking-widest text-[11px]",
                      isMinimal && "tracking-tight normal-case text-sm font-bold"
                    )}>
                      {t.author}
                    </h4>
                    <p className={cn(
                      "text-[10px] font-black uppercase tracking-widest text-primary italic",
                      isMinimal && "tracking-tight normal-case text-xs font-medium not-italic text-muted-foreground"
                    )}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            );

            const gridSpan = isBento
              ? (i === 0 ? "md:col-span-4" : i === 1 ? "md:col-span-2" : "md:col-span-3")
              : "col-span-1";

            if (isIndustrial) {
              return (
                <motion.div key={i} variants={fadeInUp} className={cn(gridSpan, "h-full")}>
                  <ConstructBox noPadding className="h-full group">
                    {cardContent}
                  </ConstructBox>
                </motion.div>
              );
            }

            return (
              <motion.div key={i} variants={fadeInUp} className={cn(gridSpan, "h-full")}>
                {cardContent}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
