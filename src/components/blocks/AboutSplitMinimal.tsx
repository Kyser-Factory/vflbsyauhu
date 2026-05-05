'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import SectionFadeIn from "@/components/ui/section-fade-in";
import { ConstructBox } from "@/components/ui/construct-box";
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface AboutTab {
  id: string;
  label: string;
  content: string;
  description: string;
  icon?: string;
}

interface AboutPillarProps {
  variant?: 'tabbed' | 'split' | 'minimal' | 'industrial' | 'oracle' | 'banner';
  theme?: 'default' | 'industrial' | 'glass' | 'minimal';
  title?: string;
  subtitle?: string;
  description?: string;
  tabs?: readonly AboutTab[];
  className?: string;
}

export default function AboutPillar({
  variant = 'tabbed',
  theme = 'default',
  title,
  subtitle,
  description,
  tabs = [],
  className
}: AboutPillarProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || '');

  if (!title && tabs.length === 0) return null;

  const isMinimal = theme === 'minimal' || variant === 'minimal';
  const isIndustrial = theme === 'industrial' || variant === 'industrial';
  const isGlass = theme === 'glass';
  const isOracle = variant === 'oracle';
  const isBanner = variant === 'banner';

  const activeTabData = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  const renderTabContent = (tab: AboutTab) => (
    <div className="space-y-10">
      <div className="space-y-6">
        <h3 className={cn(
          "text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-primary leading-[0.95]",
          isMinimal && "not-italic tracking-tight normal-case font-bold"
        )}>
          {tab.content}
        </h3>
        <p className={cn(
          "text-lg md:text-xl text-muted-foreground leading-relaxed font-medium",
          isMinimal && "text-base font-normal"
        )}>
          {tab.description}
        </p>
      </div>
    </div>
  );

  return (
    <section className={cn(
      "py-32 px-6 relative overflow-hidden",
      isIndustrial ? "bg-black text-white" : "bg-background",
      isMinimal && "py-20",
      className
    )}>
      {/* Background Ambience */}
      {!isMinimal && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[140px]" />
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className={cn(
          "mb-20 space-y-4",
          (isOracle || isBanner) ? "text-center max-w-4xl mx-auto" : "max-w-3xl"
        )}>
          <SectionFadeIn distance={20}>
            <h2 className={cn(
              "text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]",
              isMinimal && "text-3xl md:text-5xl tracking-tight not-italic font-bold normal-case",
              isBanner && "font-light tracking-[0.2em] italic text-3xl md:text-5xl",
              isOracle && "font-black tracking-tighter text-5xl md:text-8xl"
            )}>
              {title || "Strategic Perspective"}
            </h2>
          </SectionFadeIn>
          {subtitle && (
            <SectionFadeIn delay={0.2} distance={10}>
              <p className={cn(
                "text-primary font-black text-xs uppercase tracking-[0.5em]",
                isMinimal && "tracking-[0.2em] font-bold",
                isBanner && "tracking-[0.8em] italic opacity-50",
                isOracle && "tracking-[0.4em]"
              )}>
                {subtitle}
              </p>
            </SectionFadeIn>
          )}
        </div>

        {(isOracle || isBanner) ? (
          <div className="max-w-4xl mx-auto">
            <div className={cn(
              "relative p-8 md:p-16 rounded-3xl overflow-hidden border border-white/5 bg-card/5 backdrop-blur-3xl shadow-premium",
              isOracle && "bg-[radial-gradient(circle_at_top,rgba(var(--primary-rgb),0.05),transparent)]"
            )}>
              {/* Oracle Grid Overlay */}
              {isOracle && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="oracle-about-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#oracle-about-grid)" />
                  </svg>
                </div>
              )}

              <div className="relative z-10 space-y-12">
                <p className={cn(
                  "text-xl md:text-3xl text-muted-foreground leading-relaxed font-light tracking-wide italic",
                  isOracle && "not-italic font-medium text-foreground tracking-tight text-2xl md:text-4xl"
                )}>
                  {description || "Autonomous orchestration layers designed for recursive scale and high-fidelity execution across global clusters."}
                </p>

                {tabs.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-border/10">
                    {tabs.map((tab, i) => (
                      <div key={i} className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Icon icon={tab.icon || "mdi:check-circle"} width={20} />
                          </div>
                          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{tab.label}</h4>
                        </div>
                        <p className="text-xs uppercase tracking-widest leading-relaxed text-muted-foreground/70">{tab.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (variant === 'tabbed' || variant === 'industrial') && tabs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "group relative px-8 py-6 text-left transition-all duration-500 rounded-lg overflow-hidden",
                      isMinimal ? (
                        isActive ? "text-primary border-l-2 border-primary" : "text-muted-foreground hover:text-foreground"
                      ) : (
                        isActive
                          ? "bg-primary text-primary-foreground shadow-premium scale-[1.02] z-10"
                          : "bg-card/5 hover:bg-card/10 text-muted-foreground hover:text-foreground border border-border/10 backdrop-blur-md"
                      )
                    )}
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        {tab.icon && (
                          <Icon 
                            icon={tab.icon} 
                            className={cn("w-5 h-5 transition-transform duration-500", isActive ? (isMinimal ? "text-primary" : "text-primary-foreground") : "text-primary")} 
                          />
                        )}
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                          {tab.label}
                        </span>
                      </div>
                      <Icon
                        icon={isActive ? "mdi:chevron-right" : "mdi:plus"}
                        className={cn("w-5 h-5 transition-transform duration-500", isActive ? "rotate-90" : "opacity-30 group-hover:opacity-100")}
                      />
                    </div>
                    {isActive && !isMinimal && (
                      <motion.div
                        layoutId="tab-bg"
                        className="absolute inset-0 bg-primary z-0"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-8">
              <div className={cn(
                "relative h-full min-h-[400px] p-10 md:p-16 rounded-2xl overflow-hidden group",
                !isMinimal && "border border-border/10 bg-card/5 backdrop-blur-xl shadow-premium"
              )}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: "circOut" }}
                  >
                    {activeTabData && renderTabContent(activeTabData)}
                  </motion.div>
                </AnimatePresence>

                {/* Decorative Elements */}
                {!isMinimal && (
                  <>
                    <div className="absolute top-0 right-0 p-8">
                      <Icon icon="mdi:hex-outline" className="w-24 h-24 text-primary/5 rotate-12" />
                    </div>
                    <ConstructBox className="absolute bottom-0 right-0 p-8 scale-75 opacity-20" />
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <SectionFadeIn direction="right">
              <div className="space-y-8">
                <p className={cn(
                  "text-xl md:text-2xl text-muted-foreground leading-relaxed font-medium italic",
                  isMinimal && "text-lg not-italic font-normal"
                )}>
                  {description || "Autonomous orchestration layers designed for recursive scale and high-fidelity execution across global clusters."}
                </p>
                <div className="flex gap-4">
                  <div className="h-px w-20 bg-primary/30 mt-4" />
                  <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40">
                    Proprietary Logic
                  </p>
                </div>
              </div>
            </SectionFadeIn>
            <div className={cn(
              "relative aspect-square rounded-2xl overflow-hidden",
              !isMinimal && "border border-border/10 shadow-premium"
            )}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80" 
                alt="Architecture" 
                className="w-full h-full object-cover grayscale opacity-50 scale-110"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
