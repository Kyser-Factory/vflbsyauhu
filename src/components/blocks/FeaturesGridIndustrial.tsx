'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { FeatureCard } from '@/components/ui/feature-card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import SectionFadeIn from '@/components/ui/section-fade-in';

interface FeatureItem {
  title: string;
  description: string;
  icon: string;
  category?: string;
  details?: readonly string[];
  link?: string;
  items?: readonly { readonly label: string; readonly icon: string }[]; // For expertise list
}

interface FeatureCategory {
  title: string;
  subtitle?: string;
  icon: string;
  items: readonly { readonly label: string; readonly icon: string }[];
}

interface FeaturePillarProps {
  variant?: 'grid' | 'bento' | 'tabs' | 'steps' | 'list' | 'split' | 'expertise' | 'oracle' | 'banner';
  title?: string;
  description?: string;
  subtitle?: string;
  items?: readonly FeatureItem[];
  categories?: readonly any[]; // Flexible for both tabs and expertise
  theme?: 'default' | 'industrial' | 'glass' | 'minimal';
  className?: string;
}

export default function FeaturePillar({
  variant = 'grid',
  title,
  description,
  subtitle,
  items = [],
  categories = [],
  theme = 'default',
  className
}: FeaturePillarProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || '');
  const [selectedItem, setSelectedItem] = useState<FeatureItem | null>(null);

  const isMinimal = theme === 'minimal';
  const isIndustrial = theme === 'industrial';
  const isGlass = theme === 'glass';
  const isOracle = variant === 'oracle';
  const isBanner = variant === 'banner';

  const displayItems = useMemo(() => {
    if (variant === 'tabs' && activeCategory) {
      return items.filter(item => item.category === activeCategory);
    }
    return items;
  }, [variant, activeCategory, items]);

  if (items.length === 0 && categories.length === 0 && !title) return null;

  const renderExpertise = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {categories.map((category, idx) => (
        <SectionFadeIn key={idx} delay={idx * 0.2} distance={40} className="h-full">
          <div className="flex flex-col md:flex-row h-full min-h-[400px] bg-card/5 backdrop-blur-md rounded-lg border border-border/20 overflow-hidden group hover:bg-card/10 transition-all duration-500">
            <div className="w-full md:w-24 bg-primary/5 border-b md:border-b-0 md:border-r border-border/50 flex md:flex-col items-center justify-between p-6">
              <div className="h-12 w-12 rounded-xl bg-background border border-primary/20 flex items-center justify-center text-primary shadow-premium group-hover:scale-110 transition-transform">
                <Icon icon={category.icon} className="w-6 h-6" />
              </div>
              <div className="md:rotate-[-90deg] whitespace-nowrap opacity-40">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Section 0{idx + 1}</p>
              </div>
            </div>
            <div className="flex-1 p-8 md:p-12 space-y-10">
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tight uppercase italic leading-none group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                {category.subtitle && <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">{category.subtitle}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                {category.items?.map((item: any, i: number) => (
                  <div key={i} className="group/item space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 bg-primary rounded-full group-hover/item:scale-150 transition-transform" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover/item:text-foreground transition-colors leading-tight">{item.label}</span>
                    </div>
                    <div className="h-px w-0 bg-primary/30 group-hover/item:w-full transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionFadeIn>
      ))}
    </div>
  );

  const renderItems = () => {
    if (variant === 'expertise') return renderExpertise();
    const gridClasses = cn(
      "grid gap-x-2 gap-y-12",
      variant === 'list' ? "grid-cols-1 max-w-3xl mx-auto" :
        variant === 'bento' ? "grid-cols-1 md:grid-cols-6 lg:grid-cols-12" :
          displayItems.length === 1 ? "max-w-xl mx-auto grid-cols-1" :
            displayItems.length === 2 ? "max-w-4xl mx-auto md:grid-cols-2" :
              "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    );

    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className={cn(
          gridClasses,
          isOracle && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2"
        )}
      >
        <AnimatePresence mode="popLayout">
          {displayItems.map((item, i) => (
            <motion.div
              key={item.title + i}
              layout
              variants={fadeInUp}
              className={cn(
                variant === 'bento' && (
                  i === 0 ? "md:col-span-3 lg:col-span-8" :
                    i === 1 ? "md:col-span-3 lg:col-span-4" :
                      i === 2 ? "md:col-span-3 lg:col-span-4" :
                        "md:col-span-3 lg:col-span-4"
                ),
                isOracle && "group/oracle"
              )}
            >
              <FeatureCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                index={i}
                variant={variant === 'steps' ? 'industrial' : (isOracle || isBanner) ? 'glass' : theme}
                className={cn(
                  (item.details || item.link) && "cursor-pointer",
                  isOracle && "border-white/5 bg-card/5 backdrop-blur-xl hover:bg-card/10"
                )}
                onClick={() => (item.details || item.link) && setSelectedItem(item)}
              >
                {isOracle && (
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <span className="text-[8px] font-black tracking-widest opacity-20 group-hover/oracle:opacity-60 transition-opacity">NODE 0{i + 1}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover/oracle:bg-primary group-hover/oracle:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all" />
                  </div>
                )}
                {variant === 'steps' && (
                  <div className="absolute top-4 right-6 text-4xl font-black italic opacity-10 select-none">
                    0{i + 1}
                  </div>
                )}
                {item.link && (
                  <div className="absolute right-4 bottom-4 text-primary/20 group-hover:text-primary transition-all group-hover:translate-x-1">
                    <Icon icon="lucide:chevrons-right" width={20} />
                  </div>
                )}
              </FeatureCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <section className={cn(
      "py-24 px-6 relative overflow-hidden",
      isIndustrial ? "bg-black text-white" : "bg-background",
      isMinimal && "py-16",
      className
    )}>
      {isIndustrial && <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />}

      {/* Immersive Oracle Background */}
      {isOracle && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03]">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="oracle-feature-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#oracle-feature-grid)" />
            </svg>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className={cn(
          "mb-16 space-y-6",
          variant === 'split' ? "lg:grid lg:grid-cols-2 lg:gap-16 lg:items-end lg:mb-24" : "text-center max-w-4xl mx-auto"
        )}>
          <div className="space-y-4">
            {subtitle && (
              <p className={cn(
                "text-[10px] font-black uppercase tracking-[0.4em] text-primary",
                isMinimal && "tracking-[0.2em]",
                isBanner && "tracking-[0.8em] italic opacity-50",
                isOracle && "tracking-[0.6em]"
              )}>
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className={cn(
                "text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none",
                isMinimal && "text-3xl md:text-5xl tracking-tight normal-case font-bold",
                isBanner && "font-light tracking-[0.2em] italic text-3xl md:text-5xl",
                isOracle && "text-5xl md:text-8xl tracking-tighter"
              )}>
                {title}
              </h2>
            )}
            {description && (
              <p className={cn(
                "text-muted-foreground font-medium text-lg leading-relaxed italic mx-auto",
                isMinimal && "text-base not-italic font-normal",
                isOracle && "max-w-2xl text-foreground font-medium not-italic tracking-tight text-xl md:text-2xl"
              )}>
                {description}
              </p>
            )}
          </div>

          {variant === 'tabs' && categories.length > 0 && (
            <div className="flex justify-center md:justify-end pt-4">
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <TabsList className="bg-secondary/50 border-none p-1 rounded-xl h-12 shadow-inner">
                  {categories.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="rounded-lg px-6 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-black uppercase tracking-widest text-[10px]"
                    >
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className={cn(variant === 'split' && "lg:grid lg:grid-cols-12 lg:gap-16")}>
          <div className={cn(variant === 'split' ? "lg:col-span-12" : "w-full")}>
            {renderItems()}
          </div>
        </div>
      </div>

      {/* Shared Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-xl p-0 overflow-hidden border-none bg-card/60 backdrop-blur-2xl">
          {selectedItem && (
            <div className="p-8 space-y-8">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <Icon icon={selectedItem.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-foreground uppercase italic">
                    {selectedItem.title}
                  </h3>
                  <p className="text-muted-foreground font-medium italic">
                    {selectedItem.description}
                  </p>
                </div>
                <IconButton onClick={() => setSelectedItem(null)} className="border border-primary/20 text-primary">
                  <Icon icon="mdi:close" width={20} />
                </IconButton>
              </div>

              {selectedItem.details && (
                <ul className="space-y-4">
                  {selectedItem.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Icon icon="lucide:check-circle-2" className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              )}

              {selectedItem.link && (
                <div className="flex gap-4">
                  <a
                    href={selectedItem.link}
                    className="flex-1 h-12 flex items-center justify-center rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest shadow-premium hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Explore Module
                  </a>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="h-12 px-6 rounded-xl border border-border text-xs font-black uppercase tracking-widest hover:bg-accent transition-colors"
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
