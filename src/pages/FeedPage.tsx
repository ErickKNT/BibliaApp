import React, { useState } from 'react';
import type { Verse, VerseNote } from '@/types/bible';
import { FeedLayout } from '@/components/templates/FeedLayout';
import { VerseCard } from '@/components/organisms/VerseCard';
import { NotesModal } from '@/components/organisms/NotesModal';

// Versículos iniciales de prueba (Reina-Valera 1909 - Dominio Público)
const SAMPLE_VERSES: Verse[] = [
  {
    id: 'jn-1-1',
    bookName: 'Juan',
    bookOrder: 43,
    chapter: 1,
    verseNumber: 1,
    text: 'En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.',
    version: 'RVR09',
    globalOrder: 26046,
  },
  {
    id: 'jn-1-2',
    bookName: 'Juan',
    bookOrder: 43,
    chapter: 1,
    verseNumber: 2,
    text: 'Este era en el principio con Dios.',
    version: 'RVR09',
    globalOrder: 26047,
  },
  {
    id: 'jn-1-3',
    bookName: 'Juan',
    bookOrder: 43,
    chapter: 1,
    verseNumber: 3,
    text: 'Todas las cosas por él fueron hechas; y sin él nada de lo que es hecho, fue hecho.',
    version: 'RVR09',
    globalOrder: 26048,
  },
  {
    id: 'jn-1-4',
    bookName: 'Juan',
    bookOrder: 43,
    chapter: 1,
    verseNumber: 4,
    text: 'En él estaba la vida, y la vida era la luz de los hombres.',
    version: 'RVR09',
    globalOrder: 26049,
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
  },
  {
    id: 'sal-23-1',
    bookName: 'Salmos',
    bookOrder: 19,
    chapter: 23,
    verseNumber: 1,
    text: 'Jehová es mi pastor; nada me faltará.',
    version: 'RVR09',
    globalOrder: 14241,
  },
];

export const FeedPage: React.FC = () => {
  const [verses] = useState<Verse[]>(SAMPLE_VERSES);
  const [likedVerseIds, setLikedVerseIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<VerseNote[]>([]);
  const [activeVerseForNotes, setActiveVerseForNotes] = useState<Verse | null>(null);

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

  const handleOpenNotes = (verseId: string) => {
    const verse = verses.find((v) => v.id === verseId);
    if (verse) {
      setActiveVerseForNotes(verse);
    }
  };

  const handleSaveNote = (verseId: string, content: string) => {
    const newNote: VerseNote = {
      id: `note-${Date.now()}`,
      verseId,
      userId: 'anonymous-user',
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  return (
    <>
      <FeedLayout>
        {verses.map((verse) => (
          <VerseCard
            key={verse.id}
            verse={verse}
            isLiked={likedVerseIds.has(verse.id)}
            onLikeToggle={handleLikeToggle}
            onOpenNotes={handleOpenNotes}
          />
        ))}
      </FeedLayout>

      <NotesModal
        verse={activeVerseForNotes}
        isOpen={Boolean(activeVerseForNotes)}
        notes={notes}
        onClose={() => setActiveVerseForNotes(null)}
        onSaveNote={handleSaveNote}
      />
    </>
  );
};
