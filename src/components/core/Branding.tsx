'use client';

import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BrandingProps {
  name?: string;
  tagline?: string;
  logoIcon?: string;
  className?: string;
  variant?: 'modern' | 'industrial' | 'fate' | 'minimal';
  showTagline?: boolean;
}

/**
 * BRANDING PILLAR
 * High-fidelity visual identity system for the forged application.
 * Supports multiple aesthetic modes to match the project's 'Asset Vibe'.
 */
export default function Branding({ 
  name, 
  tagline,
  logoIcon = "mdi:hexagon-multiple",
  className,
  variant = 'modern',
  showTagline = false
}: BrandingProps) {
  
  if (variant === 'industrial') {
    return (
      <div className={cn("flex items-center gap-4 group cursor-default", className)}>
        <div className="relative">
          <div className="w-12 h-12 border-2 border-primary flex items-center justify-center text-primary relative overflow-hidden bg-background">
             <Icon icon={logoIcon} width={28} className="relative z-10 transition-transform duration-700 group-hover:scale-110" />
             <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </div>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-primary" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary" />
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-black uppercase text-2xl leading-none tracking-tighter">
            {name}
          </span>
          {showTagline && tagline && (
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary mt-1">
              {tagline}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'fate') {
    return (
      <div className={cn("flex items-center gap-4 group cursor-default", className)}>
        <div className="relative">
          <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary relative">
             <Icon icon={logoIcon} width={24} className="animate-pulse" />
             <div className="absolute inset-0 rounded-full border border-primary/20 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700" />
          </div>
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="flex flex-col -space-y-1">
          <span className="font-heading font-black uppercase text-xl leading-none tracking-[0.2em] italic">
            {name}
          </span>
          {showTagline && tagline && (
            <span className="text-[8px] font-medium uppercase tracking-[0.5em] text-muted-foreground italic">
              {tagline}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-3 group cursor-default", className)}>
        <Icon icon={logoIcon} className="text-primary w-5 h-5 transition-transform group-hover:rotate-45" />
        <span className="font-heading font-light uppercase text-lg leading-none tracking-[0.3em]">
          {name?.split('').map((char, i) => (
            <span key={i} className={cn(i === 0 && "font-black text-primary")}>{char}</span>
          ))}
        </span>
      </div>
    );
  }

  // DEFAULT: Modern
  return (
    <div className={cn("flex items-center gap-3 group cursor-default", className)}>
      <div className="relative">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground transform group-hover:rotate-12 transition-transform duration-500 shadow-premium">
          <Icon icon={logoIcon} width={24} />
        </div>
        <div className="absolute inset-0 bg-primary/40 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <div className="flex flex-col -space-y-0.5">
        <span className="font-heading font-black uppercase text-xl leading-none tracking-tighter">
          {name}
        </span>
        {showTagline && tagline && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 leading-none">
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
}
