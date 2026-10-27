import React from 'react';

export interface FeedLayoutProps {
  children: React.ReactNode;
}

export const FeedLayout: React.FC<FeedLayoutProps> = ({ children }) => {
  return (
    <div className="relative h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {children}
    </div>
  );
};

