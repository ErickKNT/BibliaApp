import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import {
  getReadingStreakData,
  getUserProfile,
  saveReadingStreakData,
  saveUserProfile,
  type ReadingStreakData,
  type UserProfileData,
} from '@/services/streakService';

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

/**
 * Registra una nueva cuenta con correo y contrasena en Supabase.
 */
export async function signUpWithEmail(
  email: string,
  pass: string,
  displayName: string
): Promise<AuthResponse> {
  if (!isSupabaseConfigured) {
    // Modo local / desarrollo
    const fakeUser: Partial<User> = {
      id: `local-user-${Date.now()}`,
      email,
      user_metadata: { display_name: displayName },
    };
    saveUserProfile({
      ...getUserProfile(),
      name: displayName,
    });
    return { user: fakeUser as User, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      // Migrar datos acumulados en local hacia Supabase
      await syncLocalDataToSupabase(data.user.id, displayName);
    }

    return { user: data.user, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al registrar la cuenta';
    return { user: null, error: message };
  }
}

/**
 * Inicia sesion con correo y contrasena existentes.
 */
export async function signInWithEmail(email: string, pass: string): Promise<AuthResponse> {
  if (!isSupabaseConfigured) {
    const fakeUser: Partial<User> = {
      id: `local-user-${Date.now()}`,
      email,
      user_metadata: { display_name: email.split('@')[0] },
    };
    return { user: fakeUser as User, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      // Descargar perfil y racha de Supabase al almacenamiento local
      await fetchUserDataFromSupabase(data.user.id);
    }

    return { user: data.user, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al iniciar sesion';
    return { user: null, error: message };
  }
}

/**
 * Cierra la sesion del usuario actual.
 */
export async function signOutUser(): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Error al cerrar sesion en Supabase:', err);
  }
}

/**
 * Envia correo electronico para restablecimiento de contrasena.
 */
export async function sendPasswordReset(email: string): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: true, error: null };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al solicitar recuperacion';
    return { success: false, error: message };
  }
}

/**
 * Obtiene el usuario autenticado actual.
 */
export async function getCurrentAuthUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}

/**
 * Escucha cambios en el estado de autenticacion.
 */
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  if (!isSupabaseConfigured) {
    return () => {};
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Migra los datos locales (racha, perfil) a las tablas de Supabase al registrarse o iniciar sesion.
 */
export async function syncLocalDataToSupabase(userId: string, customName?: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const localProfile = getUserProfile();
    const localStreak = getReadingStreakData();

    // 1. Sincronizar user_profiles
    const nameToSave = customName || localProfile.name || 'Lector Bíblico';
    await supabase.from('user_profiles').upsert({
      id: userId,
      display_name: nameToSave,
      avatar_color: localProfile.avatarColor || '#18181b',
      daily_goal: localProfile.dailyGoal || 5,
      updated_at: new Date().toISOString(),
    });

    // 2. Sincronizar user_streaks
    if (localStreak) {
      await supabase.from('user_streaks').upsert({
        user_id: userId,
        current_streak: localStreak.currentStreak || 1,
        longest_streak: localStreak.longestStreak || 1,
        last_read_date: localStreak.lastReadDate || new Date().toISOString().split('T')[0],
        total_verses_read: localStreak.totalVersesRead || 1,
        history_dates: localStreak.historyDates || [],
        updated_at: new Date().toISOString(),
      });
    }

    // Actualizar perfil local
    saveUserProfile({
      ...localProfile,
      name: nameToSave,
    });
  } catch (err) {
    console.warn('Advertencia al migrar datos locales a Supabase:', err);
  }
}

/**
 * Descarga los datos de Supabase hacia el almacenamiento local al iniciar sesion.
 */
export async function fetchUserDataFromSupabase(userId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    // 1. Cargar perfil
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (profileData) {
      const updatedProfile: UserProfileData = {
        name: profileData.display_name,
        avatarColor: profileData.avatar_color,
        dailyGoal: profileData.daily_goal,
        createdAt: profileData.created_at,
      };
      saveUserProfile(updatedProfile);
    }

    // 2. Cargar racha
    const { data: streakRow } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (streakRow) {
      const updatedStreak: ReadingStreakData = {
        currentStreak: streakRow.current_streak,
        longestStreak: streakRow.longest_streak,
        lastReadDate: streakRow.last_read_date,
        totalVersesRead: streakRow.total_verses_read,
        historyDates: streakRow.history_dates || [],
      };
      saveReadingStreakData(updatedStreak);
    }
  } catch (err) {
    console.warn('Error al descargar perfil y racha de Supabase:', err);
  }
}
