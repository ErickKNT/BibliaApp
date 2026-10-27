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
  historyDates: string[]; // List of YYYY-MM-DD dates with reading activity
}

export interface UserProfileData {
  name: string;
  avatarColor: string;
  dailyGoal: number; // Minimo de versiculos al dia
  createdAt: string;
}

// Helper para fecha local en formato YYYY-MM-DD
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const STREAK_STORAGE_KEY = 'biblia_streak_data';
const PROFILE_STORAGE_KEY = 'biblia_user_profile';

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
 * Obtiene los datos de racha del almacenamiento local o inicializa.
 */
export function getReadingStreakData(): ReadingStreakData {
  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (raw) {
      const data: ReadingStreakData = JSON.parse(raw);
      // Validar si la racha se rompio por haber pasado mas de 1 dia sin leer
      const today = getLocalDateString();
      const yesterday = getLocalDateString(new Date(Date.now() - 86400000));

      if (data.lastReadDate && data.lastReadDate !== today && data.lastReadDate !== yesterday) {
        // Racha interrumpida
        data.currentStreak = 0;
      }
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
  const yesterday = getLocalDateString(new Date(Date.now() - 86400000));

  const historySet = new Set(current.historyDates || []);
  const wasAlreadyCompletedToday = historySet.has(today);

  // Incrementar conteo total de versiculos
  const nextTotal = (current.totalVersesRead || 0) + 1;

  if (wasAlreadyCompletedToday) {
    // Ya habia leido hoy, solo sumamos versiculo leido
    const updated: ReadingStreakData = {
      ...current,
      totalVersesRead: nextTotal,
    };
    saveReadingStreakData(updated);
    return updated;
  }

  // Primer versiculo leido hoy: calcular continuidad de racha
  let nextStreak = 1;
  if (current.lastReadDate === yesterday) {
    nextStreak = (current.currentStreak || 0) + 1;
  } else if (current.lastReadDate === today) {
    nextStreak = current.currentStreak || 1;
  }

  historySet.add(today);
  const updatedHistory = Array.from(historySet);
  const nextLongest = Math.max(current.longestStreak || 0, nextStreak);

  const nextData: ReadingStreakData = {
    currentStreak: nextStreak,
    longestStreak: nextLongest,
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
  // Ajustar para que la semana comience en Lunes (0 = Lunes, 6 = Domingo)
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
