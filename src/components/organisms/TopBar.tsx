import React from 'react';
import { BookOpen, User, Library, ChevronDown } from 'lucide-react';

export interface TopBarProps {
  currentVersion: string;
  activeBookName?: string;
  activeChapter?: number;
  onOpenExplorer?: () => void;
  onOpenProfile?: () => void;
  onVersionSelect?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentVersion,
  activeBookName,
  activeChapter,
  onOpenExplorer,
  onOpenProfile,
  onVersionSelect,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 pt-safe bg-[#131315]/85 backdrop-blur-xl border-b border-white/5 select-none">
      <div className="h-full px-4 sm:px-8 flex items-center justify-between">
        {/* Identidad de la aplicacion y acceso rapido al explorador de libros */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenExplorer}
            className="flex items-center gap-2.5 rounded-full bg-[#201f22] hover:bg-[#2a2a2c] px-3.5 py-1.5 border border-white/10 transition-all active:scale-95 text-left group"
          >
            <Library className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-tight leading-none">
                {activeBookName ? `${activeBookName} ${activeChapter ? `· Cap. ${activeChapter}` : ''}` : 'BibliaApp'}
              </span>
              <span className="text-[10px] text-white/50 uppercase tracking-widest leading-tight flex items-center gap-1 mt-0.5">
                Explorar Libros <ChevronDown className="h-2.5 w-2.5" />
              </span>
            </div>
          </button>
        </div>

        {/* Acciones derechas: selector de version y perfil */}
        <div className="flex items-center gap-2">
          {/* Selector de traduccion */}
          <button
            type="button"
            onClick={onVersionSelect}
            className="h-9 px-3 rounded-full bg-[#201f22] hover:bg-[#2a2a2c] border border-white/10 flex items-center gap-1.5 text-white transition-all active:scale-95"
            title="Cambiar traduccion de la Biblia"
          >
            <span className="text-xs font-bold tracking-wider text-white">
              {currentVersion}
            </span>
            <BookOpen className="h-3.5 w-3.5 text-white/50" />
          </button>

          {/* Acceso a perfil y guardados */}
          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="Perfil y Guardados"
            className="h-9 w-9 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center transition-all active:scale-95 shadow-sm"
          >
            <User className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};
