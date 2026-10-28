import React from 'react';
import { X, BookOpen, Check } from 'lucide-react';

export interface BibleVersionOption {
  id: string;
  name: string;
  description: string;
  badge: string;
}

export const AVAILABLE_VERSIONS: BibleVersionOption[] = [
  {
    id: 'RVR1960',
    name: 'Reina-Valera 1960',
    description: 'La versión clásica y más extendida en la comunidad hispanohablante.',
    badge: 'Recomendada',
  },
  {
    id: 'RVR09',
    name: 'Reina-Valera 1909',
    description: 'Traducción histórica con léxico solemne y tradicional.',
    badge: 'Dominio Público',
  },
  {
    id: 'BL95',
    name: 'Biblia Latinoamericana',
    description: 'Traducción pastoral con vocabulario accesible y cercano.',
    badge: 'Pastoral',
  },
  {
    id: 'WEB',
    name: 'World English Bible',
    description: 'Traducción contemporánea en inglés de dominio público.',
    badge: 'Inglés',
  },
];

export interface VersionSelectorModalProps {
  isOpen: boolean;
  currentVersion: string;
  onClose: () => void;
  onSelectVersion: (versionId: string) => void;
}

export const VersionSelectorModal: React.FC<VersionSelectorModalProps> = ({
  isOpen,
  currentVersion,
  onClose,
  onSelectVersion,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none"
      style={{
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)',
        paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)',
      }}
    >
      {/* Velo desenfocado */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 dark:bg-[#0e0e10]/80 backdrop-blur-md"
      />

      <section
        aria-label="Selector de Traducciones Bíblicas"
        className="relative z-50 flex h-auto max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/10 bg-[#fcfbf9] dark:bg-[#131315] text-[#18181b] dark:text-white shadow-2xl overflow-hidden min-h-0 transition-colors duration-200"
      >
        {/* Cabecera */}
        <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-black/5 dark:border-white/5 shrink-0 bg-[#fcfbf9] dark:bg-[#131315]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-black dark:text-white leading-none">
                Traducción Bíblica
              </h2>
              <span className="text-[11px] text-black/50 dark:text-white/50">
                Selecciona tu versión de lectura
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-black/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Lista de Versiones */}
        <div className="p-4 sm:p-5 space-y-2.5 overflow-y-auto no-scrollbar">
          {AVAILABLE_VERSIONS.map((ver) => {
            const isSelected = currentVersion === ver.id;
            return (
              <button
                key={ver.id}
                type="button"
                onClick={() => {
                  onSelectVersion(ver.id);
                  onClose();
                }}
                className={`w-full flex items-start justify-between p-3.5 rounded-2xl border transition-all text-left group ${
                  isSelected
                    ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black shadow-sm'
                    : 'border-black/10 bg-[#edece6] hover:bg-[#e4e2db] dark:border-white/10 dark:bg-[#201f22] dark:hover:bg-[#28272a] text-[#18181b] dark:text-white'
                }`}
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold tracking-tight">
                      {ver.name}
                    </span>
                    <span
                      className={`text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected
                          ? 'bg-white/20 text-white dark:bg-black/20 dark:text-black'
                          : 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60'
                      }`}
                    >
                      {ver.badge}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] leading-relaxed ${
                      isSelected
                        ? 'text-white/80 dark:text-black/80'
                        : 'text-black/60 dark:text-white/60'
                    }`}
                  >
                    {ver.description}
                  </p>
                </div>

                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                    isSelected
                      ? 'border-white bg-white text-black dark:border-black dark:bg-black dark:text-white'
                      : 'border-black/20 dark:border-white/20 group-hover:border-black/40 dark:group-hover:border-white/40'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Pie informativo */}
        <div className="border-t border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#171618] px-5 py-3 text-center text-[11px] text-black/50 dark:text-white/50 shrink-0">
          La versión seleccionada se sincroniza automáticamente con tu lectura.
        </div>
      </section>
    </div>
  );
};
