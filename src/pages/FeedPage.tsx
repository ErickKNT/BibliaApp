import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Verse, VerseNote } from '@/types/bible';
import { FeedLayout } from '@/components/templates/FeedLayout';
import { VerseCard } from '@/components/organisms/VerseCard';
import { VerseActionBar } from '@/components/molecules/VerseActionBar';
import { NotesModal } from '@/components/organisms/NotesModal';
import { TopBar } from '@/components/organisms/TopBar';
import { BookExplorerModal } from '@/components/organisms/BookExplorerModal';
import { ProfileModal } from '@/components/organisms/ProfileModal';
import { WelcomeModal } from '@/components/organisms/WelcomeModal';
import { AuthModal } from '@/components/organisms/AuthModal';
import { VersionSelectorModal } from '@/components/organisms/VersionSelectorModal';
import {
  getFeedVerses,
  getVersesByBookAndChapter,
  getMoreVerses,
  toggleVerseLike,
  getVerseNotes,
  addVerseNote,
  saveLastReading,
  getLastReading,
  type LastReading,
} from '@/services/bibleService';
import {
  getReadingStreakData,
  recordVerseReading,
  getWeeklyStreakDays,
  getUserProfile,
  saveUserProfile,
  getStoredPreferredVersion,
  saveStoredPreferredVersion,
  getLocalDateString,
  type ReadingStreakData,
  type UserProfileData,
} from '@/services/streakService';
import { Loader2, WifiOff } from 'lucide-react';
import { onNetworkStatusChange } from '@/services/pwaService';
import {
  getCurrentAuthUser,
  signOutUser,
  onAuthStateChange,
  syncLocalDataToSupabase,
  fetchUserDataFromSupabase,
  syncPreferredVersionToSupabase,
  syncStreakToSupabase,
} from '@/services/authService';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export const FeedPage: React.FC = () => {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>(() => getStoredPreferredVersion());
  const [activeVerseId, setActiveVerseId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Racha de lectura y perfil de usuario
  const [streakData, setStreakData] = useState<ReadingStreakData>(() => getReadingStreakData());
  const [userProfile, setUserProfile] = useState<UserProfileData>(() => getUserProfile());

  // Pantalla de bienvenida (visible al cargar/recargar y reaperturable con boton de inicio)
  const [isWelcomeOpen, setIsWelcomeOpen] = useState<boolean>(true);

  // Tema de apariencia (Modo Claro / Modo Oscuro / Sistema)
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => {
    return (localStorage.getItem('biblia_theme') as 'dark' | 'light' | 'system') || 'dark';
  });

  // Ajustes de lectura
  const [fontSize, setFontSize] = useState<'normal' | 'grande' | 'extra'>(() => {
    return (localStorage.getItem('biblia_font_size') as 'normal' | 'grande' | 'extra') || 'normal';
  });

  // Marcadores y Me Gusta
  const [likedVerseIds, setLikedVerseIds] = useState<Set<string>>(new Set());
  const [bookmarkedVerseIds, setBookmarkedVerseIds] = useState<Set<string>>(new Set());
  const [savedVersesList, setSavedVersesList] = useState<Verse[]>([]);
  const [notes, setNotes] = useState<VerseNote[]>([]);

  // Ultima lectura registrada
  const [lastReading, setLastReading] = useState<LastReading>(() => getLastReading());

  // Modales
  const [activeVerseForNotes, setActiveVerseForNotes] = useState<Verse | null>(null);
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<'login' | 'register' | 'recovery'>('register');
  const [isVersionSelectorOpen, setIsVersionSelectorOpen] = useState(false);

  // Estado de usuario en Supabase (invitado o registrado)
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);

  // Estado de conectividad de red PWA (offline / online)
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });

  useEffect(() => {
    return onNetworkStatusChange((online) => {
      setIsOffline(!online);
    });
  }, []);

  // Modo Lectura Inmersiva Total (Auto-Hide HUD)
  const [isHudVisible, setIsHudVisible] = useState<boolean>(true);
  const hideHudTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTopRef = useRef<number>(0);

  const isAnyModalOpen =
    isExplorerOpen ||
    isProfileOpen ||
    isAuthModalOpen ||
    isWelcomeOpen ||
    isVersionSelectorOpen ||
    Boolean(activeVerseForNotes);

  const resetHudTimer = useCallback((showImmediately = true) => {
    if (showImmediately) {
      setIsHudVisible(true);
    }
    if (hideHudTimeoutRef.current) {
      clearTimeout(hideHudTimeoutRef.current);
      hideHudTimeoutRef.current = null;
    }

    if (
      isExplorerOpen ||
      isProfileOpen ||
      isAuthModalOpen ||
      isWelcomeOpen ||
      isVersionSelectorOpen ||
      Boolean(activeVerseForNotes)
    ) {
      return;
    }

    hideHudTimeoutRef.current = setTimeout(() => {
      setIsHudVisible(false);
    }, 3500);
  }, [
    isExplorerOpen,
    isProfileOpen,
    isAuthModalOpen,
    isWelcomeOpen,
    isVersionSelectorOpen,
    activeVerseForNotes,
  ]);

  // Congelar / reactivar temporizador cuando se abre o cierra algun modal
  useEffect(() => {
    if (isAnyModalOpen) {
      setIsHudVisible(true);
      if (hideHudTimeoutRef.current) {
        clearTimeout(hideHudTimeoutRef.current);
        hideHudTimeoutRef.current = null;
      }
    } else {
      resetHudTimer(true);
    }
  }, [isAnyModalOpen, resetHudTimer]);

  const handleToggleHud = () => {
    setIsHudVisible((prev) => {
      const next = !prev;
      if (next) {
        resetHudTimer(true);
      } else {
        if (hideHudTimeoutRef.current) {
          clearTimeout(hideHudTimeoutRef.current);
          hideHudTimeoutRef.current = null;
        }
      }
      return next;
    });
  };

  const feedContainerRef = useRef<HTMLDivElement>(null);
  const isFetchingMoreRef = useRef<boolean>(false);

  // Sincronizar clase de tema con la raiz html
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      const themeColor = isDark ? '#131315' : '#f8f7f4';
      if (isDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
      const meta = document.querySelector('meta[name="theme-color"]:not([media])');
      if (meta) {
        meta.setAttribute('content', themeColor);
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  // Escuchar y sincronizar estado de autenticacion de Supabase
  useEffect(() => {
    // Limpiar hash de tokens de Supabase tras redireccion de confirmacion
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash;
      if (hash.includes('access_token=') || hash.includes('type=signup') || hash.includes('type=recovery')) {
        setTimeout(() => {
          window.history.replaceState(null, '', window.location.pathname);
        }, 1200);
      }
    }

    const syncUser = async (user: any) => {
      setCurrentUser(user);
      if (user && !user.is_anonymous) {
        const data = await fetchUserDataFromSupabase(user.id);
        if (data) {
          setUserProfile(data.profile);
          setStreakData(data.streak);
          if (data.preferredVersion) {
            setCurrentVersion(data.preferredVersion);
          }
        }
      } else {
        setStreakData(getReadingStreakData());
        setUserProfile(getUserProfile());
      }
    };

    getCurrentAuthUser().then((user) => {
      syncUser(user);
    });

    const unsubscribe = onAuthStateChange((user) => {
      syncUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Carga inicial de versiculos segun ultima lectura o inicio
  const loadInitialVerses = useCallback(async (version: string) => {
    setIsLoading(true);
    const reading = getLastReading();
    setLastReading(reading);

    let data: Verse[] = [];
    if (reading.bookOrder && reading.chapter) {
      data = await getVersesByBookAndChapter(reading.bookOrder, reading.chapter, version, 40);
    }

    if (!data || data.length === 0) {
      data = await getFeedVerses(version, 40);
    }

    setVerses(data);
    if (data.length > 0) {
      setActiveVerseId(data[0].id);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadInitialVerses(currentVersion);

    // Cargar likes, marcadores y versiculos guardados del almacenamiento local
    try {
      const localLikes = JSON.parse(localStorage.getItem('biblia_likes') || '[]');
      setLikedVerseIds(new Set(localLikes));

      const localBookmarks = JSON.parse(localStorage.getItem('biblia_bookmarks') || '[]');
      setBookmarkedVerseIds(new Set(localBookmarks));

      const storedVerses = JSON.parse(localStorage.getItem('biblia_saved_verses_data') || '[]');
      setSavedVersesList(storedVerses);
    } catch {
      // Ignorar errores de lectura local
    }
  }, [currentVersion, loadInitialVerses]);

  // Observador para detectar que versiculo esta centrado en pantalla
  useEffect(() => {
    const container = feedContainerRef.current;
    if (!container || verses.length === 0) return;

    const cards = container.querySelectorAll('.verse-snap-card');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-verse-id');
            if (id) {
              setActiveVerseId(id);

              const active = verses.find((v) => v.id === id);
              if (active) {
                const reading: LastReading = {
                  bookOrder: active.bookOrder,
                  chapter: active.chapter,
                  bookName: active.bookName,
                  verseNumber: active.verseNumber,
                };
                setLastReading(reading);
                saveLastReading(reading);

                // Registrar lectura de versiculo y actualizar racha
                const updatedStreak = recordVerseReading();
                setStreakData(updatedStreak);
                if (currentUser && !currentUser.is_anonymous) {
                  syncStreakToSupabase(currentUser.id, updatedStreak);
                }
              }
            }
          }
        }
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    cards.forEach((card) => observer.observe(card));

    const handleFeedScroll = () => {
      const currentScrollTop = container.scrollTop;
      const diff = currentScrollTop - lastScrollTopRef.current;

      // Umbral minimo para descartar micro-movimientos o rebotes imperceptibles
      if (Math.abs(diff) < 10) return;

      if (diff > 0) {
        // Desplazamiento hacia abajo (avanzando en la lectura):
        // Mantener la pantalla completamente limpia sin HUD
        setIsHudVisible(false);
        if (hideHudTimeoutRef.current) {
          clearTimeout(hideHudTimeoutRef.current);
          hideHudTimeoutRef.current = null;
        }
      } else {
        // Desplazamiento hacia arriba (retroceso o busqueda de controles):
        // Mostrar HUD y reiniciar temporizador de auto-ocultado
        resetHudTimer(true);
      }

      lastScrollTopRef.current = currentScrollTop;
    };

    container.addEventListener('scroll', handleFeedScroll, { passive: true });

    return () => {
      observer.disconnect();
      container.removeEventListener('scroll', handleFeedScroll);
    };
  }, [verses, resetHudTimer]);

  // Cargar mas versiculos de forma continua al aproximarse al final del feed
  useEffect(() => {
    if (!activeVerseId || verses.length === 0 || isFetchingMoreRef.current) return;

    const currentIndex = verses.findIndex((v) => v.id === activeVerseId);
    if (currentIndex >= verses.length - 4) {
      const lastVerse = verses[verses.length - 1];
      if (!lastVerse || !lastVerse.globalOrder) return;

      isFetchingMoreRef.current = true;
      setIsLoadingMore(true);

      getMoreVerses(lastVerse.globalOrder, currentVersion, 30)
        .then((newVerses) => {
          if (newVerses.length > 0) {
            setVerses((prev) => {
              const existingIds = new Set(prev.map((v) => v.id));
              const filtered = newVerses.filter((v) => !existingIds.has(v.id));
              return [...prev, ...filtered];
            });
          }
        })
        .finally(() => {
          isFetchingMoreRef.current = false;
          setIsLoadingMore(false);
        });
    }
  }, [activeVerseId, verses, currentVersion]);

  // Versiculo activo actualmente enfocado
  const activeVerse = verses.find((v) => v.id === activeVerseId) || verses[0];

  // Alternar tema rapidamente
  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('biblia_theme', next);
  };

  const handleSelectTheme = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('biblia_theme', newTheme);
  };

  // Actualizar nombre de usuario
  const handleUpdateUserName = (newName: string) => {
    const updated: UserProfileData = {
      ...userProfile,
      name: newName,
    };
    setUserProfile(updated);
    saveUserProfile(updated);
    if (currentUser) {
      syncLocalDataToSupabase(currentUser.id, newName);
    }
  };

  // Autenticacion progresiva con Supabase
  const handleOpenAuth = (view: 'login' | 'register' | 'recovery' = 'register') => {
    setAuthModalInitialView(view);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (_user: SupabaseUser) => {
    setIsAuthModalOpen(false);
    setStreakData(getReadingStreakData());
    setUserProfile(getUserProfile());
  };

  const handleSignOut = async () => {
    await signOutUser();
    setCurrentUser(null);
    setUserProfile(getUserProfile());
    setStreakData(getReadingStreakData());
  };

  // Cierre de bienvenida
  const handleCloseWelcome = () => {
    setIsWelcomeOpen(false);
  };

  // Navegacion directa desde el Explorador de Libros
  const handleSelectBookAndChapter = async (
    bookOrder: number,
    chapter: number,
    bookName: string
  ) => {
    setIsLoading(true);
    const newVerses = await getVersesByBookAndChapter(bookOrder, chapter, currentVersion, 40);

    if (newVerses && newVerses.length > 0) {
      setVerses(newVerses);
      setActiveVerseId(newVerses[0].id);

      if (feedContainerRef.current) {
        feedContainerRef.current.scrollTop = 0;
      }

      const reading: LastReading = {
        bookOrder,
        chapter,
        bookName,
        verseNumber: 1,
      };
      setLastReading(reading);
      saveLastReading(reading);
    }
    setIsLoading(false);
  };

  const handleLikeToggle = async (verseId: string) => {
    const isCurrentlyLiked = likedVerseIds.has(verseId);

    setLikedVerseIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyLiked) {
        next.delete(verseId);
      } else {
        next.add(verseId);
      }
      return next;
    });

    const finalLikedState = await toggleVerseLike(verseId, isCurrentlyLiked);
    setLikedVerseIds((prev) => {
      const next = new Set(prev);
      if (finalLikedState) {
        next.add(verseId);
      } else {
        next.delete(verseId);
      }
      return next;
    });
  };

  const handleBookmarkToggle = (verseId: string) => {
    const targetVerse = verses.find((v) => v.id === verseId);

    setBookmarkedVerseIds((prev) => {
      const next = new Set(prev);
      if (next.has(verseId)) {
        next.delete(verseId);
      } else {
        next.add(verseId);
      }
      localStorage.setItem('biblia_bookmarks', JSON.stringify(Array.from(next)));
      return next;
    });

    if (targetVerse) {
      setSavedVersesList((prev) => {
        const exists = prev.some((v) => v.id === verseId);
        const updated = exists
          ? prev.filter((v) => v.id !== verseId)
          : [targetVerse, ...prev];
        localStorage.setItem('biblia_saved_verses_data', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleRemoveBookmark = (verseId: string) => {
    setBookmarkedVerseIds((prev) => {
      const next = new Set(prev);
      next.delete(verseId);
      localStorage.setItem('biblia_bookmarks', JSON.stringify(Array.from(next)));
      return next;
    });

    setSavedVersesList((prev) => {
      const updated = prev.filter((v) => v.id !== verseId);
      localStorage.setItem('biblia_saved_verses_data', JSON.stringify(updated));
      return updated;
    });
  };

  const handleOpenNotes = async (verseId: string) => {
    const verse = verses.find((v) => v.id === verseId);
    if (verse) {
      setActiveVerseForNotes(verse);
      const verseNotes = await getVerseNotes(verseId);
      setNotes(verseNotes);
    }
  };

  const handleSaveNote = async (verseId: string, content: string, isPrivate: boolean) => {
    const savedNote = await addVerseNote(verseId, content, isPrivate, isPrivate ? 'personal' : 'comunidad');
    if (savedNote) {
      setNotes((prev) => [savedNote, ...prev]);
    }
  };

  const handleShare = async (verse: Verse) => {
    const shareText = `"${verse.text}"\n— ${verse.bookName} ${verse.chapter}:${verse.verseNumber} (${verse.version})\n\nLeído en BibliaApp`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BibliaApp',
          text: shareText,
        });
      } catch {
        // Cancelacion por usuario
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Versiculo copiado al portapapeles');
    }
  };

  const handleVersionCycle = () => {
    const versions = ['RVR1960', 'NVI', 'NTV', 'RVR09', 'BL95', 'WEB'];
    const nextIndex = (versions.indexOf(currentVersion) + 1) % versions.length;
    handleSelectVersion(versions[nextIndex]);
  };

  const handleSelectVersion = async (version: string) => {
    if (version === currentVersion) return;
    setCurrentVersion(version);
    saveStoredPreferredVersion(version);

    if (currentUser && !currentUser.is_anonymous) {
      syncPreferredVersionToSupabase(currentUser.id, version);
    }

    if (activeVerse) {
      setIsLoading(true);
      const reloaded = await getVersesByBookAndChapter(
        activeVerse.bookOrder,
        activeVerse.chapter,
        version,
        40
      );
      setVerses(reloaded);
      if (reloaded.length > 0) {
        setActiveVerseId(reloaded[0].id);
      }
      setIsLoading(false);
    }
  };

  const handleFontSizeChange = (size: 'normal' | 'grande' | 'extra') => {
    setFontSize(size);
    localStorage.setItem('biblia_font_size', size);
  };

  const handleNavigateToSavedVerse = async (savedVerse: Verse) => {
    const existingIndex = verses.findIndex((v) => v.id === savedVerse.id);

    if (existingIndex !== -1 && feedContainerRef.current) {
      const card = feedContainerRef.current.querySelector(
        `[data-verse-id="${savedVerse.id}"]`
      );
      if (card) {
        card.scrollIntoView({ behavior: 'smooth' });
        setActiveVerseId(savedVerse.id);
        return;
      }
    }

    await handleSelectBookAndChapter(
      savedVerse.bookOrder,
      savedVerse.chapter,
      savedVerse.bookName
    );
  };

  // Calcular dias de la semana activa
  const weeklyDays = getWeeklyStreakDays(streakData);
  const isStreakCompletedToday = new Set(streakData.historyDates || []).has(getLocalDateString());

  return (
    <div className="relative h-full w-full bg-[#f8f7f4] dark:bg-[#131315] text-[#18181b] dark:text-white transition-colors duration-200">
      {/* Barra superior fija con soporte de tema claro/oscuro y modo inmersivo */}
      <TopBar
        currentVersion={currentVersion}
        activeBookName={activeVerse?.bookName || lastReading.bookName}
        activeChapter={activeVerse?.chapter || lastReading.chapter}
        theme={theme}
        isVisible={isHudVisible}
        isOffline={isOffline}
        onToggleTheme={handleToggleTheme}
        onOpenExplorer={() => setIsExplorerOpen(true)}
        onOpenWelcome={() => setIsWelcomeOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenVersionSelector={() => setIsVersionSelectorOpen(true)}
        onVersionSelect={handleVersionCycle}
      />

      {/* Riel flotante lateral persistente (HUD fijo en pantalla) */}
      {activeVerse && (
        <VerseActionBar
          isVisible={isHudVisible}
          isLiked={likedVerseIds.has(activeVerse.id)}
          likeCount={
            activeVerse.likeCount
              ? activeVerse.likeCount + (likedVerseIds.has(activeVerse.id) ? 1 : 0)
              : (likedVerseIds.has(activeVerse.id) ? 1 : 0)
          }
          isBookmarked={bookmarkedVerseIds.has(activeVerse.id)}
          notesCount={
            notes.filter((n) => n.verseId === activeVerse.id).length ||
            activeVerse.notesCount ||
            0
          }
          onLikeToggle={() => handleLikeToggle(activeVerse.id)}
          onBookmarkToggle={() => handleBookmarkToggle(activeVerse.id)}
          onOpenNotes={() => handleOpenNotes(activeVerse.id)}
          onShare={() => handleShare(activeVerse)}
        />
      )}

      {/* Indicador flotante no intrusivo de lectura offline */}
      {isOffline && (
        <div
          className="fixed inset-x-0 z-30 flex justify-center pointer-events-none px-4 transition-all duration-300"
          style={{
            top: 'calc(env(safe-area-inset-top, 0px) + 4.75rem)',
          }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 dark:bg-amber-400/15 text-amber-800 dark:text-amber-200 border border-amber-500/30 text-xs font-semibold backdrop-blur-md shadow-md animate-in fade-in slide-in-from-top-2 duration-300">
            <WifiOff className="h-3.5 w-3.5 shrink-0" />
            <span>Modo sin conexión · Lectura local activa</span>
          </div>
        </div>
      )}

      {/* Indicador de carga cuando se cambia de capitulo o libro */}
      {isLoading ? (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-[#f8f7f4] dark:bg-[#131315] text-black/80 dark:text-white">
          <Loader2 className="h-8 w-8 animate-spin text-black/40 dark:text-white/50 mb-3" />
          <span className="text-sm font-semibold tracking-wide text-black/80 dark:text-white/80">
            Cargando escrituras...
          </span>
        </div>
      ) : (
        /* Feed principal de scroll vertical snap: limpio y sin elementos redundantes */
        <FeedLayout ref={feedContainerRef}>
          {verses.map((verse) => (
            <VerseCard
              key={verse.id}
              verse={{
                ...verse,
                version: currentVersion,
              }}
              isLiked={likedVerseIds.has(verse.id)}
              fontSize={fontSize}
              isHudVisible={isHudVisible}
              onLikeToggle={handleLikeToggle}
              onToggleHud={handleToggleHud}
            />
          ))}

          {/* Indicador de carga progresiva al pie del feed */}
          {isLoadingMore && (
            <div className="flex h-24 items-center justify-center bg-[#f8f7f4] dark:bg-[#131315] text-black/50 dark:text-white/50">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              <span className="text-xs">Cargando siguientes versiculos...</span>
            </div>
          )}
        </FeedLayout>
      )}

      {/* Pantalla de Bienvenida Diaria Contextual */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        userName={userProfile.name}
        streak={streakData.currentStreak}
        isStreakCompletedToday={isStreakCompletedToday}
        isRegisteredUser={Boolean(currentUser && !currentUser.is_anonymous)}
        weeklyDays={weeklyDays}
        lastReading={lastReading}
        onClose={handleCloseWelcome}
        onResumeReading={handleCloseWelcome}
        onOpenAuth={(view) => handleOpenAuth(view)}
      />

      {/* Modal de Notas y Reflexiones (Bottom Sheet) */}
      <NotesModal
        verse={activeVerseForNotes}
        isOpen={Boolean(activeVerseForNotes)}
        notes={notes}
        onClose={() => setActiveVerseForNotes(null)}
        onSaveNote={handleSaveNote}
      />

      {/* Modal de Explorador de Libros (todos los 66 libros y capitulos) */}
      <BookExplorerModal
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        activeBookOrder={activeVerse?.bookOrder || lastReading.bookOrder}
        activeChapter={activeVerse?.chapter || lastReading.chapter}
        lastReading={lastReading}
        onSelectBookAndChapter={handleSelectBookAndChapter}
      />

      {/* Modal de Perfil de Usuario Rediseñado con Racha y Logros */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        streakData={streakData}
        weeklyDays={weeklyDays}
        userProfile={userProfile}
        bookmarkedVerses={savedVersesList}
        notes={notes}
        currentVersion={currentVersion}
        fontSize={fontSize}
        theme={theme}
        onUpdateUserName={handleUpdateUserName}
        onSelectVersion={handleSelectVersion}
        onSelectFontSize={handleFontSizeChange}
        onSelectTheme={handleSelectTheme}
        onOpenAuth={(view) => handleOpenAuth(view)}
        onSignOut={handleSignOut}
        onNavigateToVerse={handleNavigateToSavedVerse}
        onRemoveBookmark={handleRemoveBookmark}
      />

      {/* Modal de Autenticacion Progresiva (Registro / Inicio de Sesion / Recuperacion) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialView={authModalInitialView}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Modal Selector de Traduccion Biblica */}
      <VersionSelectorModal
        isOpen={isVersionSelectorOpen}
        currentVersion={currentVersion}
        onClose={() => setIsVersionSelectorOpen(false)}
        onSelectVersion={handleSelectVersion}
      />
    </div>
  );
};
