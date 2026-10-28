import React, { useState } from 'react';
import type { Verse } from '@/types/bible';
import { Heart, ArrowUp } from 'lucide-react';

export interface VerseCardProps {
  verse: Verse;
  isLiked?: boolean;
  fontSize?: 'normal' | 'grande' | 'extra';
  onLikeToggle?: (verseId: string) => void;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  isLiked = false,
  fontSize = 'normal',
  onLikeToggle,
}) => {
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [lastTap, setLastTap] = useState<number>(0);

  // Doble toque en cualquier parte de la tarjeta para dar Me gusta
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

  const fontSizeClasses = {
    normal: 'text-2xl sm:text-4xl md:text-5xl leading-[1.35]',
    grande: 'text-3xl sm:text-5xl md:text-6xl leading-[1.3]',
    extra: 'text-4xl sm:text-6xl md:text-7xl leading-[1.25]',
  }[fontSize];

  return (
    <article
      data-verse-id={verse.id}
      onClick={handleTap}
      className="verse-snap-card relative flex h-[100dvh] w-full flex-col justify-between overflow-hidden bg-[#f8f7f4] dark:bg-[#131315] px-5 sm:px-12 pt-16 sm:pt-20 pb-6 sm:pb-8 snap-start select-none transition-colors duration-200"
    >
      {/* Resplandor ambiental de profundidad segun tema */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-80 h-80 rounded-full bg-[#dedbd2]/60 dark:bg-[#353437] blur-[110px] opacity-40 dark:opacity-25" />
      </div>

      {/* Animacion central de corazon al dar doble toque */}
      {showHeartAnim && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center animate-ping">
          <Heart className="h-24 w-24 fill-black stroke-black dark:fill-white dark:stroke-white drop-shadow-2xl" />
        </div>
      )}

      {/* Espaciador superior limpio */}
      <div className="h-2 shrink-0" />

      {/* Bloque central de lectura: tipografia editorial serif grande */}
      <main className="relative z-10 my-auto py-4 sm:py-6 flex flex-col items-start pr-14 sm:pr-24 max-w-3xl">
        <blockquote
          className={`text-left font-serif font-normal text-[#18181b] dark:text-white tracking-tight drop-shadow-sm ${fontSizeClasses}`}
        >
          “{verse.text}”
        </blockquote>

        {/* Insignias de referencia y contexto historico discretas y elegantes */}
        <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="inline-flex items-center gap-1.5 bg-[#18181b] dark:bg-white text-white dark:text-black px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-white dark:bg-black" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-wide uppercase font-sans">
              {verse.bookName} {verse.chapter}:{verse.verseNumber} · {verse.version}
            </span>
          </div>

          {verse.historicalContext && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#edece6] dark:bg-[#353437]/70 border border-black/5 dark:border-white/10 backdrop-blur-sm">
              <span className="text-[10px] sm:text-xs text-black/70 dark:text-white/70 font-sans">
                {verse.historicalContext}
              </span>
            </div>
          )}
        </div>
      </main>

      {/* Indicador inferior de avance y deslizamiento discreto */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center pb-1 shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edece6]/80 dark:bg-[#1c1b1d]/70 backdrop-blur-md border border-black/5 dark:border-white/5 shadow-xs">
          <span className="text-[10px] sm:text-[11px] font-medium tracking-wider text-black/60 dark:text-white/60">
            Desliza para versiculo siguiente
          </span>
          <ArrowUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-black/80 dark:text-white animate-bounce" />
        </div>
      </div>
    </article>
  );
};
