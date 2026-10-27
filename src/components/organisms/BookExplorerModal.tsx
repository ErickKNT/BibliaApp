import React, { useState, useMemo } from 'react';
import { CANONICAL_BOOKS, type CanonicalBook } from '@/data/bibleBooks';
import { X, Search, Bookmark, Book, ArrowLeft, ChevronRight, Check } from 'lucide-react';

export interface BookExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBookAndChapter: (bookOrder: number, chapter: number, bookName: string) => void;
  activeBookOrder?: number;
  activeChapter?: number;
  lastReading?: {
    bookOrder: number;
    chapter: number;
    bookName: string;
  };
}

// Helper para normalizar texto eliminando tildes y diacriticos
function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export const BookExplorerModal: React.FC<BookExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectBookAndChapter,
  activeBookOrder,
  activeChapter,
  lastReading = { bookOrder: 1, chapter: 1, bookName: 'Génesis' },
}) => {
  const [view, setView] = useState<'books' | 'chapters'>('books');
  const [selectedBook, setSelectedBook] = useState<CanonicalBook | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [testament, setTestament] = useState<'antiguo' | 'nuevo'>('antiguo');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');

  // Filtrado reactivo de libros
  const filteredBooks = useMemo(() => {
    const query = normalizeText(searchQuery.trim());

    return CANONICAL_BOOKS.filter((b) => {
      // Si hay busqueda textual, busca en todo el canon (nombre, abreviatura y categoria)
      if (query) {
        const nameMatch = normalizeText(b.name).includes(query);
        const abbrevMatch = normalizeText(b.abbrev).includes(query);
        const categoryMatch = normalizeText(b.category).includes(query);
        return nameMatch || abbrevMatch || categoryMatch;
      }

      // Si no hay busqueda, filtra por testamento
      const matchesTestament = b.testament === testament;
      if (!matchesTestament) return false;

      // Filtro adicional por categoria si esta seleccionada
      if (categoryFilter !== 'todos') {
        return b.category.toLowerCase().includes(categoryFilter.toLowerCase());
      }

      return true;
    });
  }, [searchQuery, testament, categoryFilter]);

  // Lista de categorias segun testamento activo
  const categories = useMemo(() => {
    const set = new Set<string>();
    CANONICAL_BOOKS.filter((b) => b.testament === testament).forEach((b) => set.add(b.category));
    return ['todos', ...Array.from(set)];
  }, [testament]);

  if (!isOpen) return null;

  const handleBookClick = (book: CanonicalBook) => {
    setSelectedBook(book);
    setView('chapters');
  };

  const handleChapterClick = (chapterNumber: number) => {
    if (!selectedBook) return;
    onSelectBookAndChapter(selectedBook.order, chapterNumber, selectedBook.name);
    onClose();
  };

  const handleResumeLastReading = () => {
    onSelectBookAndChapter(lastReading.bookOrder, lastReading.chapter, lastReading.bookName);
    onClose();
  };

  const handleBackToBooks = () => {
    setView('books');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in select-none">
      {/* Velo de fondo oscuro */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0e0e10]/80 backdrop-blur-md"
      />

      <section
        aria-label="Explorador de Libros de la Biblia"
        className="relative z-50 flex h-full sm:h-[750px] w-full max-w-2xl flex-col rounded-none sm:rounded-3xl border-0 sm:border border-white/10 bg-[#131315] text-white shadow-2xl overflow-hidden"
      >
        {/* Cabecera segun la vista activa */}
        {view === 'books' ? (
          <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <Book className="h-5 w-5 text-white" />
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-white leading-none">
                  Explorador Biblico
                </h2>
                <span className="text-[11px] text-white/50 leading-tight">
                  66 libros · 1,189 capitulos
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/5 bg-[#171618]">
            <button
              type="button"
              onClick={handleBackToBooks}
              className="flex items-center gap-2 text-xs font-semibold text-white/80 hover:text-white transition-colors py-1 px-2.5 rounded-lg hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a libros
            </button>
            <div className="text-center">
              <h2 className="text-base font-bold text-white leading-none">
                {selectedBook?.name}
              </h2>
              <span className="text-[11px] text-white/50">
                {selectedBook?.chapters} capitulos · {selectedBook?.category}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Vista 1: Listado y Busqueda de Libros */}
        {view === 'books' && (
          <>
            {/* Buscador inteligente */}
            <div className="px-6 py-3 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por libro (ej. Génesis, Salmos, Mateo, Lucas)..."
                  className="w-full rounded-xl border border-white/10 bg-[#201f22] py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/40 focus:border-white focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-white/40 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Conmutador de testamento (Antiguo 39 / Nuevo 27) */}
            {!searchQuery.trim() && (
              <div className="px-6 py-2.5 flex items-center gap-2 border-b border-white/5 bg-[#171618]">
                <button
                  type="button"
                  onClick={() => {
                    setTestament('antiguo');
                    setCategoryFilter('todos');
                  }}
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
                  onClick={() => {
                    setTestament('nuevo');
                    setCategoryFilter('todos');
                  }}
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

            {/* Pildoras de categorias */}
            {!searchQuery.trim() && categories.length > 2 && (
              <div className="px-6 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-white/5 bg-[#141416]">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      categoryFilter === cat
                        ? 'bg-white text-black font-semibold'
                        : 'bg-[#201f22] text-white/60 hover:text-white'
                    }`}
                  >
                    {cat === 'todos' ? 'Todos' : cat}
                  </button>
                ))}
              </div>
            )}

            {/* Listado en cuadricula limpia */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 no-scrollbar">
              {filteredBooks.length === 0 ? (
                <div className="col-span-full flex h-48 flex-col items-center justify-center text-center">
                  <Search className="h-8 w-8 text-white/20 mb-2" />
                  <p className="text-sm text-white/60">
                    No se encontraron libros que coincidan con "{searchQuery}".
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-xs text-white underline font-semibold"
                  >
                    Limpiar busqueda
                  </button>
                </div>
              ) : (
                filteredBooks.map((book) => {
                  const isCurrent = activeBookOrder === book.order;
                  return (
                    <button
                      key={book.order}
                      type="button"
                      onClick={() => handleBookClick(book)}
                      className={`group flex items-center justify-between rounded-xl border p-3.5 transition-all text-left ${
                        isCurrent
                          ? 'border-white bg-[#2a2a2c] shadow-sm'
                          : 'border-white/5 bg-[#201f22] hover:bg-[#28272a] hover:border-white/20 active:scale-[0.98]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white uppercase group-hover:bg-white group-hover:text-black transition-colors">
                          {book.abbrev}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-white">
                              {book.name}
                            </span>
                            {isCurrent && (
                              <Check className="h-3.5 w-3.5 text-white" />
                            )}
                          </div>
                          <span className="block text-[11px] text-white/50 mt-0.5">
                            {book.chapters} cap. · {book.category}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white transition-colors" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Pie con atajo rapido a ultima lectura */}
            <div className="border-t border-white/5 bg-[#171618] px-6 py-3 flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center gap-2">
                <Bookmark className="h-3.5 w-3.5 text-white/70" />
                <span>
                  Ultima lectura:{' '}
                  <strong className="text-white">
                    {lastReading.bookName} Cap. {lastReading.chapter}
                  </strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleResumeLastReading}
                className="rounded-lg bg-white/10 hover:bg-white hover:text-black px-3 py-1 text-white font-semibold transition-colors"
              >
                Reanudar
              </button>
            </div>
          </>
        )}

        {/* Vista 2: Selector de Capitulos del Libro */}
        {view === 'chapters' && selectedBook && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-[#151416]">
              <span className="text-xs text-white/70">
                Selecciona un capitulo para comenzar a leer:
              </span>
              <button
                type="button"
                onClick={() => handleChapterClick(1)}
                className="text-xs font-semibold text-white bg-white/10 hover:bg-white hover:text-black px-3 py-1 rounded-lg transition-colors"
              >
                Iniciar en Cap. 1
              </button>
            </div>

            {/* Cuadricula numerica de capitulos */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 no-scrollbar">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => {
                const isSelected =
                  activeBookOrder === selectedBook.order && activeChapter === ch;

                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => handleChapterClick(ch)}
                    className={`flex h-12 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-white text-black shadow-md scale-105'
                        : 'bg-[#201f22] text-white/80 hover:bg-white/20 hover:text-white border border-white/5 active:scale-95'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>

            {/* Pie en vista de capitulos */}
            <div className="border-t border-white/5 bg-[#171618] px-6 py-3 flex items-center justify-between text-xs text-white/60">
              <span>{selectedBook.name}: {selectedBook.chapters} capitulos disponibles</span>
              <button
                type="button"
                onClick={handleBackToBooks}
                className="text-white hover:underline font-medium"
              >
                Elegir otro libro
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
