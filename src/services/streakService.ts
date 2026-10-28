export interface StreakDay {
  date: string; // 'YYYY-MM-DD'
  dayLabel: string; // 'L', 'M', 'M', 'J', 'V', 'S', 'D'
  dayNumber: number; // 1..31
  completed: boolean;
  isToday: boolean;
}

export interface ReadingStreakData {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
  totalVersesRead: number;
  historyDates: string[]; // Lista de fechas 'YYYY-MM-DD' con actividad de lectura
}

export interface UserProfileData {
  name: string;
  avatarColor: string;
  dailyGoal: number; // Minimo de versiculos al dia
  createdAt: string;
}

// Helper para fecha local en formato YYYY-MM-DD (inmune a desplazamientos UTC)
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const STREAK_STORAGE_KEY = 'biblia_streak_data';
const PROFILE_STORAGE_KEY = 'biblia_user_profile';
const VERSION_STORAGE_KEY = 'biblia_preferred_version';

const DEFAULT_STREAK_DATA: ReadingStreakData = {
  currentStreak: 1,
  longestStreak: 1,
  lastReadDate: getLocalDateString(),
  totalVersesRead: 1,
  historyDates: [getLocalDateString()],
};

const DEFAULT_PROFILE_DATA: UserProfileData = {
  name: 'Lector Bíblico',
  avatarColor: '#18181b',
  dailyGoal: 5,
  createdAt: getLocalDateString(),
};

/**
 * Calcula con precision matemática los dias consecutivos de racha a partir del historial.
 * Es inmune a cambios de huso horario (DST), reinicios de sesion o formateos de fecha.
 */
export function calculateStreakFromHistory(
  historyDates: string[],
  referenceDate: Date = new Date()
): { currentStreak: number; longestStreak: number; isCompletedToday: boolean } {
  const historySet = new Set(historyDates || []);
  const todayStr = getLocalDateString(referenceDate);

  const yesterdayDate = new Date(referenceDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterdayDate);

  const isCompletedToday = historySet.has(todayStr);

  let currentStreak = 0;
  let checkDate = new Date(referenceDate);

  if (!isCompletedToday) {
    if (historySet.has(yesterdayStr)) {
      // Si hoy no ha leido pero leyo ayer, la racha esta activa esperando la lectura de hoy
      checkDate = yesterdayDate;
    } else {
      // Racha interrumpida (no leyo ni hoy ni ayer)
      return {
        currentStreak: 0,
        longestStreak: computeLongestConsecutiveDays(historySet),
        isCompletedToday: false,
      };
    }
  }

  // Recorrer hacia atras de dia en dia
  while (true) {
    const dateStr = getLocalDateString(checkDate);
    if (historySet.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  const longestStreak = Math.max(
    currentStreak,
    computeLongestConsecutiveDays(historySet)
  );

  return {
    currentStreak,
    longestStreak,
    isCompletedToday,
  };
}

function computeLongestConsecutiveDays(historySet: Set<string>): number {
  if (historySet.size === 0) return 0;
  const sortedDates = Array.from(historySet).sort();
  let maxStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i - 1] + 'T00:00:00');
    const curr = new Date(sortedDates[i] + 'T00:00:00');
    const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentRun++;
      if (currentRun > maxStreak) maxStreak = currentRun;
    } else if (diffDays > 1) {
      currentRun = 1;
    }
  }

  return maxStreak;
}

/**
 * Obtiene los datos de racha del almacenamiento local y recalcula la continuidad de hoy.
 */
export function getReadingStreakData(): ReadingStreakData {
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (raw) {
      const data: ReadingStreakData = JSON.parse(raw);
      const calculated = calculateStreakFromHistory(data.historyDates || []);
      data.currentStreak = calculated.currentStreak;
      data.longestStreak = Math.max(data.longestStreak || 0, calculated.longestStreak);
      return data;
    }
  } catch {
    // Error de lectura local
  }
  return DEFAULT_STREAK_DATA;
}

/**
 * Guarda los datos de racha en almacenamiento local.
 */
export function saveReadingStreakData(data: ReadingStreakData): void {
  try {
    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Almacenamiento no disponible
  }
}

/**
 * Registra la lectura de un versiculo y actualiza la racha diaria.
 */
export function recordVerseReading(): ReadingStreakData {
  const current = getReadingStreakData();
  const today = getLocalDateString();

  const historySet = new Set(current.historyDates || []);
  historySet.add(today);
  const updatedHistory = Array.from(historySet);

  const calculated = calculateStreakFromHistory(updatedHistory);
  const nextTotal = (current.totalVersesRead || 0) + 1;

  const nextData: ReadingStreakData = {
    currentStreak: calculated.currentStreak,
    longestStreak: calculated.longestStreak,
    lastReadDate: today,
    totalVersesRead: nextTotal,
    historyDates: updatedHistory,
  };

  saveReadingStreakData(nextData);
  return nextData;
}

/**
 * Genera la lista de los 7 dias de la semana corriente (Lunes a Domingo) con estado de cumplimiento.
 */
export function getWeeklyStreakDays(streakData: ReadingStreakData): StreakDay[] {
  const today = new Date();
  const todayString = getLocalDateString(today);
  const historySet = new Set(streakData.historyDates || []);

  // Calcular el lunes de la semana actual (0 es domingo, 1 es lunes)
  const currentDayOfWeek = today.getDay(); // 0..6
  const distanceToMonday = (currentDayOfWeek + 6) % 7;

  const monday = new Date(today);
  monday.setDate(today.getDate() - distanceToMonday);

  const dayLabels = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const weekDays: StreakDay[] = [];

  for (let i = 0; i < 7; i++) {
    const loopDate = new Date(monday);
    loopDate.setDate(monday.getDate() + i);

    const dateStr = getLocalDateString(loopDate);
    weekDays.push({
      date: dateStr,
      dayLabel: dayLabels[i],
      dayNumber: loopDate.getDate(),
      completed: historySet.has(dateStr),
      isToday: dateStr === todayString,
    });
  }

  return weekDays;
}

/**
 * Obtiene el perfil de usuario.
 */
export function getUserProfile(): UserProfileData {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Error al leer
  }
  return DEFAULT_PROFILE_DATA;
}

/**
 * Guarda el perfil de usuario.
 */
export function saveUserProfile(profile: UserProfileData): void {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Error al guardar
  }
}

/**
 * Gestion de la version preferida en almacenamiento local
 */
export function getStoredPreferredVersion(): string {
  try {
    return localStorage.getItem(VERSION_STORAGE_KEY) || 'RVR1960';
  } catch {
    return 'RVR1960';
  }
}

export function saveStoredPreferredVersion(version: string): void {
  try {
    localStorage.setItem(VERSION_STORAGE_KEY, version);
  } catch {
    // Almacenamiento no disponible
  }
}
