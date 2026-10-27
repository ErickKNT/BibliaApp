import React, { useState } from 'react';
import type { Verse, VerseNote } from '@/types/bible';
import { FeedLayout } from '@/components/templates/FeedLayout';
import { VerseCard } from '@/components/organisms/VerseCard';
import { NotesModal } from '@/components/organisms/NotesModal';
import { TopBar } from '@/components/organisms/TopBar';
import { BookExplorerModal } from '@/components/organisms/BookExplorerModal';
import { ProfileModal } from '@/components/organisms/ProfileModal';

// Versiculos iniciales de demostracion (Dominio Publico)
const INITIAL_VERSES: Verse[] = [
  {
    id: 'flp-4-13',
    bookName: 'Filipenses',
    bookOrder: 50,
    chapter: 4,
    verseNumber: 13,
    text: 'Todo lo puedo en Cristo que me fortalece.',
    version: 'RVR09',
    globalOrder: 29462,
    chapterContext: 'FILIPENSES · CAP. 4',
    historicalContext: 'Contexto: Carta desde prision en Roma',
    likeCount: 12400,
    notesCount: 148,
  },
  {
    id: 'jn-1-1',
    bookName: 'Juan',
    bookOrder: 43,
    chapter: 1,
    verseNumber: 1,
    text: 'En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.',
    version: 'RVR09',
    globalOrder: 26046,
    chapterContext: 'JUAN · CAP. 1',
    historicalContext: 'Contexto: Prologo teologico de la encarnacion',
    likeCount: 9840,
    notesCount: 82,
  },
  {
    id: 'jn-1-5',
    bookName: 'Juan',
    bookOrder: 43,
    chapter: 1,
    verseNumber: 5,
    text: 'Y la luz en las tinieblas resplandece; mas las tinieblas no la comprendieron.',
    version: 'RVR09',
    globalOrder: 26050,
    chapterContext: 'JUAN · CAP. 1',
    historicalContext: 'Contexto: La victoria de la luz sobre el cosmos',
    likeCount: 7120,
    notesCount: 39,
  },
  {
    id: 'sal-23-1',
    bookName: 'Salmos',
    bookOrder: 19,
    chapter: 23,
    verseNumber: 1,
    text: 'Jehova es mi pastor; nada me faltara.',
    version: 'RVR09',
    globalOrder: 14241,
    chapterContext: 'SALMOS · CAP. 23',
    historicalContext: 'Contexto: Salmo pastoral de David en el desierto',
    likeCount: 18900,
    notesCount: 245,
  },
];

export const FeedPage: React.FC = () => {
  const [verses] = useState<Verse[]>(INITIAL_VERSES);
  const [currentVersion, setCurrentVersion] = useState<string>('RVR09');
  const [likedVerseIds, setLikedVerseIds] = useState<Set<string>>(new Set());
  const [bookmarkedVerseIds, setBookmarkedVerseIds] = useState<Set<string>>(new Set(['flp-4-13']));
  const [notes, setNotes] = useState<VerseNote[]>([
    {
      id: 'note-seed-1',
      verseId: 'flp-4-13',
      userId: 'user-1',
      content: 'Este versiculo no habla de exito material, sino del gozo y contentamiento en cualquier circunstancia.',
      isPrivate: true,
      category: 'personal',
      createdAt: '2026-10-25T10:00:00.000Z',
      updatedAt: '2026-10-25T10:00:00.000Z',
    },
    {
      id: 'note-seed-2',
      verseId: 'flp-4-13',
      userId: 'user-comunidad',
      content: 'Pablo escribio esto encadenado en Roma, lo cual magnifica la fuerza de su testimonio.',
      isPrivate: false,
      category: 'comunidad',
      createdAt: '2026-10-26T14:30:00.000Z',
      updatedAt: '2026-10-26T14:30:00.000Z',
    },
  ]);

  // Modales
  const [activeVerseForNotes, setActiveVerseForNotes] = useState<Verse | null>(null);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLikeToggle = (verseId: string) => {
    setLikedVerseIds((prev) => {
      const next = new Set(prev);
      if (next.has(verseId)) {
        next.delete(verseId);
      } else {
        next.add(verseId);
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
      return next;
    });
  };

  const handleOpenNotes = (verseId: string) => {
    const verse = verses.find((v) => v.id === verseId);
    if (verse) {
      setActiveVerseForNotes(verse);
    }
  };

  const handleSaveNote = (verseId: string, content: string, isPrivate: boolean) => {
    const newNote: VerseNote = {
      id: `note-${Date.now()}`,
      verseId,
      userId: 'anonymous-user',
      content,
      isPrivate,
      category: isPrivate ? 'personal' : 'comunidad',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleVersionCycle = () => {
    const versions = ['RVR09', 'WEB', 'BL95'];
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

      {/* Feed principal de scroll vertical tipo TikTok */}
      <FeedLayout>
        {verses.map((verse) => (
          <VerseCard
            key={verse.id}
            verse={{
              ...verse,
              version: currentVersion,
            }}
            isLiked={likedVerseIds.has(verse.id)}
            isBookmarked={bookmarkedVerseIds.has(verse.id)}
            notesCount={notes.filter((n) => n.verseId === verse.id).length}
            onLikeToggle={handleLikeToggle}
            onBookmarkToggle={handleBookmarkToggle}
            onOpenNotes={handleOpenNotes}
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
