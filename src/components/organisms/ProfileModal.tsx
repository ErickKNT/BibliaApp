import React, { useState } from 'react';
import type { Verse, VerseNote } from '@/types/bible';
import { X, User, Flame, Wifi, Bookmark, Settings, Check, ExternalLink, Trash2 } from 'lucide-react';

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedVerses: Verse[];
  notes: VerseNote[];
  currentVersion: string;
  fontSize: 'normal' | 'grande' | 'extra';
  onSelectVersion: (version: string) => void;
  onSelectFontSize: (size: 'normal' | 'grande' | 'extra') => void;
  onNavigateToVerse?: (verse: Verse) => void;
  onRemoveBookmark?: (verseId: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  bookmarkedVerses,
  currentVersion,
  fontSize,
  onSelectVersion,
  onSelectFontSize,
  onNavigateToVerse,
  onRemoveBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'guardados' | 'ajustes'>('guardados');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in select-none">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#0e0e10]/80 backdrop-blur-md"
      />

      <section
        aria-label="Perfil y Guardados"
        className="relative z-50 flex h-full sm:h-[750px] w-full max-w-xl flex-col rounded-none sm:rounded-3xl border-0 sm:border border-white/10 bg-[#131315] text-white shadow-2xl overflow-hidden"
      >
        {/* Cabecera */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center font-bold">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Lector Anonimo</h2>
              <span className="text-xs text-white/50">Progreso guardado localmente</span>
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

        {/* Tarjetas resumen: Racha y Biblioteca Offline */}
        <div className="p-6 grid grid-cols-2 gap-3 border-b border-white/5 bg-[#171618]">
          {/* Racha */}
          <div className="rounded-2xl border border-white/5 bg-[#201f22] p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/60">
              <span className="text-xs font-medium">Racha de lectura</span>
              <Flame className="h-4 w-4 text-white" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white">4 dias</span>
              <span className="block text-[11px] text-white/40">Constancia activa</span>
            </div>
          </div>

          {/* Estado Offline PWA */}
          <div className="rounded-2xl border border-white/5 bg-[#201f22] p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-white/60">
              <span className="text-xs font-medium">Modo PWA Offline</span>
              <Wifi className="h-4 w-4 text-white" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white">100%</span>
              <div className="mt-1 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-white rounded-full w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas de navegacion */}
        <div className="px-6 py-2.5 flex items-center gap-2 border-b border-white/5 bg-[#141416]">
          <button
            type="button"
            onClick={() => setActiveTab('guardados')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'guardados'
                ? 'bg-white text-black shadow-sm'
                : 'text-white/60 hover:text-white'
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
                ? 'bg-white text-black shadow-sm'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            Ajustes
          </button>
        </div>

        {/* Contenido segun pestana */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
          {activeTab === 'guardados' ? (
            bookmarkedVerses.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-center">
                <Bookmark className="h-8 w-8 text-white/20 mb-2" />
                <p className="text-sm text-white/50">
                  Aun no has guardado ningun versiculo.
                </p>
                <p className="text-xs text-white/30 mt-1">
                  Presiona el icono de marcador en cualquier versiculo para coleccionarlo.
                </p>
              </div>
            ) : (
              bookmarkedVerses.map((verse) => (
                <div
                  key={verse.id}
                  className="group rounded-2xl border border-white/5 bg-[#201f22] p-4 text-left transition-all hover:border-white/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">
                      {verse.bookName} {verse.chapter}:{verse.verseNumber}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/50 uppercase">
                        {verse.version}
                      </span>
                      {onRemoveBookmark && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveBookmark(verse.id);
                          }}
                          className="text-white/40 hover:text-white p-1 rounded-md transition-colors"
                          title="Eliminar de guardados"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="font-serif text-sm leading-relaxed text-white/90 mb-3">
                    “{verse.text}”
                  </p>
                  {onNavigateToVerse && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateToVerse(verse);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <span>Ir a este versiculo</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))
            )
          ) : (
            <div className="space-y-6">
              {/* Ajuste de tamano de texto */}
              <div>
                <span className="text-xs font-semibold text-white/70 block mb-2">
                  Tamano de tipografia en pantalla
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['normal', 'grande', 'extra'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => onSelectFontSize(size)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        fontSize === size
                          ? 'border-white bg-white text-black shadow-sm'
                          : 'border-white/10 bg-[#201f22] text-white/70 hover:text-white'
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de version preferida */}
              <div>
                <span className="text-xs font-semibold text-white/70 block mb-2">
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
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                        currentVersion === ver.id
                          ? 'border-white bg-[#2a2a2c] shadow-sm'
                          : 'border-white/5 bg-[#201f22] hover:bg-[#28272a] hover:border-white/20'
                      }`}
                    >
                      <div>
                        <span className="text-sm font-bold text-white block">
                          {ver.id}
                        </span>
                        <span className="text-xs text-white/50">
                          {ver.name}
                        </span>
                      </div>
                      {currentVersion === ver.id && (
                        <Check className="h-4 w-4 text-white" />
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
