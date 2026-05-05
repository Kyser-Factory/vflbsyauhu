'use client';

import { ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConstructBox } from '@/components/ui/construct-box';

interface FeatureCardProps {
  title: string;
  description?: string;
  icon?: string;
  className?: string;
  children?: ReactNode;
  index?: number;
  variant?: 'default' | 'industrial' | 'glass' | 'minimal' | 'outline';
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const BG_CLASSES = [
  'bg-primary/5',
  'bg-accent/5',
  'bg-tertiary/5',
  'bg-quaternary/5',
  'bg-secondary/20',
  'bg-muted/10'
];

export function FeatureCard({
  title,
  description,
  icon,
  className,
  children,
  index = 0,
  variant = 'default',
  onClick
}: FeatureCardProps) {
  const isIndustrial = variant === 'industrial';
  const isGlass = variant === 'glass';
  const isMinimal = variant === 'minimal';

  const cardContent = (
    <>
      {/* Background Accent */}
      {!isMinimal && (
        <div
          className={cn(
            "absolute inset-0 -z-10 transition-opacity group-hover:opacity-100 opacity-20",
            isIndustrial ? "rounded-none" : isGlass ? "rounded-xl" : "rounded-lg",
            BG_CLASSES[index % BG_CLASSES.length]
          )}
        />
      )}

      {icon && (
        <div className={cn(
          "absolute left-6 -top-5 flex items-center justify-center p-3 transition-all",
          isIndustrial
            ? "rounded-none bg-background border border-border group-hover:scale-105 shadow-premium"
            : isGlass
              ? "rounded-xl bg-primary/10 backdrop-blur-md group-hover:scale-110 group-hover:rotate-6 border-none"
              : isMinimal
                ? "rounded-none bg-transparent group-hover:scale-110 border-none shadow-none !left-0 !-top-8 !p-0"
                : "rounded-lg bg-secondary shadow-premium group-hover:scale-110 group-hover:-rotate-3 border-none"
        )}>
          <div className={cn(
            "text-muted-foreground transition-colors group-hover:text-primary",
            isMinimal && "text-primary/40"
          )}>
            <Icon icon={icon} className={isMinimal ? "h-6 w-6" : "h-5 w-5"} />
          </div>
        </div>
      )}

      <CardHeader className={cn("space-y-2 pt-8", isMinimal && "px-0")}>
        <CardTitle className={cn(
          "text-lg font-bold tracking-tight transition-colors group-hover:text-primary leading-tight",
          isIndustrial && "uppercase italic tracking-tighter",
          isMinimal && "text-xl tracking-tight"
        )}>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className={cn("space-y-4", isMinimal && "px-0")}>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            {description}
          </p>
        )}
        {children}
      </CardContent>
    </>
  );

  if (isIndustrial) {
    return (
      <ConstructBox
        delay={index * 0.1}
        noPadding
        className={cn("group h-full", className)}
      >
        <Card className="h-full bg-transparent border-none shadow-none">
          {cardContent}
        </Card>
      </ConstructBox>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative block h-full overflow-visible transition-all",
        isGlass ? "rounded-xl bg-card/40 backdrop-blur-xl border-white/5 hover:-translate-y-1 hover:shadow-premium hover:bg-card/20" : 
        isMinimal ? "bg-transparent border-none shadow-none hover:translate-x-1" :
        "rounded-lg border-border/10 bg-card/10 backdrop-blur-md hover:-translate-y-1 hover:shadow-premium hover:bg-card/20",
        className
      )}
    >
      {cardContent}
    </Card>
  );
}
