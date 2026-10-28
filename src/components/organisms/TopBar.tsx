import React from 'react';
import { BookOpen, User, Library, ChevronDown, Sun, Moon, Home, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TopBarProps {
  currentVersion: string;
  activeBookName?: string;
  activeChapter?: number;
  theme?: 'dark' | 'light' | 'system';
  isVisible?: boolean;
  isOffline?: boolean;
  onToggleTheme?: () => void;
  onOpenExplorer?: () => void;
  onOpenProfile?: () => void;
  onOpenWelcome?: () => void;
  onVersionSelect?: () => void;
  onOpenVersionSelector?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentVersion,
  activeBookName,
  activeChapter,
  theme = 'dark',
  isVisible = true,
  isOffline = false,
  onToggleTheme,
  onOpenExplorer,
  onOpenProfile,
  onOpenWelcome,
  onVersionSelect,
  onOpenVersionSelector,
}) => {
  const handleVersionClick = onOpenVersionSelector || onVersionSelect;

  return (
    <header
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
      className={cn(
        'fixed top-0 inset-x-0 z-40 pt-safe bg-[#f8f7f4]/85 dark:bg-[#131315]/85 backdrop-blur-xl border-b border-black/5 dark:border-white/5 select-none transition-all duration-300 ease-out',
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : '-translate-y-full opacity-0 pointer-events-none'
      )}
    >
      <div className="h-13 sm:h-15 px-3 sm:px-6 flex items-center justify-between">
        {/* Identidad de la aplicacion, boton de inicio y acceso al explorador de libros */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Boton de inicio y racha diaria */}
          <button
            type="button"
            onClick={onOpenWelcome}
            className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full bg-[#edece6] hover:bg-[#e4e2db] dark:bg-[#201f22] dark:hover:bg-[#2a2a2c] border border-black/5 dark:border-white/10 flex items-center justify-center text-black/80 dark:text-white transition-all active:scale-95 shadow-xs cursor-pointer"
            title="Inicio y Racha de Lectura"
            aria-label="Abrir inicio y racha"
          >
            <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>

          {/* Acceso al explorador de libros */}
          <button
            type="button"
            onClick={onOpenExplorer}
            className="flex items-center gap-2 rounded-full bg-[#edece6] hover:bg-[#e4e2db] dark:bg-[#201f22] dark:hover:bg-[#2a2a2c] px-2.5 py-1 sm:px-3.5 sm:py-1.5 border border-black/5 dark:border-white/10 transition-all active:scale-95 text-left group shadow-xs cursor-pointer"
          >
            <Library className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-black/80 dark:text-white group-hover:scale-110 transition-transform" />
            <div className="flex flex-col">
              <span className="text-[11px] sm:text-xs font-bold text-black dark:text-white tracking-tight leading-none">
                {activeBookName ? `${activeBookName} ${activeChapter ? `· Cap. ${activeChapter}` : ''}` : 'BibliaApp'}
              </span>
              <span className="text-[9px] sm:text-[10px] text-black/50 dark:text-white/50 uppercase tracking-wider leading-tight flex items-center gap-0.5 mt-0.5">
                Explorar Libros <ChevronDown className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
              </span>
            </div>
          </button>
        </div>

        {/* Indicador de estado offline cuando no hay conexion */}
        {isOffline && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 dark:bg-amber-400/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] sm:text-xs font-semibold animate-pulse">
            <WifiOff className="h-3 w-3" />
            <span className="hidden xs:inline">Modo sin conexión</span>
          </div>
        )}

        {/* Acciones derechas: alternador de tema, selector de version y perfil */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Conmutador de modo claro / modo oscuro */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full bg-[#edece6] hover:bg-[#e4e2db] dark:bg-[#201f22] dark:hover:bg-[#2a2a2c] border border-black/5 dark:border-white/10 flex items-center justify-center text-black/80 dark:text-white transition-all active:scale-95 shadow-xs cursor-pointer"
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            aria-label="Alternar tema de apariencia"
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5 text-amber-300" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-slate-700" />
            )}
          </button>

          {/* Selector modal de traduccion */}
          <button
            type="button"
            onClick={handleVersionClick}
            className="h-8 px-2.5 sm:h-8.5 sm:px-3 rounded-full bg-[#edece6] hover:bg-[#e4e2db] dark:bg-[#201f22] dark:hover:bg-[#2a2a2c] border border-black/5 dark:border-white/10 flex items-center gap-1 text-black dark:text-white transition-all active:scale-95 shadow-xs cursor-pointer"
            title="Seleccionar traduccion de la Biblia"
          >
            <span className="text-[11px] sm:text-xs font-bold tracking-wider text-black dark:text-white">
              {currentVersion}
            </span>
            <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-black/50 dark:text-white/50" />
          </button>

          {/* Acceso a perfil y guardados */}
          <button
            type="button"
            onClick={onOpenProfile}
            aria-label="Perfil y Guardados"
            className="h-8 w-8 sm:h-8.5 sm:w-8.5 rounded-full bg-[#18181b] hover:bg-black dark:bg-white dark:hover:bg-white/90 text-white dark:text-black flex items-center justify-center transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};
