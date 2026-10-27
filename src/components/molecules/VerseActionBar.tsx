import React from 'react';
import { Heart, FileText, Bookmark, Share2 } from 'lucide-react';
import { IconButton } from '@/components/atoms/IconButton';

export interface VerseActionBarProps {
  isLiked?: boolean;
  likeCount?: number;
  isBookmarked?: boolean;
  notesCount?: number;
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
  onLikeToggle,
  onBookmarkToggle,
  onOpenNotes,
  onShare,
}) => {
  return (
    <aside
      aria-label="Acciones del versiculo"
      className="absolute bottom-28 right-4 sm:right-8 z-20 flex flex-col items-center gap-4 select-none"
    >
      {/* Me gusta */}
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

      {/* Notas y Reflexiones */}
      <IconButton
        onClick={onOpenNotes}
        label="Notas"
        badge={notesCount > 0 ? notesCount : undefined}
      >
        <FileText className="h-6 w-6 stroke-current" />
      </IconButton>

      {/* Guardar / Marcador */}
      <IconButton
        active={isBookmarked}
        onClick={onBookmarkToggle}
        label="Guardar"
      >
        <Bookmark
          className={`h-6 w-6 ${
            isBookmarked ? 'fill-black stroke-black' : 'stroke-current'
          }`}
        />
      </IconButton>

      {/* Compartir Tarjeta */}
      <IconButton
        onClick={onShare}
        label="Card"
      >
        <Share2 className="h-6 w-6 stroke-current" />
      </IconButton>
    </aside>
  );
};
