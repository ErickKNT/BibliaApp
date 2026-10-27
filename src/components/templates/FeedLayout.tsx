import React from 'react';

export interface FeedLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const FeedLayout = React.forwardRef<HTMLDivElement, FeedLayoutProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className="relative h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black"
        {...props}
      >
        {children}
      </div>
    );
  }
);

FeedLayout.displayName = 'FeedLayout';
