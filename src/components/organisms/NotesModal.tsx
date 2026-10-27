import React, { useState } from 'react';
import type { Verse, VerseNote } from '@/types/bible';
import { X, Send } from 'lucide-react';

export interface NotesModalProps {
  verse: Verse | null;
  isOpen: boolean;
  notes: VerseNote[];
  onClose: () => void;
  onSaveNote: (verseId: string, content: string) => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({
  verse,
  isOpen,
  notes,
  onClose,
  onSaveNote,
}) => {
  const [content, setContent] = useState('');

  if (!isOpen || !verse) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSaveNote(verse.id, content.trim());
    setContent('');
  };

  const verseNotes = notes.filter((n) => n.verseId === verse.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4 animate-in fade-in">
      <div className="flex h-[80vh] sm:h-[600px] w-full max-w-lg flex-col justify-between rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 text-white shadow-2xl">
        {/* Cabecera del modal */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-semibold">Notas y Reflexiones</h3>
            <p className="text-xs text-white/50">
              {verse.bookName} {verse.chapter}:{verse.verseNumber} ({verse.version})
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lista de notas previas */}
        <div className="my-4 flex-1 overflow-y-auto space-y-3 no-scrollbar pr-1">
          {verseNotes.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center">
              <p className="text-sm text-white/40">
                Aún no tienes notas sobre este versículo.<br />
                Escribe tu reflexión abajo.
              </p>
            </div>
          ) : (
            verseNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed"
              >
                <p className="text-white/90">{note.content}</p>
                <span className="mt-2 block text-[10px] text-white/40">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Formulario de nueva nota */}
        <form onSubmit={handleSubmit} className="relative mt-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe tu reflexión personal..."
            rows={2}
            className="w-full resize-none rounded-xl border border-white/15 bg-white/5 p-3 pr-12 text-sm text-white placeholder-white/40 focus:border-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="absolute bottom-3 right-3 rounded-lg bg-white p-2 text-black transition-opacity disabled:opacity-30"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

