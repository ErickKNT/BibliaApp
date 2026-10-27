import React, { useState } from 'react';
import type { Verse } from '@/types/bible';
import { Badge } from '@/components/atoms/Badge';
import { VerseActionBar } from '@/components/molecules/VerseActionBar';
import { Heart } from 'lucide-react';

export interface VerseCardProps {
  verse: Verse;
  isLiked?: boolean;
  onLikeToggle?: (verseId: string) => void;
  onOpenNotes?: (verseId: string) => void;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  isLiked = false,
  onLikeToggle,
  onOpenNotes,
}) => {
  const [showHeartAnim, setShowHeartAnim] = useState(false);
  const [lastTap, setLastTap] = useState<number>(0);

  // Gesto de doble toque para dar Like estilo TikTok
  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (!isLiked) {
        onLikeToggle?.(verse.id);
      }
      setShowHeartAnim(true);
      setTimeout(() => setShowHeartAnim(false), 800);
    }
    setLastTap(now);
  };

  const handleShare = async () => {
    const shareText = `"${verse.text}" — ${verse.bookName} ${verse.chapter}:${verse.verseNumber} (${verse.version})`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BibliaApp',
          text: shareText,
        });
      } catch {
        // Ignorar cancelación del usuario
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Versículo copiado al portapapeles');
    }
  };

  return (
    <article
      onClick={handleTap}
      className="relative flex h-[100dvh] w-full flex-col justify-between overflow-hidden bg-black p-6 sm:p-12 snap-start select-none"
    >
      {/* Animación flotante de doble tap (corazón blanco puro) */}
      {showHeartAnim && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center animate-ping">
          <Heart className="h-28 w-28 fill-white stroke-white drop-shadow-2xl" />
        </div>
      )}

      {/* Cabecera superior: Referencia bíblica y versión */}
      <header className="z-10 flex items-center justify-between pt-safe">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-semibold tracking-wider text-white">
            {verse.bookName} {verse.chapter}:{verse.verseNumber}
          </h2>
          <Badge variant="outline">{verse.version}</Badge>
        </div>
      </header>

      {/* Cuerpo principal: El versículo con tipografía editorial */}
      <main className="z-10 my-auto flex max-w-3xl flex-col justify-center px-2 sm:px-6">
        <span className="mb-2 text-xs font-mono uppercase tracking-widest text-white/40">
          Versículo {verse.verseNumber}
        </span>
        <blockquote className="font-serif text-2xl sm:text-4xl md:text-5xl font-light leading-relaxed sm:leading-snug text-white">
          “{verse.text}”
        </blockquote>
      </main>

      {/* Barra de acciones flotante (Like, Notas, Compartir) */}
      <VerseActionBar
        isLiked={isLiked}
        onLikeToggle={() => onLikeToggle?.(verse.id)}
        onOpenNotes={() => onOpenNotes?.(verse.id)}
        onShare={handleShare}
      />

      {/* Pie sutil con indicador de swipe */}
      <footer className="z-10 flex justify-center pb-safe">
        <div className="h-1 w-12 rounded-full bg-white/20 animate-pulse" />
      </footer>
    </article>
  );
};

