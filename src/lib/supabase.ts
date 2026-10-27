import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Determinar si Supabase esta configurado con credenciales reales
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('tu-proyecto') &&
  !supabaseAnonKey.includes('tu-clave')
);

// Cliente de Supabase (o cliente inerte si no esta configurado)
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Garantiza una sesion anonima o activa para que operen las politicas RLS de Supabase.
 */
export async function ensureSession(): Promise<string | null> {
  if (!isSupabaseConfigured) return 'local-guest-user';

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.id) {
      return session.user.id;
    }

    // Iniciar sesion anonima si no existe sesion previa
    const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
    if (anonError) {
      console.warn('No se pudo iniciar sesion anonima en Supabase:', anonError.message);
      return null;
    }

    return anonData.user?.id || null;
  } catch (err) {
    console.error('Error al inicializar la sesion de Supabase:', err);
    return null;
  }
}
