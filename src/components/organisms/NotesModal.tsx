import React, { useState } from 'react';
import type { Verse, VerseNote } from '@/types/bible';
import { X, Send, Lock, Globe, MessageSquare } from 'lucide-react';

export interface NotesModalProps {
  verse: Verse | null;
  isOpen: boolean;
  notes: VerseNote[];
  onClose: () => void;
  onSaveNote: (verseId: string, content: string, isPrivate: boolean) => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({
  verse,
  isOpen,
  notes,
  onClose,
  onSaveNote,
}) => {
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'todas' | 'personal' | 'comunidad'>('todas');

  if (!isOpen || !verse) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSaveNote(verse.id, content.trim(), isPrivate);
    setContent('');
  };

  const verseNotes = notes.filter((n) => n.verseId === verse.id);
  const filteredNotes = verseNotes.filter((n) => {
    if (activeFilter === 'personal') return n.category === 'personal' || n.isPrivate;
    if (activeFilter === 'comunidad') return !n.isPrivate || n.category === 'comunidad';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Velo de desenfoque de fondo */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0e0e10]/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Drawer deslizante inferior */}
      <section
        aria-label="Notas y Reflexiones"
        className="relative z-50 flex h-[85vh] sm:h-[680px] w-full max-w-xl flex-col justify-between rounded-t-3xl border-t border-white/10 bg-[#1c1b1d] text-white shadow-2xl overflow-hidden"
      >
        {/* Barra de agarre tactil */}
        <div className="flex w-full justify-center pt-3 pb-2 cursor-grab">
          <div className="h-1 w-12 rounded-full bg-white/20" />
        </div>

        {/* Cabecera */}
        <div className="px-6 pt-1 pb-3 flex items-center justify-between border-b border-white/5">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-white">
                Notas & Reflexiones
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#353437] text-white text-[11px] font-medium">
                {verse.bookName} {verse.chapter}:{verse.verseNumber}
              </span>
            </div>
            <p className="text-xs text-white/50">
              Version {verse.version}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pildoras de filtro */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-white/5">
          <button
            type="button"
            onClick={() => setActiveFilter('todas')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeFilter === 'todas'
                ? 'bg-white text-black font-semibold'
                : 'bg-[#2a2a2c] text-white/70 hover:text-white'
            }`}
          >
            Todas ({verseNotes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('personal')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeFilter === 'personal'
                ? 'bg-white text-black font-semibold'
                : 'bg-[#2a2a2c] text-white/70 hover:text-white'
            }`}
          >
            Mis Notas
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('comunidad')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              activeFilter === 'comunidad'
                ? 'bg-white text-black font-semibold'
                : 'bg-[#2a2a2c] text-white/70 hover:text-white'
            }`}
          >
            Comunidad
          </button>
        </div>

        {/* Lista deslizable de notas */}
        <div className="my-2 flex-1 overflow-y-auto px-6 space-y-3 no-scrollbar">
          {filteredNotes.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center">
              <MessageSquare className="h-8 w-8 text-white/20 mb-2" />
              <p className="text-sm text-white/50">
                Aun no hay reflexiones en esta categoria.
              </p>
              <p className="text-xs text-white/30 mt-1">
                Escribe tu pensamiento personal en el cuadro inferior.
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-white/10 bg-[#201f22] p-4 text-sm leading-relaxed border-l-2 border-l-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/60">
                    {note.isPrivate ? (
                      <>
                        <Lock className="h-3 w-3 text-white/50" />
                        Privada
                      </>
                    ) : (
                      <>
                        <Globe className="h-3 w-3 text-white/50" />
                        Compartida
                      </>
                    )}
                  </span>
                  <span className="text-[10px] text-white/40">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-white/90">{note.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Caja de redaccion rapida */}
        <form onSubmit={handleSubmit} className="border-t border-white/10 bg-[#171618] p-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs text-white/60">Nueva reflexion</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-colors ${
                  isPrivate ? 'bg-white text-black font-semibold' : 'text-white/50 hover:text-white'
                }`}
              >
                <Lock className="h-3 w-3" /> Privada
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full transition-colors ${
                  !isPrivate ? 'bg-white text-black font-semibold' : 'text-white/50 hover:text-white'
                }`}
              >
                <Globe className="h-3 w-3" /> Compartir
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tu reflexion sobre este versiculo..."
              rows={2}
              className="w-full resize-none rounded-xl border border-white/10 bg-[#201f22] p-3 pr-12 text-sm text-white placeholder-white/40 focus:border-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={!content.trim()}
              className="absolute bottom-3 right-3 rounded-lg bg-white p-2 text-black transition-opacity disabled:opacity-30"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
