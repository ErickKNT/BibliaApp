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

  const filteredBooks = useMemo(() => {
    const query = normalizeText(searchQuery.trim());

    return CANONICAL_BOOKS.filter((b) => {
      if (query) {
        const nameMatch = normalizeText(b.name).includes(query);
        const abbrevMatch = normalizeText(b.abbrev).includes(query);
        const categoryMatch = normalizeText(b.category).includes(query);
        return nameMatch || abbrevMatch || categoryMatch;
      }

      const matchesTestament = b.testament === testament;
      if (!matchesTestament) return false;

      if (categoryFilter !== 'todos') {
        return b.category.toLowerCase().includes(categoryFilter.toLowerCase());
      }

      return true;
    });
  }, [searchQuery, testament, categoryFilter]);

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
    <div className="fixed inset-0 z-50 select-none animate-in fade-in">
      {/* Velo de desenfoque a pantalla completa real */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm"
      />

      {/* Contenedor flexible centrado con respeto de safe area insets */}
      <div
        className="relative z-10 flex h-full w-full items-center justify-center p-2 sm:p-4 pointer-events-none"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.5rem)',
        }}
      >
        <section
        aria-label="Explorador de Libros de la Biblia"
        className="pointer-events-auto relative z-10 flex h-[92dvh] sm:h-[620px] max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2.5rem)] w-full max-w-2xl flex-col rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/10 bg-[#fcfbf9] dark:bg-[#131315] text-[#18181b] dark:text-white shadow-xl overflow-hidden min-h-0 transition-colors duration-200"
      >
        {/* Cabecera segun la vista activa */}
        {view === 'books' ? (
          <div className="px-5 sm:px-6 pt-4 pb-3 sm:py-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 shrink-0 bg-[#fcfbf9] dark:bg-[#131315]">
            <div className="flex items-center gap-2.5">
              <Book className="h-5 w-5 text-black dark:text-white" />
              <div>
                <h2 className="text-base sm:text-lg font-semibold tracking-tight text-black dark:text-white leading-none">
                  Explorador Biblico
                </h2>
                <span className="text-[11px] text-black/50 dark:text-white/50 leading-tight">
                  66 libros · 1,189 capitulos
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="px-5 sm:px-6 pt-4 pb-3 sm:py-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#171618] shrink-0">
            <button
              type="button"
              onClick={handleBackToBooks}
              className="flex items-center gap-1.5 text-xs font-semibold text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white transition-colors py-1.5 px-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver a libros</span>
            </button>
            <div className="text-center">
              <h2 className="text-sm sm:text-base font-bold text-black dark:text-white leading-none">
                {selectedBook?.name}
              </h2>
              <span className="text-[10px] sm:text-[11px] text-black/50 dark:text-white/50">
                {selectedBook?.chapters} capitulos · {selectedBook?.category}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Vista 1: Listado y Busqueda de Libros */}
        {view === 'books' && (
          <>
            {/* Buscador inteligente */}
            <div className="px-5 sm:px-6 py-2.5 sm:py-3 border-b border-black/5 dark:border-white/5 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-2.5 sm:top-3 h-4 w-4 text-black/40 dark:text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por libro (ej. Génesis, Salmos, Mateo, Lucas)..."
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#edece6] dark:bg-[#201f22] py-2 sm:py-2.5 pl-10 pr-10 text-xs sm:text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:border-black dark:focus:border-white focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Conmutador de testamento (Antiguo 39 / Nuevo 27) */}
            {!searchQuery.trim() && (
              <div className="px-5 sm:px-6 py-2 flex items-center gap-2 border-b border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#171618] shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setTestament('antiguo');
                    setCategoryFilter('todos');
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    testament === 'antiguo'
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
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
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                      : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
                  }`}
                >
                  Nuevo Testamento (27)
                </button>
              </div>
            )}

            {/* Pildoras de categorias */}
            {!searchQuery.trim() && categories.length > 2 && (
              <div className="px-5 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-black/5 dark:border-white/5 bg-[#edece6]/70 dark:bg-[#141416] shrink-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      categoryFilter === cat
                        ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-xs'
                        : 'bg-white/90 text-black/70 hover:text-black dark:bg-[#201f22] dark:text-white/60 dark:hover:text-white'
                    }`}
                  >
                    {cat === 'todos' ? 'Todos' : cat}
                  </button>
                ))}
              </div>
            )}

            {/* Listado en cuadricula limpia */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 content-start no-scrollbar">
              {filteredBooks.length === 0 ? (
                <div className="col-span-full flex h-48 flex-col items-center justify-center text-center">
                  <Search className="h-8 w-8 text-black/20 dark:text-white/20 mb-2" />
                  <p className="text-sm text-black/60 dark:text-white/60">
                    No se encontraron libros que coincidan con "{searchQuery}".
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-3 text-xs text-black dark:text-white underline font-semibold"
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
                      className={`group flex items-center justify-between rounded-xl border p-3 transition-all text-left ${
                        isCurrent
                          ? 'border-black bg-[#edece6] dark:border-white dark:bg-[#2a2a2c] shadow-xs'
                          : 'border-black/5 bg-[#f5f4ef] hover:bg-[#edece6] hover:border-black/15 dark:border-white/5 dark:bg-[#201f22] dark:hover:bg-[#28272a] dark:hover:border-white/20 active:scale-[0.98]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black/10 text-black uppercase font-bold text-[11px] group-hover:bg-black group-hover:text-white dark:bg-white/10 dark:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                          {book.abbrev}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-semibold text-black dark:text-white">
                              {book.name}
                            </span>
                            {isCurrent && (
                              <Check className="h-3.5 w-3.5 text-black dark:text-white" />
                            )}
                          </div>
                          <span className="block text-[10px] sm:text-[11px] text-black/50 dark:text-white/50 mt-0.5">
                            {book.chapters} cap. · {book.category}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-black/30 group-hover:text-black dark:text-white/30 dark:group-hover:text-white transition-colors" />
                    </button>
                  );
                })
              )}
            </div>

            {/* Pie con atajo rapido a ultima lectura */}
            <div className="border-t border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#171618] px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between text-xs text-black/60 dark:text-white/60 shrink-0">
              <div className="flex items-center gap-2 truncate pr-2">
                <Bookmark className="h-3.5 w-3.5 text-black/70 dark:text-white/70 shrink-0" />
                <span className="truncate">
                  Ultima lectura:{' '}
                  <strong className="text-black dark:text-white">
                    {lastReading.bookName} Cap. {lastReading.chapter}
                  </strong>
                </span>
              </div>
              <button
                type="button"
                onClick={handleResumeLastReading}
                className="rounded-lg bg-black/10 hover:bg-black hover:text-white dark:bg-white/10 dark:hover:bg-white dark:hover:text-black px-3 py-1 text-black dark:text-white font-semibold transition-colors shrink-0"
              >
                Reanudar
              </button>
            </div>
          </>
        )}

        {/* Vista 2: Selector de Capitulos del Libro */}
        {view === 'chapters' && selectedBook && (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="px-5 sm:px-6 py-2.5 sm:py-3 border-b border-black/5 dark:border-white/5 flex items-center justify-between bg-[#f5f4ef] dark:bg-[#151416] shrink-0">
              <span className="text-xs text-black/70 dark:text-white/70">
                Selecciona un capitulo para comenzar a leer:
              </span>
              <button
                type="button"
                onClick={() => handleChapterClick(1)}
                className="text-xs font-semibold text-black dark:text-white bg-black/10 dark:bg-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-3 py-1 rounded-lg transition-colors"
              >
                Iniciar en Cap. 1
              </button>
            </div>

            {/* Cuadricula numerica de capitulos con content-start y scroll interno limpio */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 content-start no-scrollbar">
              {Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map((ch) => {
                const isSelected =
                  activeBookOrder === selectedBook.order && activeChapter === ch;

                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => handleChapterClick(ch)}
                    className={`flex h-11 sm:h-12 items-center justify-center rounded-xl text-sm font-bold transition-all ${
                      isSelected
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-md scale-105'
                        : 'bg-[#edece6] text-black/80 hover:bg-black/10 hover:text-black border border-black/5 dark:bg-[#201f22] dark:text-white/80 dark:hover:bg-white/20 dark:hover:text-white dark:border-white/5 active:scale-95'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>

            {/* Pie en vista de capitulos (siempre anclado y visible) */}
            <div className="border-t border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#171618] px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between text-xs text-black/60 dark:text-white/60 shrink-0">
              <span className="truncate pr-2">{selectedBook.name}: {selectedBook.chapters} capitulos disponibles</span>
              <button
                type="button"
                onClick={handleBackToBooks}
                className="text-black dark:text-white hover:underline font-semibold shrink-0"
              >
                Elegir otro libro
              </button>
            </div>
          </div>
        )}
      </section>
      </div>
    </div>
  );
};
