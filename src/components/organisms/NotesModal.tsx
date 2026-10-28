import React, { useState } from 'react';
import type { Verse, VerseNote } from '@/types/bible';
import { X, Send, Lock, Globe, MessageSquare, Layers } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 select-none animate-in fade-in">
      {/* Velo de desenfoque a pantalla completa real */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm"
      />

      {/* Contenedor flexible inferior o centrado */}
      <div
        className="relative z-10 flex h-full w-full items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0rem)',
        }}
      >
        <section
        aria-label="Notas y Reflexiones"
        className="pointer-events-auto relative z-10 flex h-[85dvh] sm:h-[600px] max-h-[90dvh] sm:max-h-[calc(100dvh-2.5rem)] w-full max-w-xl flex-col rounded-t-3xl sm:rounded-3xl border-t sm:border border-black/10 dark:border-white/10 bg-[#fcfbf9] dark:bg-[#1c1b1d] text-[#18181b] dark:text-white shadow-xl overflow-hidden min-h-0 transition-colors duration-200"
      >
        {/* Barra de agarre tactil */}
        <div className="flex w-full justify-center pt-3 pb-1.5 cursor-grab shrink-0">
          <div className="h-1 w-12 rounded-full bg-black/20 dark:bg-white/20" />
        </div>

        {/* Cabecera */}
        <div className="px-5 sm:px-6 pt-1 pb-3 flex items-center justify-between border-b border-black/5 dark:border-white/5 shrink-0 bg-[#fcfbf9] dark:bg-[#1c1b1d]">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm sm:text-base font-semibold tracking-tight text-black dark:text-white leading-none">
                Notas & Reflexiones
              </h2>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#edece6] dark:bg-[#353437] text-black dark:text-white text-[10px] sm:text-[11px] font-medium">
                {verse.bookName} {verse.chapter}:{verse.verseNumber}
              </span>
            </div>
            <p className="text-[11px] text-black/50 dark:text-white/50">
              Version {verse.version}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Pildoras de filtro */}
        <div className="flex items-center gap-2 px-5 sm:px-6 py-2 border-b border-black/5 dark:border-white/5 shrink-0 bg-[#f5f4ef] dark:bg-[#171618]">
          <button
            type="button"
            onClick={() => setActiveFilter('todas')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
              activeFilter === 'todas'
                ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                : 'bg-[#edece6] text-black/70 hover:text-black dark:bg-[#2a2a2c] dark:text-white/70 dark:hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Todas ({verseNotes.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('personal')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
              activeFilter === 'personal'
                ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                : 'bg-[#edece6] text-black/70 hover:text-black dark:bg-[#2a2a2c] dark:text-white/70 dark:hover:text-white'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Personales</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('comunidad')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
              activeFilter === 'comunidad'
                ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                : 'bg-[#edece6] text-black/70 hover:text-black dark:bg-[#2a2a2c] dark:text-white/70 dark:hover:text-white'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>Comunidad</span>
          </button>
        </div>

        {/* Lista deslizable de notas con scroll interno */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 py-3 space-y-3 no-scrollbar">
          {filteredNotes.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <MessageSquare className="h-7 w-7 text-black/20 dark:text-white/20 mb-2" />
              <p className="text-xs sm:text-sm text-black/50 dark:text-white/50">
                Aun no hay reflexiones en esta categoria.
              </p>
              <p className="text-[11px] text-black/30 dark:text-white/30 mt-1">
                Escribe tu pensamiento personal en el cuadro inferior.
              </p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-black/10 dark:border-white/10 bg-[#edece6] dark:bg-[#201f22] p-3.5 text-xs sm:text-sm leading-relaxed border-l-2 border-l-black dark:border-l-white"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-black/60 dark:text-white/60">
                    {note.isPrivate ? (
                      <>
                        <Lock className="h-3 w-3 text-black/50 dark:text-white/50" />
                        Privada
                      </>
                    ) : (
                      <>
                        <Globe className="h-3 w-3 text-black/50 dark:text-white/50" />
                        Compartida
                      </>
                    )}
                  </span>
                  <span className="text-[10px] text-black/40 dark:text-white/40">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-black/90 dark:text-white/90">{note.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Caja de redaccion rapida */}
        <form onSubmit={handleSubmit} className="border-t border-black/10 dark:border-white/10 bg-[#f5f4ef] dark:bg-[#171618] p-3.5 sm:p-4 shrink-0">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs text-black/60 dark:text-white/60">Nueva reflexion</span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setIsPrivate(true)}
                className={`flex items-center gap-1 text-[11px] sm:text-xs px-2.5 py-1 rounded-full transition-colors ${
                  isPrivate
                    ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                    : 'text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white'
                }`}
              >
                <Lock className="h-3 w-3" /> Privada
              </button>
              <button
                type="button"
                onClick={() => setIsPrivate(false)}
                className={`flex items-center gap-1 text-[11px] sm:text-xs px-2.5 py-1 rounded-full transition-colors ${
                  !isPrivate
                    ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                    : 'text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white'
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
              className="w-full resize-none rounded-xl border border-black/10 dark:border-white/10 bg-[#edece6] dark:bg-[#201f22] p-2.5 sm:p-3 pr-11 text-xs sm:text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:border-black dark:focus:border-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={!content.trim()}
              className="absolute bottom-2.5 right-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black p-2 transition-opacity disabled:opacity-30 shadow-xs"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
      </div>
    </div>
  );
};
