import React, { useState } from 'react';
import type { Verse, VerseNote } from '@/types/bible';
import type { ReadingStreakData, StreakDay, UserProfileData } from '@/services/streakService';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import {
  X,
  Flame,
  Bookmark,
  Settings,
  Check,
  ExternalLink,
  Trash2,
  Sun,
  Moon,
  Laptop,
  Award,
  Calendar,
  FileText,
  Edit2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  LogOut,
  LogIn,
} from 'lucide-react';

export interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: SupabaseUser | null;
  streakData: ReadingStreakData;
  weeklyDays: StreakDay[];
  userProfile: UserProfileData;
  bookmarkedVerses: Verse[];
  notes: VerseNote[];
  currentVersion: string;
  fontSize: 'normal' | 'grande' | 'extra';
  theme: 'dark' | 'light' | 'system';
  onUpdateUserName: (newName: string) => void;
  onSelectVersion: (version: string) => void;
  onSelectFontSize: (size: 'normal' | 'grande' | 'extra') => void;
  onSelectTheme: (theme: 'dark' | 'light' | 'system') => void;
  onOpenAuth?: (view: 'login' | 'register') => void;
  onSignOut?: () => void;
  onNavigateToVerse?: (verse: Verse) => void;
  onRemoveBookmark?: (verseId: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  streakData,
  weeklyDays,
  userProfile,
  bookmarkedVerses,
  notes,
  currentVersion,
  fontSize,
  theme,
  onUpdateUserName,
  onSelectVersion,
  onSelectFontSize,
  onSelectTheme,
  onOpenAuth,
  onSignOut,
  onNavigateToVerse,
  onRemoveBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'racha' | 'guardados' | 'notas' | 'ajustes'>('racha');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);

  if (!isOpen) return null;

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateUserName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const isRegisteredUser = Boolean(currentUser && !currentUser.is_anonymous);
  const userInitial = (userProfile.name.trim()[0] || 'L').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in select-none">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 dark:bg-[#0e0e10]/80 backdrop-blur-md"
      />

      <section
        aria-label="Perfil y Progreso"
        className="relative z-50 flex h-[92dvh] sm:h-[620px] max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2.5rem)] w-full max-w-xl flex-col rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/10 bg-[#fcfbf9] dark:bg-[#131315] text-[#18181b] dark:text-white shadow-2xl overflow-hidden min-h-0 transition-colors duration-200"
      >
        {/* Cabecera de Identidad */}
        <div className="px-5 sm:px-6 pt-4 pb-3 sm:py-4 flex items-center justify-between border-b border-black/5 dark:border-white/5 shrink-0 bg-[#fcfbf9] dark:bg-[#131315]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-base shadow-sm">
              {userInitial}
            </div>
            <div>
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="text-xs sm:text-sm font-bold bg-[#edece6] dark:bg-[#201f22] text-black dark:text-white px-2 py-0.5 rounded-lg border border-black/10 dark:border-white/10 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm sm:text-base font-bold text-black dark:text-white leading-none">
                    {userProfile.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setTempName(userProfile.name);
                      setIsEditingName(true);
                    }}
                    className="text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white p-0.5 rounded-sm"
                    title="Editar nombre"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>
              )}
              <span className="text-[11px] text-black/50 dark:text-white/50 mt-1 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                {isRegisteredUser
                  ? `Cuenta: ${currentUser?.email}`
                  : 'Lector Local (Sesión Segura)'}
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

        {/* Banner sutil para invitar al registro si no tiene cuenta vinculada */}
        {!isRegisteredUser && (
          <div className="mx-4 sm:mx-6 mt-3 p-3.5 rounded-2xl border border-black/10 dark:border-white/10 bg-[#edece6] dark:bg-[#1c1b1d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left shrink-0 shadow-xs">
            <div className="flex items-start gap-2.5">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-black dark:text-white block leading-tight">
                  Protege tu constancia en la nube
                </span>
                <span className="text-[11px] text-black/60 dark:text-white/60 block mt-0.5 leading-relaxed">
                  Crea tu cuenta gratuita para respaldar tu racha de {streakData.currentStreak} {streakData.currentStreak === 1 ? 'día' : 'días'} y tus notas en cualquier dispositivo.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenAuth?.('register')}
              className="self-start sm:self-auto shrink-0 px-3.5 py-1.5 rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 text-xs font-bold transition-all shadow-xs"
            >
              Crear Cuenta
            </button>
          </div>
        )}

        {/* Tarjetas resumen de actividad */}
        <div className="p-4 sm:p-5 grid grid-cols-3 gap-2.5 border-b border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#171618] shrink-0">
          {/* Racha actual */}
          <div className="rounded-xl border border-black/5 dark:border-white/5 bg-[#edece6] dark:bg-[#201f22] p-3 flex flex-col justify-between text-left">
            <div className="flex items-center justify-between text-black/60 dark:text-white/60">
              <span className="text-[10px] sm:text-[11px] font-semibold">Racha</span>
              <Flame className="h-4 w-4 text-amber-500 fill-current" />
            </div>
            <div className="mt-2">
              <span className="text-lg sm:text-xl font-bold text-black dark:text-white block leading-none">
                {streakData.currentStreak} d
              </span>
              <span className="text-[10px] text-black/40 dark:text-white/40 mt-1 block">Récord: {streakData.longestStreak} d</span>
            </div>
          </div>

          {/* Versiculos leidos */}
          <div className="rounded-xl border border-black/5 dark:border-white/5 bg-[#edece6] dark:bg-[#201f22] p-3 flex flex-col justify-between text-left">
            <div className="flex items-center justify-between text-black/60 dark:text-white/60">
              <span className="text-[10px] sm:text-[11px] font-semibold">Leídos</span>
              <Calendar className="h-4 w-4 text-black dark:text-white" />
            </div>
            <div className="mt-2">
              <span className="text-lg sm:text-xl font-bold text-black dark:text-white block leading-none">
                {streakData.totalVersesRead}
              </span>
              <span className="text-[10px] text-black/40 dark:text-white/40 mt-1 block">versículos</span>
            </div>
          </div>

          {/* Guardados */}
          <div className="rounded-xl border border-black/5 dark:border-white/5 bg-[#edece6] dark:bg-[#201f22] p-3 flex flex-col justify-between text-left">
            <div className="flex items-center justify-between text-black/60 dark:text-white/60">
              <span className="text-[10px] sm:text-[11px] font-semibold">Colección</span>
              <Bookmark className="h-4 w-4 text-black dark:text-white" />
            </div>
            <div className="mt-2">
              <span className="text-lg sm:text-xl font-bold text-black dark:text-white block leading-none">
                {bookmarkedVerses.length}
              </span>
              <span className="text-[10px] text-black/40 dark:text-white/40 mt-1 block">guardados</span>
            </div>
          </div>
        </div>

        {/* Pestañas de navegacion del perfil */}
        <div className="px-5 sm:px-6 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-black/5 dark:border-white/5 bg-[#edece6]/70 dark:bg-[#141416] shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('racha')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'racha'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            Racha & Hábitos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guardados')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
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
            onClick={() => setActiveTab('notas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'notas'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Reflexiones ({notes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ajustes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ajustes'
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                : 'text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white'
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            Ajustes
          </button>
        </div>

        {/* Contenido segun pestana */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
          {/* Pestana 1: Racha y Habitos */}
          {activeTab === 'racha' && (
            <div className="space-y-4">
              {/* Calendario Semanal */}
              <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#1c1b1d] p-4 text-left">
                <span className="text-xs font-bold text-black/70 dark:text-white/70 block mb-1">
                  Constancia semanal
                </span>
                <span className="text-[11px] text-black/50 dark:text-white/50 block mb-3">
                  Cada versículo leído al día suma a tu hábito de lectura.
                </span>

                <div className="grid grid-cols-7 gap-1.5">
                  {weeklyDays.map((day) => (
                    <div
                      key={day.date}
                      className={`flex flex-col items-center justify-center py-2.5 rounded-xl text-center ${
                        day.isToday
                          ? 'border border-black/20 dark:border-white/30 bg-black/5 dark:bg-white/10'
                          : 'bg-[#edece6] dark:bg-[#201f22]'
                      }`}
                    >
                      <span className="text-[10px] font-semibold text-black/50 dark:text-white/50 uppercase">
                        {day.dayLabel}
                      </span>
                      <div className={`mt-1.5 h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        day.completed
                          ? 'bg-amber-500 text-white shadow-xs'
                          : day.isToday
                          ? 'bg-black/10 dark:bg-white/20 text-black dark:text-white'
                          : 'text-black/40 dark:text-white/30'
                      }`}>
                        {day.completed ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : day.dayNumber}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logros e Hitos de Lectura */}
              <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-[#edece6] dark:bg-[#201f22] p-4 text-left">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold text-black dark:text-white">
                    Insignias de Constancia
                  </span>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      title: 'Primer Paso',
                      desc: 'Iniciaste tu hábito de lectura diaria',
                      achieved: (streakData.totalVersesRead || 0) >= 1,
                    },
                    {
                      title: 'Constancia Semanal',
                      desc: 'Alcanza una racha de 7 días consecutivos',
                      achieved: (streakData.longestStreak || 0) >= 7,
                    },
                    {
                      title: 'Fidelidad Mensual',
                      desc: 'Alcanza una racha de 30 días consecutivos',
                      achieved: (streakData.longestStreak || 0) >= 30,
                    },
                    {
                      title: 'Centurión de la Palabra',
                      desc: 'Lee más de 100 versículos',
                      achieved: (streakData.totalVersesRead || 0) >= 100,
                    },
                  ].map((badge) => (
                    <div
                      key={badge.title}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        badge.achieved
                          ? 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10'
                          : 'border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#171618] opacity-60'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-black dark:text-white block">
                          {badge.title}
                        </span>
                        <span className="text-[10px] text-black/50 dark:text-white/50">
                          {badge.desc}
                        </span>
                      </div>
                      {badge.achieved ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <span className="text-[10px] font-semibold text-black/40 dark:text-white/40">
                          En progreso
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pestana 2: Guardados */}
          {activeTab === 'guardados' && (
            bookmarkedVerses.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-center">
                <Bookmark className="h-8 w-8 text-black/20 dark:text-white/20 mb-2" />
                <p className="text-sm text-black/50 dark:text-white/50">
                  Aún no has guardado ningún versículo.
                </p>
                <p className="text-xs text-black/30 dark:text-white/30 mt-1">
                  Presiona el icono de marcador en cualquier versículo para coleccionarlo.
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
                      <span>Ir a este versículo</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))
            )
          )}

          {/* Pestana 3: Mis Reflexiones */}
          {activeTab === 'notas' && (
            notes.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center text-center">
                <FileText className="h-8 w-8 text-black/20 dark:text-white/20 mb-2" />
                <p className="text-sm text-black/50 dark:text-white/50">
                  Aún no has escrito ninguna reflexión.
                </p>
                <p className="text-xs text-black/30 dark:text-white/30 mt-1">
                  Usa el icono de Notas en el menú flotante para escribir tus meditaciones.
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-2xl border border-black/5 dark:border-white/5 bg-[#edece6] dark:bg-[#201f22] p-3.5 sm:p-4 text-left border-l-3 border-l-black dark:border-l-white"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-black/60 dark:text-white/60">
                      {note.isPrivate ? 'Reflexión Privada' : 'Reflexión Compartida'}
                    </span>
                    <span className="text-[10px] text-black/40 dark:text-white/40">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-black/90 dark:text-white/90">
                    {note.content}
                  </p>
                </div>
              ))
            )
          )}

          {/* Pestana 4: Ajustes */}
          {activeTab === 'ajustes' && (
            <div className="space-y-5 sm:space-y-6">
              {/* Accion de cuenta: Iniciar sesion o Cerrar sesion */}
              <div className="p-4 rounded-2xl border border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#171618]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-black dark:text-white">
                    Cuenta de Usuario
                  </span>
                  {isRegisteredUser ? (
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Sincronizada
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-black/50 dark:text-white/50 bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full">
                      Modo Invitado
                    </span>
                  )}
                </div>

                {isRegisteredUser ? (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-black/60 dark:text-white/60">
                      {currentUser?.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSignOut?.()}
                      className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-black/50 dark:text-white/50">
                      Tus datos se guardan localmente.
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenAuth?.('login')}
                      className="flex items-center gap-1.5 text-xs font-bold text-black dark:text-white bg-black/10 dark:bg-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black px-3 py-1.5 rounded-xl transition-all"
                    >
                      <LogIn className="h-3.5 w-3.5" />
                      <span>Iniciar Sesión / Registro</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Tema de apariencia */}
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
                  Tamaño de tipografía en pantalla
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
                  Traducción bíblica activa
                </span>
                <div className="space-y-2">
                  {[
                    { id: 'RVR1960', name: 'Reina-Valera 1960 (66 libros completos en Supabase)' },
                    { id: 'RVR09', name: 'Reina-Valera 1909 (Dominio Público)' },
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
