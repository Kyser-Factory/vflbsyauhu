'use client';
import React from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';

export interface IconListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  icon: string;
  children: React.ReactNode;
}

export const IconListItem = ({ icon, children, className, ...props }: IconListItemProps) => (
  <li {...props} className={cn('flex items-start space-x-3', className)}>
    <div className="mt-1 shrink-0">
      <Icon icon={icon} className="text-primary w-5 h-5" />
    </div>
    <div className="flex-1 space-y-1">
      {children}
    </div>
  </li>
);
