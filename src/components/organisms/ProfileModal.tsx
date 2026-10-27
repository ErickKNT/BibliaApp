import React, { useState } from 'react';
import type { Verse, VerseNote } from '@/types/bible';
import { X, User, Flame, Wifi, Bookmark, Settings, Check, ExternalLink, Trash2, Sun, Moon, Laptop } from 'lucide-react';

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedVerses: Verse[];
  notes: VerseNote[];
  currentVersion: string;
  fontSize: 'normal' | 'grande' | 'extra';
  theme: 'dark' | 'light' | 'system';
  onSelectVersion: (version: string) => void;
  onSelectFontSize: (size: 'normal' | 'grande' | 'extra') => void;
  onSelectTheme: (theme: 'dark' | 'light' | 'system') => void;
  onNavigateToVerse?: (verse: Verse) => void;
  onRemoveBookmark?: (verseId: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  bookmarkedVerses,
  currentVersion,
  fontSize,
  theme,
  onSelectVersion,
  onSelectFontSize,
  onSelectTheme,
  onNavigateToVerse,
  onRemoveBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'guardados' | 'ajustes'>('guardados');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in select-none">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 dark:bg-[#0e0e10]/80 backdrop-blur-md"
      />

      <section
        aria-label="Perfil y Guardados"
        className="relative z-50 flex h-[92dvh] sm:h-[620px] max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2.5rem)] w-full max-w-xl flex-col rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/10 bg-[#fcfbf9] dark:bg-[#131315] text-[#18181b] dark:text-white shadow-2xl overflow-hidden min-h-0 transition-colors duration-200"
      >
        {/* Cabecera */}
        <div className="px-5 sm:px-6 pt-4 pb-3 sm:py-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 shrink-0 bg-[#fcfbf9] dark:bg-[#131315]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-black dark:text-white leading-none">
                Lector Anonimo
              </h2>
              <span className="text-[11px] text-black/50 dark:text-white/50 mt-0.5 block">
                Progreso guardado localmente
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

        {/* Tarjetas resumen: Racha y Biblioteca Offline */}
        <div className="p-4 sm:p-5 grid grid-cols-2 gap-3 border-b border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#171618] shrink-0">
          {/* Racha */}
          <div className="rounded-xl sm:rounded-2xl border border-black/5 dark:border-white/5 bg-[#edece6] dark:bg-[#201f22] p-3 sm:p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-black/60 dark:text-white/60">
              <span className="text-[11px] sm:text-xs font-medium">Racha de lectura</span>
              <Flame className="h-4 w-4 text-black dark:text-white" />
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-2xl font-bold text-black dark:text-white">4 dias</span>
              <span className="block text-[10px] sm:text-[11px] text-black/40 dark:text-white/40">Constancia activa</span>
            </div>
          </div>

          {/* Estado Offline PWA */}
          <div className="rounded-xl sm:rounded-2xl border border-black/5 dark:border-white/5 bg-[#edece6] dark:bg-[#201f22] p-3 sm:p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-black/60 dark:text-white/60">
              <span className="text-[11px] sm:text-xs font-medium">Modo PWA Offline</span>
              <Wifi className="h-4 w-4 text-black dark:text-white" />
            </div>
            <div className="mt-2 sm:mt-3">
              <span className="text-xl sm:text-2xl font-bold text-black dark:text-white">100%</span>
              <div className="mt-1 h-1 w-full rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                <div className="h-full bg-black dark:bg-white rounded-full w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas de navegacion */}
        <div className="px-5 sm:px-6 py-2 flex items-center gap-2 border-b border-black/5 dark:border-white/5 bg-[#edece6]/70 dark:bg-[#141416] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('guardados')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'guardados'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            Guardados ({bookmarkedVerses.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ajustes')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ajustes'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            Ajustes
          </button>
        </div>

        {/* Contenido segun pestana con scroll interno */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-3 no-scrollbar">
          {activeTab === 'guardados' ? (
            bookmarkedVerses.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-center">
                <Bookmark className="h-8 w-8 text-black/20 dark:text-white/20 mb-2" />
                <p className="text-sm text-black/50 dark:text-white/50">
                  Aun no has guardado ningun versiculo.
                </p>
                <p className="text-xs text-black/30 dark:text-white/30 mt-1">
                  Presiona el icono de marcador en cualquier versiculo para coleccionarlo.
                </p>
              </div>
            ) : (
              bookmarkedVerses.map((verse) => (
                <div
                  key={verse.id}
                  className="group rounded-2xl border border-black/5 dark:border-white/5 bg-[#edece6] dark:bg-[#201f22] p-3.5 sm:p-4 text-left transition-all hover:border-black/20 dark:hover:border-white/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-black dark:text-white">
                      {verse.bookName} {verse.chapter}:{verse.verseNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-black/50 dark:text-white/50 uppercase">
                        {verse.version}
                      </span>
                      {onRemoveBookmark && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveBookmark(verse.id);
                          }}
                          className="text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white p-1 rounded-md transition-colors"
                          title="Eliminar de guardados"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="font-serif text-xs sm:text-sm leading-relaxed text-black/90 dark:text-white/90 mb-3">
                    “{verse.text}”
                  </p>
                  {onNavigateToVerse && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToVerse(verse);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-black/80 hover:text-black bg-black/5 hover:bg-black/10 dark:text-white/70 dark:hover:text-white dark:bg-white/5 dark:hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>Ir a este versiculo</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))
            )
          ) : (
            <div className="space-y-5 sm:space-y-6">
              {/* Ajuste de tema de apariencia (Modo Claro / Modo Oscuro) */}
              <div>
                <span className="text-xs font-semibold text-black/70 dark:text-white/70 block mb-2">
                  Tema de apariencia
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'dark' as const, label: 'Oscuro', icon: Moon },
                    { id: 'light' as const, label: 'Claro', icon: Sun },
                    { id: 'system' as const, label: 'Sistema', icon: Laptop },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = theme === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onSelectTheme(item.id)}
                        className={`py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                          isSelected
                            ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-xs'
                            : 'border-black/10 bg-[#edece6] text-black/70 hover:text-black dark:border-white/10 dark:bg-[#201f22] dark:text-white/70 dark:hover:text-white'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ajuste de tamano de texto */}
              <div>
                <span className="text-xs font-semibold text-black/70 dark:text-white/70 block mb-2">
                  Tamano de tipografia en pantalla
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'grande', 'extra'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onSelectFontSize(size)}
                      className={`py-2 sm:py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        fontSize === size
                          ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-xs'
                          : 'border-black/10 bg-[#edece6] text-black/70 hover:text-black dark:border-white/10 dark:bg-[#201f22] dark:text-white/70 dark:hover:text-white'
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de version preferida */}
              <div>
                <span className="text-xs font-semibold text-black/70 dark:text-white/70 block mb-2">
                  Traduccion biblica activa
                </span>
                <div className="space-y-2">
                  {[
                    { id: 'RVR1960', name: 'Reina-Valera 1960 (66 libros completos en Supabase)' },
                    { id: 'RVR09', name: 'Reina-Valera 1909 (Dominio Publico)' },
                    { id: 'WEB', name: 'World English Bible (Public Domain)' },
                    { id: 'BL95', name: 'Biblia Abierta / Libre' },
                  ].map((ver) => (
                    <button
                      key={ver.id}
                      type="button"
                      onClick={() => onSelectVersion(ver.id)}
                      className={`w-full flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all text-left ${
                        currentVersion === ver.id
                          ? 'border-black bg-[#e2dfd7] dark:border-white dark:bg-[#2a2a2c] shadow-xs'
                          : 'border-black/5 bg-[#edece6] hover:bg-[#e4e2db] dark:border-white/5 dark:bg-[#201f22] dark:hover:bg-[#28272a]'
                      }`}
                    >
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-black dark:text-white block">
                          {ver.id}
                        </span>
                        <span className="text-[11px] sm:text-xs text-black/50 dark:text-white/50">
                          {ver.name}
                        </span>
                      </div>
                      {currentVersion === ver.id && (
                        <Check className="h-4 w-4 text-black dark:text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
