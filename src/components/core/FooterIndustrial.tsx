'use client';

import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import Branding from '@/components/core/Branding';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkGroup {
  title: string;
  items: readonly FooterLink[];
}

interface FooterPillarProps {
  variant?: 'professional' | 'minimal' | 'industrial';
  logo?: string;
  tagline?: string;
  links?: readonly FooterLinkGroup[];
  socialLinks?: readonly { icon: string; href: string }[];
  policyLinks?: readonly FooterLink[];
  copyright?: string;
  branding?: {
    logoIcon?: string;
    tagline?: string;
    variant?: 'modern' | 'industrial' | 'fate' | 'minimal';
    showTagline?: boolean;
  };
  className?: string;
}

export default function FooterPillar({
  variant = 'professional',
  logo,
  tagline,
  links = [],
  socialLinks = [],
  policyLinks = [],
  copyright = `© ${new Date().getFullYear()}. All rights reserved.`,
  branding,
  className
}: FooterPillarProps) {
  const isMinimal = variant === 'minimal';
  const isIndustrial = variant === 'industrial';

  if (isMinimal) {
    return (
      <footer className={cn("py-12 px-6 border-t border-border/10 bg-background", className)}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <a href="/" className="hover:opacity-80 transition-opacity">
            <Branding name={logo} className="scale-90 origin-left" {...branding} />
          </a>
          
          <div className="flex flex-wrap justify-center gap-8">
            {policyLinks.map((link, i) => (
              <a key={i} href={link.href} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <p className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/60">
            {copyright}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={cn(
      "py-24 px-6 border-t border-border/10 relative overflow-hidden",
      isIndustrial ? "bg-background" : "bg-card/5 backdrop-blur-md",
      className
    )}>
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-6">
            <a href="/" className="inline-block hover:opacity-80 transition-opacity">
              <Branding name={logo} {...branding} />
            </a>
            {tagline && (
              <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-xs uppercase tracking-widest italic opacity-70">
                {tagline}
              </p>
            )}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 rounded-xl bg-card/10 border border-border/10 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Icon icon={social.icon} width={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Cols */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {links.map((group, i) => (
              <div key={i} className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                  {group.title}
                </h4>
                <ul className="space-y-4">
                  {group.items.map((link, j) => (
                    <li key={j}>
                      <a href={link.href} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-border/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
            {copyright}
          </p>
          <div className="flex items-center gap-8">
            {policyLinks.map((link, i) => (
              <a key={i} href={link.href} className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 hover:text-primary transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
