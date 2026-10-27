import React, { useState } from 'react';
import type { Verse } from '@/types/bible';
import { VerseActionBar } from '@/components/molecules/VerseActionBar';
import { Heart, BookOpen, ArrowUp, Repeat } from 'lucide-react';

export interface VerseCardProps {
  verse: Verse;
  isLiked?: boolean;
  isBookmarked?: boolean;
  notesCount?: number;
  availableVersions?: string[];
  onLikeToggle?: (verseId: string) => void;
  onBookmarkToggle?: (verseId: string) => void;
  onOpenNotes?: (verseId: string) => void;
  onVersionToggle?: () => void;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  isLiked = false,
  isBookmarked = false,
  notesCount = 0,
  onLikeToggle,
  onBookmarkToggle,
  onOpenNotes,
  onVersionToggle,
}) => {
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [lastTap, setLastTap] = useState<number>(0);

  // Doble toque para dar Me gusta estilo TikTok
  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (!isLiked) {
        onLikeToggle?.(verse.id);
      }
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 700);
    }
    setLastTap(now);
  };

  const handleShare = async () => {
    const shareText = `"${verse.text}"\n— ${verse.bookName} ${verse.chapter}:${verse.verseNumber} (${verse.version})\n\nLeido en BibliaApp`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BibliaApp',
          text: shareText,
        });
      } catch {
        // Cancelacion intencional del usuario
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Versiculo copiado al portapapeles');
    }
  };

  const chapterDisplay = verse.chapterContext || `${verse.bookName.toUpperCase()} · CAP. ${verse.chapter}`;

  return (
    <article
      onClick={handleTap}
      className="relative flex h-[100dvh] w-full flex-col justify-between overflow-hidden bg-[#131315] px-6 sm:px-12 pt-16 pb-6 snap-start select-none"
    >
      {/* Resplandor ambiental de profundidad sutil */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-25">
        <div className="w-80 h-80 rounded-full bg-[#353437] blur-[110px]" />
      </div>

      {/* Animacion central de corazon al dar doble toque */}
      {showHeartAnim && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center animate-ping">
          <Heart className="h-28 w-28 fill-white stroke-white drop-shadow-2xl" />
        </div>
      )}

      {/* Fila superior: Contexto del capitulo y conmutador rapido de version */}
      <div className="relative z-10 w-full flex items-center justify-between pt-2">
        {/* Capsula de capitulo */}
        <div className="flex items-center gap-2 bg-[#1c1b1d]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5 shadow-sm">
          <BookOpen className="h-3.5 w-3.5 text-white/70" />
          <span className="text-xs font-semibold tracking-wider text-white">
            {chapterDisplay}
          </span>
        </div>

        {/* Chip de conmutacion rapida de traduccion */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onVersionToggle?.();
          }}
          className="flex items-center gap-1.5 bg-[#1c1b1d]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5 shadow-sm active:scale-95 transition-transform text-white/80 hover:text-white"
        >
          <span className="text-xs font-bold tracking-wider text-white">
            {verse.version}
          </span>
          <Repeat className="h-3 w-3 text-white/50" />
        </button>
      </div>

      {/* Bloque central de lectura: tipografia editorial serif */}
      <main className="relative z-10 my-auto py-6 flex flex-col items-start pr-16 max-w-2xl">
        <blockquote className="text-left font-serif text-2xl sm:text-4xl md:text-5xl font-normal leading-[1.3] text-white tracking-tight drop-shadow-sm">
          “{verse.text}”
        </blockquote>

        {/* Insignias de referencia y contexto historico */}
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 bg-white px-3 py-1 rounded-full shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-black" />
            <span className="text-xs font-bold tracking-wide text-black uppercase font-sans">
              {verse.bookName} {verse.chapter}:{verse.verseNumber} · {verse.version}
            </span>
          </div>

          {verse.historicalContext && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#353437]/70 border border-white/10 backdrop-blur-sm">
              <span className="text-xs text-white/70 font-sans">
                {verse.historicalContext}
              </span>
            </div>
          )}
        </div>
      </main>

      {/* Riel flotante lateral de acciones (TikTok / Reels) */}
      <VerseActionBar
        isLiked={isLiked}
        likeCount={verse.likeCount ? verse.likeCount + (isLiked ? 1 : 0) : (isLiked ? 1 : 0)}
        isBookmarked={isBookmarked}
        notesCount={notesCount || verse.notesCount || 0}
        onLikeToggle={() => onLikeToggle?.(verse.id)}
        onBookmarkToggle={() => onBookmarkToggle?.(verse.id)}
        onOpenNotes={() => onOpenNotes?.(verse.id)}
        onShare={handleShare}
      />

      {/* Indicador inferior de avance y deslizamiento */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center pb-2">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1b1d]/70 backdrop-blur-md border border-white/5">
          <span className="text-[11px] font-medium tracking-wider text-white/60">
            Desliza para versiculo {verse.verseNumber + 1}
          </span>
          <ArrowUp className="h-3 w-3 text-white animate-bounce" />
        </div>
      </div>
    </article>
  );
};
