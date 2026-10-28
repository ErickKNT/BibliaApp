import React from 'react';
import { Heart, FileText, Bookmark, Share2 } from 'lucide-react';
import { IconButton } from '@/components/atoms/IconButton';
import { cn } from '@/lib/utils';

export interface VerseActionBarProps {
  isLiked?: boolean;
  likeCount?: number;
  isBookmarked?: boolean;
  notesCount?: number;
  isVisible?: boolean;
  className?: string;
  onLikeToggle?: () => void;
  onBookmarkToggle?: () => void;
  onOpenNotes?: () => void;
  onShare?: () => void;
}

export const VerseActionBar: React.FC<VerseActionBarProps> = ({
  isLiked = false,
  likeCount = 0,
  isBookmarked = false,
  notesCount = 0,
  isVisible = true,
  className,
  onLikeToggle,
  onBookmarkToggle,
  onOpenNotes,
  onShare,
}) => {
  return (
    <aside
      aria-label="Acciones del versiculo"
      className={cn(
        'fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-30 flex flex-col items-center gap-2.5 sm:gap-3.5 select-none transition-all duration-300 ease-out pointer-events-auto',
        isVisible
          ? 'translate-x-0 opacity-100'
          : 'translate-x-12 opacity-0 pointer-events-none',
        className
      )}
    >
      {/* Me gusta */}
      <IconButton
        active={isLiked}
        onClick={onLikeToggle}
        label="Me gusta"
        badge={likeCount > 0 ? likeCount : undefined}
      >
        <Heart
          className={cn(
            'h-4.5 w-4.5 sm:h-5 sm:w-5 transition-transform group-active:scale-125',
            isLiked ? 'fill-current stroke-current' : 'stroke-current'
          )}
        />
      </IconButton>

      {/* Notas y Reflexiones */}
      <IconButton
        onClick={onOpenNotes}
        label="Notas"
        badge={notesCount > 0 ? notesCount : undefined}
      >
        <FileText className="h-4.5 w-4.5 sm:h-5 sm:w-5 stroke-current" />
      </IconButton>

      {/* Guardar / Marcador */}
      <IconButton
        active={isBookmarked}
        onClick={onBookmarkToggle}
        label="Guardar"
      >
        <Bookmark
          className={cn(
            'h-4.5 w-4.5 sm:h-5 sm:w-5',
            isBookmarked ? 'fill-current stroke-current' : 'stroke-current'
          )}
        />
      </IconButton>

      {/* Compartir Tarjeta */}
      <IconButton
        onClick={onShare}
        label="Card"
      >
        <Share2 className="h-4.5 w-4.5 sm:h-5 sm:w-5 stroke-current" />
      </IconButton>
    </aside>
  );
};
