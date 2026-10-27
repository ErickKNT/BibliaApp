import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Verse, VerseNote } from '@/types/bible';
import { FeedLayout } from '@/components/templates/FeedLayout';
import { VerseCard } from '@/components/organisms/VerseCard';
import { VerseActionBar } from '@/components/molecules/VerseActionBar';
import { NotesModal } from '@/components/organisms/NotesModal';
import { TopBar } from '@/components/organisms/TopBar';
import { BookExplorerModal } from '@/components/organisms/BookExplorerModal';
import { ProfileModal } from '@/components/organisms/ProfileModal';
import {
  getFeedVerses,
  toggleVerseLike,
  getVerseNotes,
  addVerseNote,
} from '@/services/bibleService';

export const FeedPage: React.FC = () => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>('RVR1960');
  const [activeVerseId, setActiveVerseId] = useState<string>('');

  const [likedVerseIds, setLikedVerseIds] = useState<Set<string>>(new Set());
  const [bookmarkedVerseIds, setBookmarkedVerseIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<VerseNote[]>([]);

  // Modales
  const [activeVerseForNotes, setActiveVerseForNotes] = useState<Verse | null>(null);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const feedContainerRef = useRef<HTMLDivElement>(null);

  // Carga de versiculos segun traduccion activa
  const loadVerses = useCallback(async (version: string) => {
    const data = await getFeedVerses(version);
    setVerses(data);
    if (data.length > 0) {
      setActiveVerseId(data[0].id);
    }
  }, []);

  useEffect(() => {
    loadVerses(currentVersion);

    // Cargar likes y marcadores locales previos si existen
    try {
      const localLikes = JSON.parse(localStorage.getItem('biblia_likes') || '[]');
      setLikedVerseIds(new Set(localLikes));

      const localBookmarks = JSON.parse(localStorage.getItem('biblia_bookmarks') || '[]');
      setBookmarkedVerseIds(new Set(localBookmarks));
    } catch {
      // Ignorar errores de lectura local
    }
  }, [currentVersion, loadVerses]);

  // Observador para detectar que versiculo esta centrado en pantalla
  useEffect(() => {
    const container = feedContainerRef.current;
    if (!container || verses.length === 0) return;

    const cards = container.querySelectorAll('.verse-snap-card');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-verse-id');
            if (id) {
              setActiveVerseId(id);
            }
          }
        }
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [verses]);

  // Versiculo activo actualmente enfocado
  const activeVerse = verses.find((v) => v.id === activeVerseId) || verses[0];

  const handleLikeToggle = async (verseId: string) => {
    const isCurrentlyLiked = likedVerseIds.has(verseId);
    
    // Actualizacion optimista inmediata
    setLikedVerseIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyLiked) {
        next.delete(verseId);
      } else {
        next.add(verseId);
      }
      return next;
    });

    // Persistir en Supabase / LocalStorage
    const finalLikedState = await toggleVerseLike(verseId, isCurrentlyLiked);
    setLikedVerseIds((prev) => {
      const next = new Set(prev);
      if (finalLikedState) {
        next.add(verseId);
      } else {
        next.delete(verseId);
      }
      return next;
    });
  };

  const handleBookmarkToggle = (verseId: string) => {
    setBookmarkedVerseIds((prev) => {
      const next = new Set(prev);
      if (next.has(verseId)) {
        next.delete(verseId);
      } else {
        next.add(verseId);
      }
      localStorage.setItem('biblia_bookmarks', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleOpenNotes = async (verseId: string) => {
    const verse = verses.find((v) => v.id === verseId);
    if (verse) {
      setActiveVerseForNotes(verse);
      const verseNotes = await getVerseNotes(verseId);
      setNotes(verseNotes);
    }
  };

  const handleSaveNote = async (verseId: string, content: string, isPrivate: boolean) => {
    const savedNote = await addVerseNote(verseId, content, isPrivate, isPrivate ? 'personal' : 'comunidad');
    if (savedNote) {
      setNotes((prev) => [savedNote, ...prev]);
    }
  };

  const handleShare = async (verse: Verse) => {
    const shareText = `"${verse.text}"\n— ${verse.bookName} ${verse.chapter}:${verse.verseNumber} (${verse.version})\n\nLeido en BibliaApp`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BibliaApp',
          text: shareText,
        });
      } catch {
        // cancelacion de usuario
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Versiculo copiado al portapapeles');
    }
  };

  const handleVersionCycle = () => {
    const versions = ['RVR1960', 'RVR09', 'WEB'];
    const nextIndex = (versions.indexOf(currentVersion) + 1) % versions.length;
    setCurrentVersion(versions[nextIndex]);
  };

  const bookmarkedVerses = verses.filter((v) => bookmarkedVerseIds.has(v.id));

  return (
    <div className="relative h-full w-full bg-[#131315]">
      {/* Barra superior fija */}
      <TopBar
        currentVersion={currentVersion}
        onOpenExplorer={() => setIsExplorerOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onVersionSelect={handleVersionCycle}
      />

      {/* Riel flotante lateral persistente (HUD fijo en pantalla) */}
      {activeVerse && (
        <VerseActionBar
          isLiked={likedVerseIds.has(activeVerse.id)}
          likeCount={
            activeVerse.likeCount
              ? activeVerse.likeCount + (likedVerseIds.has(activeVerse.id) ? 1 : 0)
              : (likedVerseIds.has(activeVerse.id) ? 1 : 0)
          }
          isBookmarked={bookmarkedVerseIds.has(activeVerse.id)}
          notesCount={notes.filter((n) => n.verseId === activeVerse.id).length || activeVerse.notesCount || 0}
          onLikeToggle={() => handleLikeToggle(activeVerse.id)}
          onBookmarkToggle={() => handleBookmarkToggle(activeVerse.id)}
          onOpenNotes={() => handleOpenNotes(activeVerse.id)}
          onShare={() => handleShare(activeVerse)}
        />
      )}

      {/* Feed principal de scroll vertical snap */}
      <FeedLayout ref={feedContainerRef}>
        {verses.map((verse) => (
          <VerseCard
            key={verse.id}
            verse={{
              ...verse,
              version: currentVersion,
            }}
            isLiked={likedVerseIds.has(verse.id)}
            onLikeToggle={handleLikeToggle}
            onVersionToggle={handleVersionCycle}
          />
        ))}
      </FeedLayout>

      {/* Modal de Notas y Reflexiones (Bottom Sheet) */}
      <NotesModal
        verse={activeVerseForNotes}
        isOpen={Boolean(activeVerseForNotes)}
        notes={notes}
        onClose={() => setActiveVerseForNotes(null)}
        onSaveNote={handleSaveNote}
      />

      {/* Modal de Explorador de Libros */}
      <BookExplorerModal
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        onSelectBook={(book) => {
          alert(`Navegando a ${book}`);
        }}
      />

      {/* Modal de Perfil, Guardados y Ajustes PWA */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        bookmarkedVerses={bookmarkedVerses}
        notes={notes}
        currentVersion={currentVersion}
        onSelectVersion={(ver) => setCurrentVersion(ver)}
      />
    </div>
  );
};
