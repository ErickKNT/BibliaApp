import React from 'react';
import { BookOpen, User, Library, ChevronDown, Sun, Moon } from 'lucide-react';

export interface TopBarProps {
  currentVersion: string;
  activeBookName?: string;
  activeChapter?: number;
  theme?: 'dark' | 'light' | 'system';
  onToggleTheme?: () => void;
  onOpenExplorer?: () => void;
  onOpenProfile?: () => void;
  onVersionSelect?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentVersion,
  activeBookName,
  activeChapter,
  theme = 'dark',
  onToggleTheme,
  onOpenExplorer,
  onOpenProfile,
  onVersionSelect,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 pt-safe bg-[#f8f7f4]/85 dark:bg-[#131315]/85 backdrop-blur-xl border-b border-black/5 dark:border-white/5 select-none transition-colors duration-200">
      <div className="h-full px-4 sm:px-8 flex items-center justify-between">
        {/* Identidad de la aplicacion y acceso al explorador de libros */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenExplorer}
            className="flex items-center gap-2.5 rounded-full bg-[#edece6] hover:bg-[#e4e2db] dark:bg-[#201f22] dark:hover:bg-[#2a2a2c] px-3.5 py-1.5 border border-black/5 dark:border-white/10 transition-all active:scale-95 text-left group shadow-xs"
          >
            <Library className="h-4 w-4 text-black/80 dark:text-white group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-black dark:text-white tracking-tight leading-none">
                {activeBookName ? `${activeBookName} ${activeChapter ? `· Cap. ${activeChapter}` : ''}` : 'BibliaApp'}
              </span>
              <span className="text-[10px] text-black/50 dark:text-white/50 uppercase tracking-widest leading-tight flex items-center gap-1 mt-0.5">
                Explorar Libros <ChevronDown className="h-2.5 w-2.5" />
              </span>
            </div>
          </button>
        </div>

        {/* Acciones derechas: alternador de tema, selector de version y perfil */}
        <div className="flex items-center gap-2">
          {/* Conmutador de modo claro / modo oscuro */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="h-9 w-9 rounded-full bg-[#edece6] hover:bg-[#e4e2db] dark:bg-[#201f22] dark:hover:bg-[#2a2a2c] border border-black/5 dark:border-white/10 flex items-center justify-center text-black/80 dark:text-white transition-all active:scale-95 shadow-xs"
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Alternar tema de apariencia"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-300" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Selector de traduccion */}
          <button
            type="button"
            onClick={onVersionSelect}
            className="h-9 px-3 rounded-full bg-[#edece6] hover:bg-[#e4e2db] dark:bg-[#201f22] dark:hover:bg-[#2a2a2c] border border-black/5 dark:border-white/10 flex items-center gap-1.5 text-black dark:text-white transition-all active:scale-95 shadow-xs"
            title="Cambiar traduccion de la Biblia"
          >
            <span className="text-xs font-bold tracking-wider text-black dark:text-white">
              {currentVersion}
            </span>
            <BookOpen className="h-3.5 w-3.5 text-black/50 dark:text-white/50" />
          </button>

          {/* Acceso a perfil y guardados */}
          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="Perfil y Guardados"
            className="h-9 w-9 rounded-full bg-[#18181b] hover:bg-black dark:bg-white dark:hover:bg-white/90 text-white dark:text-black flex items-center justify-center transition-all active:scale-95 shadow-sm"
          >
            <User className="h-4 w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};
