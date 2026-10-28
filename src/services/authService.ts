import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import {
  getReadingStreakData,
  getUserProfile,
  saveReadingStreakData,
  saveUserProfile,
  type ReadingStreakData,
  type UserProfileData,
  getStoredPreferredVersion,
  saveStoredPreferredVersion,
  calculateStreakFromHistory,
  getLocalDateString,
} from '@/services/streakService';

export interface AuthResponse {
  user: User | null;
  error: string | null;
  needsEmailVerification?: boolean;
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

        emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,

      },
    });

    if (error) {
      return { user: null, error: formatAuthError(error.message) };
    }

    const needsVerification = Boolean(data.user && !data.session);

    if (data.user && data.session) {
      // Migrar datos acumulados en local hacia Supabase
      await syncLocalDataToSupabase(data.user.id, displayName);
    }

    return { user: data.user, error: null, needsEmailVerification: needsVerification };
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

    const needsVerification = Boolean(data.user && !data.session);

    if (data.user && data.session) {
      // Descargar perfil y racha de Supabase al almacenamiento local
      await fetchUserDataFromSupabase(data.user.id);
    }

    return { user: data.user, error: null, needsEmailVerification: needsVerification };
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
 * Reenvia el correo de confirmacion de registro.
 */
export async function resendConfirmationEmail(
  email: string
): Promise<{ success: boolean; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { success: true, error: null };
  }

  try {
    const redirectUrl = typeof window !== 'undefined' ? window.location.origin : undefined;
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      return { success: false, error: formatAuthError(error.message) };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? formatAuthError(err.message) : 'Error al reenviar correo de confirmacion';
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
 * Migra los datos locales (racha, perfil, version preferida) a las tablas de Supabase al registrarse o iniciar sesion.
 */
export async function syncLocalDataToSupabase(userId: string, customName?: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const localProfile = getUserProfile();
    const localStreak = getReadingStreakData();
    const preferredVersion = getStoredPreferredVersion() || 'RVR1960';

    // 1. Sincronizar user_profiles
    const nameToSave = customName || localProfile.name || 'Lector Bíblico';
    await supabase.from('user_profiles').upsert({
      id: userId,
      display_name: nameToSave,
      avatar_color: localProfile.avatarColor || '#18181b',
      daily_goal: localProfile.dailyGoal || 5,
      preferred_version: preferredVersion,
      updated_at: new Date().toISOString(),
    });

    // 2. Sincronizar user_streaks
    if (localStreak) {
      await supabase.from('user_streaks').upsert({
        user_id: userId,
        current_streak: localStreak.currentStreak || 1,
        longest_streak: localStreak.longestStreak || 1,
        last_read_date: localStreak.lastReadDate || getLocalDateString(),
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

export interface UserLoadedData {
  profile: UserProfileData;
  streak: ReadingStreakData;
  preferredVersion: string;
}

/**
 * Descarga los datos de Supabase hacia el almacenamiento local al iniciar sesion o abrir la app.
 */
export async function fetchUserDataFromSupabase(userId: string): Promise<UserLoadedData | null> {
  if (!isSupabaseConfigured) return null;

  try {
    // 1. Cargar perfil y version preferida
    const { data: profileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    let updatedProfile = getUserProfile();
    let preferredVersion = getStoredPreferredVersion();

    if (profileData) {
      updatedProfile = {
        name: profileData.display_name || updatedProfile.name,
        avatarColor: profileData.avatar_color || updatedProfile.avatarColor,
        dailyGoal: profileData.daily_goal || updatedProfile.dailyGoal,
        createdAt: profileData.created_at || updatedProfile.createdAt,
      };
      saveUserProfile(updatedProfile);

      if (profileData.preferred_version) {
        preferredVersion = profileData.preferred_version;
        saveStoredPreferredVersion(preferredVersion);
      }
    }

    // 2. Cargar racha y recalcular continuidad matematica
    const { data: streakRow } = await supabase
      .from('user_streaks')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    let updatedStreak = getReadingStreakData();

    if (streakRow) {
      const historyDates = streakRow.history_dates || [];
      const calculated = calculateStreakFromHistory(historyDates);

      updatedStreak = {
        currentStreak: calculated.currentStreak,
        longestStreak: Math.max(streakRow.longest_streak || 0, calculated.longestStreak),
        lastReadDate: streakRow.last_read_date,
        totalVersesRead: streakRow.total_verses_read || 0,
        historyDates,
      };
      saveReadingStreakData(updatedStreak);
    }

    return {
      profile: updatedProfile,
      streak: updatedStreak,
      preferredVersion,
    };
  } catch (err) {
    console.warn('Error al descargar perfil y racha de Supabase:', err);
    return null;
  }
}

/**
 * Actualiza la traduccion biblica preferida del usuario en Supabase.
 */
export async function syncPreferredVersionToSupabase(userId: string, version: string): Promise<void> {
  if (!isSupabaseConfigured || !userId) return;
  try {
    saveStoredPreferredVersion(version);
    await supabase
      .from('user_profiles')
      .update({
        preferred_version: version,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
  } catch (err) {
    console.warn('Error al actualizar version preferida en Supabase:', err);
  }
}

/**
 * Guarda en tiempo real la racha actualizada en Supabase.
 */
export async function syncStreakToSupabase(userId: string, streak: ReadingStreakData): Promise<void> {
  if (!isSupabaseConfigured || !userId) return;
  try {
    await supabase.from('user_streaks').upsert({
      user_id: userId,
      current_streak: streak.currentStreak,
      longest_streak: streak.longestStreak,
      last_read_date: streak.lastReadDate,
      total_verses_read: streak.totalVersesRead,
      history_dates: streak.historyDates,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('Error al guardar racha en Supabase:', err);
  }
}
