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
 * Traduce y contextualiza los mensajes de error devueltos por Supabase Auth en espanol.
 */
export function formatAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('email signups are disabled')) {
    return 'El registro por correo está deshabilitado en Supabase. Activa la opción "Allow new users to sign up" en Authentication > Providers > Email de tu Supabase Dashboard.';
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'Este correo electrónico ya está registrado. Por favor inicia sesión.';
  }
  if (lower.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos. Por favor verifica tus datos.';
  }
  if (lower.includes('email not confirmed')) {
    return 'Correo pendiente de confirmación. Revisa tu bandeja de entrada o desactiva la confirmación obligatoria en Supabase.';
  }
  if (lower.includes('password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (lower.includes('rate limit')) {
    return 'Se ha superado el límite de intentos. Por favor espera unos minutos.';
  }
  return message;
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
      return { user: null, error: formatAuthError(error.message) };
    }

    if (data.user) {
      // Migrar datos acumulados en local hacia Supabase
      await syncLocalDataToSupabase(data.user.id, displayName);
    }

    return { user: data.user, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? formatAuthError(err.message) : 'Error al registrar la cuenta';
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
      return { user: null, error: formatAuthError(error.message) };
    }

    if (data.user) {
      // Descargar perfil y racha de Supabase al almacenamiento local
      await fetchUserDataFromSupabase(data.user.id);
    }

    return { user: data.user, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? formatAuthError(err.message) : 'Error al iniciar sesion';
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
      return { success: false, error: formatAuthError(error.message) };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? formatAuthError(err.message) : 'Error al solicitar recuperacion';
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
