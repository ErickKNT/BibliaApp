import React from 'react';
import { X, Flame, Sparkles, BookOpen, ArrowRight, Check, ShieldCheck, Shuffle } from 'lucide-react';
import {
  getRandomInspirationalVerse,
  getInspirationalVerseText,
  type InspirationalVerse,
} from '@/data/inspirationalVerses';
import type { StreakDay } from '@/services/streakService';

export interface WelcomeModalProps {
  isOpen: boolean;
  userName: string;
  streak: number;
  isStreakCompletedToday: boolean;
  isRegisteredUser?: boolean;
  weeklyDays: StreakDay[];
  currentVersion?: string;
  lastReading: {
    bookName: string;
    chapter: number;
  };
  onClose: () => void;
  onResumeReading: () => void;
  onOpenAuth?: (view: 'login' | 'register') => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  userName,
  streak,
  isStreakCompletedToday,
  isRegisteredUser = false,
  weeklyDays,
  currentVersion = 'RVR1960',
  lastReading,
  onClose,
  onResumeReading,
  onOpenAuth,
}) => {
  const [inspirationalVerse, setInspirationalVerse] = React.useState<InspirationalVerse>(() =>
    getRandomInspirationalVerse()
  );

  React.useEffect(() => {
    if (isOpen) {
      setInspirationalVerse(getRandomInspirationalVerse());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentVerseData = getInspirationalVerseText(inspirationalVerse, currentVersion);
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? 'Buenos días'
      : currentHour < 19
      ? 'Buenas tardes'
      : 'Buenas noches';

  return (
    <div className="fixed inset-0 z-50 select-none animate-in fade-in">
      {/* Velo de desenfoque a pantalla completa real */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm"
      />

      {/* Contenedor flexible centrado con respeto de safe area insets */}
      <div
        className="relative z-10 flex h-full w-full items-center justify-center p-3 sm:p-4 pointer-events-none"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)',
        }}
      >
        <section
        aria-label="Bienvenida Diaria"
        className="pointer-events-auto relative z-10 flex h-auto max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/10 bg-[#fcfbf9] dark:bg-[#131315] text-[#18181b] dark:text-white shadow-xl overflow-hidden min-h-0 transition-colors duration-200"
      >
        {/* Cabecera con saludo contextual */}
        <div className="px-5 pt-4 pb-2.5 flex items-start justify-between border-b border-black/5 dark:border-white/5 shrink-0 bg-[#fcfbf9] dark:bg-[#131315]">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[11px] font-semibold text-black/70 dark:text-white/70 mb-1.5">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>Lectura Diaria</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white leading-tight">
              {greeting}, {userName}
            </h2>
            <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
              Que la Palabra de Dios edifique tu camino hoy.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-black/50 hover:bg-black/5 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cuerpo deslizante si es necesario en pantallas cortas */}
        <div className="p-3.5 sm:p-5 space-y-3 overflow-y-auto no-scrollbar flex-1 min-h-0">
          {/* Tarjeta de Racha de Lectura Activa */}
          <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#1c1b1d] p-4 text-left shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl flex items-center justify-center ${
                  isStreakCompletedToday
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50'
                }`}>
                  <Flame className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-black/60 dark:text-white/60 block leading-none">
                    Racha de Constancia
                  </span>
                  <span className="text-lg font-bold text-black dark:text-white leading-tight">
                    {streak} {streak === 1 ? 'día' : 'días'} consecutivos
                  </span>
                </div>
              </div>

              {isStreakCompletedToday ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                  <Check className="h-3 w-3 stroke-[3]" /> Activa hoy
                </span>
              ) : (
                <span className="text-[11px] font-medium text-black/50 dark:text-white/50 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-full">
                  Pendiente hoy
                </span>
              )}
            </div>

            {/* Tracker semanal de 7 dias (Lunes a Domingo) */}
            <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 grid grid-cols-7 gap-1.5">
              {weeklyDays.map((day) => (
                <div
                  key={day.date}
                  className={`flex flex-col items-center justify-center py-2 rounded-xl text-center transition-all ${
                    day.isToday
                      ? 'border border-black/20 dark:border-white/30 bg-black/5 dark:bg-white/10'
                      : 'bg-[#edece6] dark:bg-[#201f22]'
                  }`}
                >
                  <span className="text-[10px] font-semibold text-black/50 dark:text-white/50 uppercase">
                    {day.dayLabel}
                  </span>
                  <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    day.completed
                      ? 'bg-amber-500 text-white shadow-xs'
                      : day.isToday
                      ? 'bg-black/10 dark:bg-white/20 text-black dark:text-white'
                      : 'text-black/40 dark:text-white/30'
                  }`}>
                    {day.completed ? <Check className="h-3 w-3 stroke-[3]" /> : day.dayNumber}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta de Versiculo del Dia */}
          <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-[#edece6] dark:bg-[#201f22] p-4 text-left">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-black/50 dark:text-white/50 uppercase tracking-wider">
                Versículo para reflexionar
              </span>
              <button
                type="button"
                onClick={() => setInspirationalVerse((prev) => getRandomInspirationalVerse(prev?.id))}
                className="h-6 w-6 rounded-full flex items-center justify-center text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title="Mostrar otro versículo de reflexión"
                aria-label="Cambiar versículo"
              >
                <Shuffle className="h-3 w-3" />
              </button>
            </div>
            <blockquote className="font-serif text-sm sm:text-base leading-relaxed text-black/90 dark:text-white/90">
              “{currentVerseData.text}”
            </blockquote>
            <span className="text-xs font-semibold text-black/60 dark:text-white/60 block mt-2">
              — {currentVerseData.reference} ({currentVersion})
            </span>
          </div>

          {/* Atajo de reanudacion */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#171618]">
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-4 w-4 text-black/60 dark:text-white/60" />
              <div>
                <span className="text-[11px] text-black/50 dark:text-white/50 block leading-tight">
                  Última posición
                </span>
                <span className="text-xs font-bold text-black dark:text-white">
                  {lastReading.bookName} · Capítulo {lastReading.chapter}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onResumeReading();
                onClose();
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-black dark:text-white hover:underline"
            >
              <span>Reanudar</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Pie con boton principal de inicio e invitacion sutil */}
        <div className="border-t border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#171618] px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          {!isRegisteredUser && onOpenAuth ? (
            <div className="text-left text-[11px] text-black/60 dark:text-white/60">
              ¿Quieres respaldar tu racha?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth('login');
                }}
                className="font-bold underline text-black dark:text-white hover:opacity-80"
              >
                Inicia Sesión
              </button>{' '}
              o{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth('register');
                }}
                className="font-bold underline text-black dark:text-white hover:opacity-80"
              >
                Crea una cuenta gratis
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-black/50 dark:text-white/50 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Progreso sincronizado en la nube
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="self-end sm:self-auto flex items-center gap-2 rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 px-4 py-2 text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <span>Comenzar</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
      </div>
    </div>
  );
};
