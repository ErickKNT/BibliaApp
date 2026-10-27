import React, { useState } from 'react';
import type { Verse } from '@/types/bible';
import { Heart, BookOpen, ArrowUp, Repeat } from 'lucide-react';

export interface VerseCardProps {
  verse: Verse;
  isLiked?: boolean;
  fontSize?: 'normal' | 'grande' | 'extra';
  onLikeToggle?: (verseId: string) => void;
  onVersionToggle?: () => void;
  onChapterClick?: (verse: Verse) => void;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  isLiked = false,
  fontSize = 'normal',
  onLikeToggle,
  onVersionToggle,
  onChapterClick,
}) => {
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [lastTap, setLastTap] = useState<number>(0);

  // Doble toque en cualquier parte del versiculo para dar Me gusta
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

  const chapterDisplay = verse.chapterContext || `${verse.bookName.toUpperCase()} · CAP. ${verse.chapter}`;

  const fontSizeClasses = {
    normal: 'text-2xl sm:text-4xl md:text-5xl leading-[1.35]',
    grande: 'text-3xl sm:text-5xl md:text-6xl leading-[1.3]',
    extra: 'text-4xl sm:text-6xl md:text-7xl leading-[1.25]',
  }[fontSize];

  return (
    <article
      data-verse-id={verse.id}
      onClick={handleTap}
      className="verse-snap-card relative flex h-[100dvh] w-full flex-col justify-between overflow-hidden bg-[#131315] px-6 sm:px-12 pt-16 pb-6 snap-start select-none"
    >
      {/* Resplandor ambiental de profundidad */}
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
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChapterClick?.(verse);
          }}
          className="flex items-center gap-2 bg-[#1c1b1d]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm hover:bg-[#28272a] hover:border-white/20 active:scale-95 transition-all text-left"
          title="Abrir explorador en este libro"
        >
          <BookOpen className="h-3.5 w-3.5 text-white/70" />
          <span className="text-xs font-semibold tracking-wider text-white">
            {chapterDisplay}
          </span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onVersionToggle?.();
          }}
          className="flex items-center gap-1.5 bg-[#1c1b1d]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm active:scale-95 transition-all text-white/80 hover:text-white"
          title="Alternar traduccion"
        >
          <span className="text-xs font-bold tracking-wider text-white">
            {verse.version}
          </span>
          <Repeat className="h-3 w-3 text-white/50" />
        </button>
      </div>

      {/* Bloque central de lectura: tipografia editorial serif */}
      <main className="relative z-10 my-auto py-6 flex flex-col items-start pr-20 max-w-3xl">
        <blockquote className={`text-left font-serif font-normal text-white tracking-tight drop-shadow-sm ${fontSizeClasses}`}>
          “{verse.text}”
        </blockquote>

        {/* Insignias de referencia y contexto historico */}
        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-1.5 bg-white px-3.5 py-1 rounded-full shadow-md">
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

      {/* Indicador inferior de avance y deslizamiento */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center pb-2">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c1b1d]/70 backdrop-blur-md border border-white/5">
          <span className="text-[11px] font-medium tracking-wider text-white/60">
            Desliza para versiculo siguiente
          </span>
          <ArrowUp className="h-3 w-3 text-white animate-bounce" />
        </div>
      </div>
    </article>
  );
};
