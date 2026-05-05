'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { ConstructBox } from '@/components/ui/construct-box';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface HeroCta {
  label: string;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  icon?: string;
}

interface HeroPillarProps {
  variant?: 'modern' | 'oracle' | 'minimal' | 'banner';
  title?: string;
  description?: string;
  subtitle?: string;
  ctas?: readonly HeroCta[];
  statusText?: string;
  className?: string;
  align?: 'left' | 'center';
  modules?: readonly { title: string; subtitle: string; icon: string; linkLabel?: string }[];
  highlightedWords?: readonly string[];
  // Legacy support props
  ctaPrimary?: string | { text: string; link?: string };
  ctaSecondary?: string | { text: string; link?: string };
  ctaText?: string;
}

export default function HeroPillar({
  variant = 'modern',
  title,
  subtitle,
  description,
  ctas = [],
  statusText,
  className,
  align = 'center',
  modules = [],
  highlightedWords = [],
  ctaPrimary,
  ctaSecondary,
  ctaText
}: HeroPillarProps) {

  const displayCtas: readonly HeroCta[] = useMemo(() => {
    if (ctas && ctas.length > 0) return ctas;

    const legacy: HeroCta[] = [];
    // Support HeroModern legacy props
    if (ctaPrimary) {
      legacy.push({
        label: typeof ctaPrimary === 'object' ? ctaPrimary.text : ctaPrimary,
        href: typeof ctaPrimary === 'object' ? ctaPrimary.link : '#',
        variant: 'primary',
        icon: 'lucide:arrow-right'
      });
    }
    if (ctaSecondary) {
      legacy.push({
        label: typeof ctaSecondary === 'object' ? ctaSecondary.text : ctaSecondary,
        href: typeof ctaSecondary === 'object' ? ctaSecondary.link : '#',
        variant: 'ghost'
      });
    }
    // Support HeroOracle legacy props
    if (ctaText) {
      legacy.push({
        label: ctaText,
        href: '#',
        variant: 'primary'
      });
    }
    return legacy;
  }, [ctas, ctaPrimary, ctaSecondary, ctaText]);

  if (!title && !description && displayCtas.length === 0) return null;

  // RENDERING LOGIC

  if (variant === 'banner') {
    return (
      <section className={cn("w-full min-h-screen py-24 px-6 bg-background relative overflow-hidden flex flex-col justify-center", className)}>
        <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 mb-20">

          {title && (
            <motion.h2 initial="hidden" animate="visible" variants={fadeInUp} className="text-3xl md:text-5xl font-light tracking-[0.2em] leading-tight uppercase italic">
              {title.split(' ').map((word, i) => {
                const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").toLowerCase();
                const isHighlighted = highlightedWords.map(w => w.toLowerCase()).includes(cleanWord);
                return (
                  <span key={i} className={isHighlighted ? "text-primary font-medium" : ""}>
                    {word}{' '}
                  </span>
                );
              })}
            </motion.h2>
          )}

          {description && (
            <motion.p initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.2 }} className="tracking-[0.4em] text-xs md:text-sm text-muted-foreground uppercase max-w-2xl mx-auto italic">
              {description}
            </motion.p>
          )}
        </div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-8 relative z-10"
        >
          {modules.map((module, index) => (
            <motion.div key={index} variants={fadeInUp} className="h-full">
              <ConstructBox
                delay={(index * 0.2) + 0.5}
                noPadding
                className="h-full group"
              >
                <div className="relative p-8 h-full min-h-[220px] flex flex-col justify-between bg-card/5 backdrop-blur-md transition-all duration-500 hover:bg-card/10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:scale-110 transition-transform">
                      <Icon icon={module.icon} width={24} />
                    </div>
                    <h3 className="font-black tracking-[0.2em] text-[10px] uppercase">
                      {module.title}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 leading-relaxed group-hover:text-muted-foreground transition-colors">
                      {module.subtitle}
                    </p>

                    {module.linkLabel && (
                      <div className="flex items-center gap-2 text-primary/30 group-hover:text-primary transition-colors">
                        <span className="text-[9px] tracking-[0.3em] uppercase font-black">{module.linkLabel}</span>
                        <Icon icon="lucide:chevrons-right" width={14} />
                      </div>
                    )}
                  </div>

                  {/* Decorative Corner Icon */}
                  <div className="absolute -bottom-2 -right-2 text-primary/5 group-hover:text-primary/10 transition-colors pointer-events-none">
                    <Icon icon={module.icon} width={100} />
                  </div>
                </div>
              </ConstructBox>
            </motion.div>
          ))}
        </motion.div>
      </section>
    );
  }

  if (variant === 'oracle') {
    return (
      <section className={cn(
        "relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-16 bg-background",
        className
      )}>
        {/* Immersive Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.03),transparent_70%)]" />
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] animate-pulse delay-1000" />

          <div className="absolute inset-0 opacity-[0.02] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="oracle-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#oracle-grid)" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-5xl">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <Card className="max-w-2xl relative isolate overflow-hidden border border-white/5 bg-background/5 backdrop-blur-md shadow-premium rounded-lg">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(140%_100%_at_50%_0%,rgba(255,255,255,0.01),transparent_55%)]" />

              <CardContent className="p-6 md:p-10 space-y-6">
                {title && (
                  <motion.h1 variants={fadeInUp} className="text-3xl md:text-5xl font-bold leading-[1.1] tracking-tight text-foreground">
                    {title}
                  </motion.h1>
                )}

                {description && (
                  <motion.p variants={fadeInUp} className="text-base md:text-lg text-muted-foreground leading-relaxed">
                    {description}
                  </motion.p>
                )}

                {(displayCtas.length > 0 || statusText) && (
                  <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                    <div className="flex flex-wrap items-center gap-3">
                      {displayCtas.map((cta, i) => (
                        <Button
                          key={i}
                          size="lg"
                          variant={cta.variant === 'ghost' ? 'ghost' : cta.variant === 'outline' ? 'outline' : 'solid'}
                          color={cta.variant === 'primary' ? 'primary' : 'neutral'}
                          className={cn(
                            "h-11 px-8 rounded-lg font-bold transition-all hover:translate-y-[-1px]",
                            cta.variant === 'primary' ? "bg-primary text-primary-foreground shadow-premium" :
                              cta.variant === 'secondary' ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-accent"
                          )}
                          asChild
                        >
                          <a href={cta.href || "#"}>
                            {cta.label}
                            {cta.icon && <Icon icon={cta.icon} className="ml-2 h-4 w-4" />}
                          </a>
                        </Button>
                      ))}
                    </div>

                    {statusText && (
                      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40">
                        {statusText}
                      </span>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  // DEFAULT: Modern / Minimal
  return (
    <section className={cn(
      "relative min-h-screen flex items-center overflow-hidden bg-background text-foreground px-6 py-20",
      align === 'center' ? "justify-center text-center" : "justify-start text-left",
      className
    )}>
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className={cn("relative z-10 w-full max-w-5xl mx-auto space-y-6", align === 'left' && "mx-0")}>

        {title && (
          <motion.h1
            initial="hidden" animate="visible" variants={fadeInUp}
            className={cn(
              "text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]",
              variant === 'minimal' && "text-4xl md:text-5xl"
            )}
          >
            {title}
          </motion.h1>
        )}

        {description && (
          <motion.p
            initial="hidden" animate="visible" variants={fadeInUp}
            className={cn(
              "max-w-2xl text-base md:text-lg text-muted-foreground font-medium leading-relaxed",
              align === 'center' && "mx-auto"
            )}
          >
            {description}
          </motion.p>
        )}

        {displayCtas.length > 0 && (
          <motion.div
            initial="hidden" animate="visible" variants={staggerContainer}
            className={cn(
              "flex flex-col sm:flex-row items-center gap-3 pt-4",
              align === 'center' ? "justify-center" : "justify-start"
            )}
          >
            {displayCtas.map((cta, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Button
                  size="lg"
                  variant={cta.variant === 'ghost' ? 'ghost' : cta.variant === 'outline' ? 'outline' : 'solid'}
                  color={cta.variant === 'primary' ? 'primary' : 'neutral'}
                  className={cn(
                    "h-11 px-8 text-sm font-bold gap-2 rounded-lg transition-all hover:translate-y-[-1px]",
                    cta.variant === 'primary' ? "shadow-premium bg-primary text-primary-foreground" :
                      cta.variant === 'secondary' ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-accent"
                  )}
                  asChild
                >
                  <a href={cta.href || "#"}>
                    {cta.label}
                    {cta.icon && <Icon icon={cta.icon} className="h-4 w-4" />}
                  </a>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
