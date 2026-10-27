import React from 'react';
import { cn } from '@/lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  label?: string;
  badge?: number | string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ active = false, label, badge, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={cn(
          'group flex flex-col items-center justify-center gap-1 transition-transform active:scale-90 focus:outline-none',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full transition-colors backdrop-blur-sm',
            active
              ? 'bg-white text-black'
              : 'bg-white/10 text-white hover:bg-white/20 active:bg-white/30'
          )}
        >
          {children}
        </div>
        {label && (
          <span className="text-[11px] font-medium tracking-tight text-white/70 group-hover:text-white">
            {label}
          </span>
        )}
        {badge !== undefined && (
          <span className="text-[11px] font-semibold text-white/80">
            {badge}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

