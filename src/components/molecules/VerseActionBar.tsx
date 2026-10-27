import React from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';
import { IconButton } from '@/components/atoms/IconButton';

export interface VerseActionBarProps {
  isLiked?: boolean;
  likeCount?: number;
  hasNotes?: boolean;
  onLikeToggle?: () => void;
  onOpenNotes?: () => void;
  onShare?: () => void;
}

export const VerseActionBar: React.FC<VerseActionBarProps> = ({
  isLiked = false,
  likeCount = 0,
  hasNotes = false,
  onLikeToggle,
  onOpenNotes,
  onShare,
}) => {
  return (
    <aside
      aria-label="Acciones del versículo"
      className="absolute bottom-20 right-4 sm:right-8 z-20 flex flex-col items-center gap-4 select-none"
    >
      <IconButton
        active={isLiked}
        onClick={onLikeToggle}
        label="Me gusta"
        badge={likeCount > 0 ? likeCount : undefined}
      >
        <Heart
          className={`h-6 w-6 transition-transform group-active:scale-125 ${
            isLiked ? 'fill-black stroke-black' : 'stroke-current'
          }`}
        />
      </IconButton>

      <IconButton
        active={hasNotes}
        onClick={onOpenNotes}
        label="Notas"
      >
        <MessageSquare
          className={`h-6 w-6 ${
            hasNotes ? 'fill-black stroke-black' : 'stroke-current'
          }`}
        />
      </IconButton>

      <IconButton
        onClick={onShare}
        label="Compartir"
      >
        <Share2 className="h-6 w-6 stroke-current" />
      </IconButton>
    </aside>
  );
};

