import React, { useState } from 'react';
import type { BibleBook } from '@/types/bible';
import { X, Search, Bookmark, Book } from 'lucide-react';

const BOOKS_DATA: BibleBook[] = [
  // Antiguo Testamento (Muestra representativa)
  { name: 'Genesis', testament: 'antiguo', chaptersCount: 50, category: 'Pentateuco' },
  { name: 'Exodo', testament: 'antiguo', chaptersCount: 40, category: 'Pentateuco' },
  { name: 'Salmos', testament: 'antiguo', chaptersCount: 150, category: 'Poeticos' },
  { name: 'Proverbios', testament: 'antiguo', chaptersCount: 31, category: 'Poeticos' },
  { name: 'Isaias', testament: 'antiguo', chaptersCount: 66, category: 'Profetas Mayores' },
  // Nuevo Testamento (Muestra representativa)
  { name: 'Mateo', testament: 'nuevo', chaptersCount: 28, category: 'Evangelios' },
  { name: 'Marcos', testament: 'nuevo', chaptersCount: 16, category: 'Evangelios' },
  { name: 'Lucas', testament: 'nuevo', chaptersCount: 24, category: 'Evangelios' },
  { name: 'Juan', testament: 'nuevo', chaptersCount: 21, category: 'Evangelios' },
  { name: 'Hechos', testament: 'nuevo', chaptersCount: 28, category: 'Historico' },
  { name: 'Romanos', testament: 'nuevo', chaptersCount: 16, category: 'Epistolas Paulinas' },
  { name: 'Filipenses', testament: 'nuevo', chaptersCount: 4, category: 'Epistolas Paulinas' },
  { name: 'Apocalipsis', testament: 'nuevo', chaptersCount: 22, category: 'Profecia' },
];

export interface BookExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBook?: (bookName: string) => void;
}

export const BookExplorerModal: React.FC<BookExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectBook,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [testament, setTestament] = useState<'antiguo' | 'nuevo'>('nuevo');

  if (!isOpen) return null;

  const filteredBooks = BOOKS_DATA.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTestament = b.testament === testament;
    return matchesSearch && (searchQuery.trim() ? true : matchesTestament);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0e0e10]/80 backdrop-blur-md"
      />

      <section
        aria-label="Explorador de Libros"
        className="relative z-50 flex h-full sm:h-[750px] w-full max-w-2xl flex-col rounded-none sm:rounded-3xl border-0 sm:border border-white/10 bg-[#131315] text-white shadow-2xl overflow-hidden"
      >
        {/* Cabecera superior */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-white" />
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Explorador Biblico
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Buscador */}
        <div className="px-6 py-3 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar libro, capitulo o pasaje..."
              className="w-full rounded-xl border border-white/10 bg-[#201f22] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/40 focus:border-white focus:outline-none"
            />
          </div>
        </div>

        {/* Conmutador de testamento (Antiguo / Nuevo) */}
        {!searchQuery.trim() && (
          <div className="px-6 py-2.5 flex items-center gap-2 border-b border-white/5 bg-[#171618]">
            <button
              type="button"
              onClick={() => setTestament('antiguo')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                testament === 'antiguo'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Antiguo Testamento (39)
            </button>
            <button
              type="button"
              onClick={() => setTestament('nuevo')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                testament === 'nuevo'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Nuevo Testamento (27)
            </button>
          </div>
        )}

        {/* Listado de libros en cuadricula limpia */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 gap-3 no-scrollbar">
          {filteredBooks.map((book) => (
            <button
              key={book.name}
              type="button"
              onClick={() => {
                onSelectBook?.(book.name);
                onClose();
              }}
              className="flex flex-col items-start rounded-xl border border-white/5 bg-[#201f22] p-3.5 hover:bg-[#2a2a2c] hover:border-white/20 active:scale-95 transition-all text-left"
            >
              <span className="text-sm font-semibold text-white">
                {book.name}
              </span>
              <span className="text-[11px] text-white/50 mt-1">
                {book.chaptersCount} capitulos · {book.category}
              </span>
            </button>
          ))}
        </div>

        {/* Pie con atajo rapido */}
        <div className="border-t border-white/5 bg-[#171618] px-6 py-3 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-1.5">
            <Bookmark className="h-3.5 w-3.5" />
            <span>Ultima lectura: Juan Capitulo 1</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:underline font-medium"
          >
            Reanudar
          </button>
        </div>
      </section>
    </div>
  );
};
