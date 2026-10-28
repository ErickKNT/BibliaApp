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
          'group flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-transform active:scale-90 focus:outline-none',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-all backdrop-blur-xl shadow-md border',
            active
              ? 'bg-[#18181b] text-white dark:bg-white dark:text-black shadow-sm'
              : 'bg-white/90 text-black/90 hover:bg-[#edece6] border-black/10 dark:bg-[#201f22]/90 dark:text-white/90 dark:hover:bg-[#2a2a2c] dark:border-white/5'
          )}
        >
          {children}
        </div>
        {label && (
          <span className="text-[9px] sm:text-[10px] font-medium tracking-tight text-black/70 group-hover:text-black dark:text-white/70 dark:group-hover:text-white">
            {label}
          </span>
        )}
        {badge !== undefined && (
          <span className="text-[9px] sm:text-[10px] font-bold text-black/90 dark:text-white/90">
            {badge}
          </span>
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
