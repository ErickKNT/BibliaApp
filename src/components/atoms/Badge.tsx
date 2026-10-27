import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'outline' | 'solid';
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'outline',
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest',
        variant === 'outline'
          ? 'border border-white/20 text-white/70 backdrop-blur-sm'
          : 'bg-white text-black',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

