'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';

import Branding from '@/components/core/Branding';

interface HeaderLink {
  label: string;
  href: string;
}

interface HeaderPillarProps {
  variant?: 'simple' | 'glass' | 'industrial';
  logo?: string;
  branding?: {
    logoIcon?: string;
    tagline?: string;
    variant?: 'modern' | 'industrial' | 'fate' | 'minimal';
    showTagline?: boolean;
  };
  links?: readonly HeaderLink[];
  cta?: string | { label: string; href: string };
  className?: string;
}

export default function HeaderPillar({
  variant = 'simple',
  logo,
  branding,
  links = [],
  cta,
  className
}: HeaderPillarProps) {
  const displayCta = typeof cta === 'string' ? { label: cta, href: '#' } : cta;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isGlass = variant === 'glass';
  const isIndustrial = variant === 'industrial';

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-500",
        isGlass
          ? (scrolled ? "py-4" : "py-8")
          : "py-6 bg-background/80 backdrop-blur-md border-b border-border/10",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={cn(
          "flex items-center justify-between transition-all duration-500",
          isGlass && "bg-card/10 backdrop-blur-xl border border-white/5 px-8 py-4 rounded-lg shadow-premium",
          isIndustrial && "bg-background border-2 border-primary/20 rounded-none px-6 py-3"
        )}>
          {/* Logo */}
          <a href="/" className="hover:opacity-80 transition-opacity">
            <Branding name={logo} {...branding} />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            {displayCta && (
              <a
                href={displayCta.href}
                className={cn(
                  "h-10 px-6 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                  isIndustrial ? "bg-primary text-primary-foreground rounded-none" : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl"
                )}
              >
                {displayCta.label}
              </a>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"} width={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-background border-b border-border/10 p-6 md:hidden space-y-6 shadow-2xl"
          >
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="block text-sm font-black uppercase tracking-widest text-muted-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {displayCta && (
              <a
                href={displayCta.href}
                className="w-full h-12 bg-primary text-primary-foreground rounded-xl flex items-center justify-center text-xs font-black uppercase tracking-widest"
                onClick={() => setMobileMenuOpen(false)}
              >
                {displayCta.label}
              </a>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
