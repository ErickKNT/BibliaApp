import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  MailCheck,
} from 'lucide-react';
import {
  signUpWithEmail,
  signInWithEmail,
  sendPasswordReset,
  resendConfirmationEmail,
} from '@/services/authService';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export interface AuthModalProps {
  isOpen: boolean;
  initialView?: 'login' | 'register' | 'recovery' | 'verify_email';
  onClose: () => void;
  onAuthSuccess: (user: SupabaseUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialView = 'register',
  onClose,
  onAuthSuccess,
}) => {
  const [view, setView] = useState<'login' | 'register' | 'recovery' | 'verify_email'>(initialView);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Estado para la pantalla de verificacion de correo
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setErrorMessage(null);
      setSuccessMessage(null);
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setShowConfirmPassword(false);
      setResendStatus(null);
    }
  }, [isOpen, initialView]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  const handleSwitchView = (nextView: 'login' | 'register' | 'recovery' | 'verify_email') => {
    setView(nextView);
    setErrorMessage(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setResendStatus(null);
  };

  const handleResendConfirmation = async () => {
    if (isResending || resendCooldown > 0 || !email.trim()) return;
    setIsResending(true);
    setResendStatus(null);
    try {
      const { success, error } = await resendConfirmationEmail(email.trim());
      if (error) {
        setResendStatus(error);
      } else if (success) {
        setResendStatus('Se ha enviado un nuevo enlace de confirmación a tu correo.');
        setResendCooldown(60);
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (view === 'register') {
        if (!name.trim()) {
          setErrorMessage('Por favor ingresa tu nombre');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage('La contraseña debe tener al menos 6 caracteres');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMessage('Las contraseñas no coinciden. Por favor verifícalas');
          setIsLoading(false);
          return;
        }

        const { user, error, needsEmailVerification } = await signUpWithEmail(
          email.trim(),
          password,
          name.trim()
        );

        if (error) {
          setErrorMessage(error);
        } else if (needsEmailVerification || (user && !user.email_confirmed_at)) {
          // Cambiar a la pantalla de verificacion de correo
          setView('verify_email');
        } else if (user) {
          setSuccessMessage('Cuenta creada y sincronizada exitosamente');
          setTimeout(() => {
            onAuthSuccess(user);
            onClose();
          }, 1200);
        }
      } else if (view === 'login') {
        const { user, error } = await signInWithEmail(email.trim(), password);
        if (error) {
          setErrorMessage(error);
        } else if (user) {
          setSuccessMessage('Sesión iniciada correctamente');
          setTimeout(() => {
            onAuthSuccess(user);
            onClose();
          }, 1000);
        }
      } else if (view === 'recovery') {
        const { success, error } = await sendPasswordReset(email.trim());
        if (error) {
          setErrorMessage(error);
        } else if (success) {
          setSuccessMessage('Se ha enviado el enlace de restablecimiento a tu correo.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in select-none">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 dark:bg-[#0e0e10]/80 backdrop-blur-md"
      />

      <section
        aria-label="Autenticación de Usuario"
        className="relative z-50 flex h-auto max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/10 bg-[#fcfbf9] dark:bg-[#131315] text-[#18181b] dark:text-white shadow-2xl overflow-hidden min-h-0 transition-colors duration-200"
      >
        {/* Cabecera */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-black/5 dark:border-white/5 shrink-0 bg-[#fcfbf9] dark:bg-[#131315]">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
              {view === 'verify_email' ? (
                <MailCheck className="h-4 w-4" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-black dark:text-white leading-none">
                {view === 'register' && 'Crear Cuenta'}
                {view === 'login' && 'Iniciar Sesión'}
                {view === 'recovery' && 'Recuperar Contraseña'}
                {view === 'verify_email' && 'Verifica tu Correo'}
              </h2>
              <span className="text-[11px] text-black/50 dark:text-white/50">
                BibliaApp Sincronizada
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

        {/* Banner sutil de beneficios en registro */}
        {view === 'register' && (
          <div className="px-6 py-2.5 bg-[#f5f4ef] dark:bg-[#171618] border-b border-black/5 dark:border-white/5 text-xs text-black/70 dark:text-white/70 flex items-center gap-2 shrink-0">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
            <span>Respalda tu racha, tus notas y versículos en todos tus dispositivos.</span>
          </div>
        )}

        {/* Mensajes de retroalimentacion */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Pantalla de Verificacion de Correo */}
        {view === 'verify_email' ? (
          <div className="p-6 text-center space-y-4 overflow-y-auto no-scrollbar">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black/5 dark:bg-white/10 text-black dark:text-white border border-black/10 dark:border-white/10 shadow-inner">
              <MailCheck className="h-8 w-8 text-black dark:text-white" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-black dark:text-white tracking-tight">
                ¡Revisa tu bandeja de entrada!
              </h3>
              <p className="text-xs text-black/60 dark:text-white/60">
                Hemos enviado un correo con el enlace de confirmación a:
              </p>
              <div className="inline-block max-w-full truncate px-3 py-1 rounded-lg bg-black/5 dark:bg-white/10 font-mono text-xs font-semibold text-black dark:text-white mt-1 border border-black/5 dark:border-white/5">
                {email || 'tu correo'}
              </div>
            </div>

            <div className="rounded-xl border border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#18171a] p-3 text-left text-xs space-y-1.5 text-black/70 dark:text-white/70">
              <p className="font-semibold text-black dark:text-white">Pasos a seguir:</p>
              <p>1. Abre el correo que te acaba de llegar.</p>
              <p>2. Haz clic en el botón de confirmación.</p>
              <p className="text-[11px] text-black/50 dark:text-white/50 pt-1">
                Nota: Si no lo ves en unos segundos, revisa tu carpeta de Spam o Correo no deseado.
              </p>
            </div>

            {resendStatus && (
              <div className="p-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs text-black/80 dark:text-white/80 border border-black/10 dark:border-white/10">
                {resendStatus}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleSwitchView('login')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 py-3 text-xs sm:text-sm font-bold transition-all active:scale-[0.98] shadow-sm"
              >
                <span>Ya confirmé mi correo / Iniciar Sesión</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                <button
                  type="button"
                  disabled={isResending || resendCooldown > 0}
                  onClick={handleResendConfirmation}
                  className="text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white underline disabled:opacity-40 disabled:no-underline flex items-center gap-1"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Reenviando...</span>
                    </>
                  ) : resendCooldown > 0 ? (
                    <span>Reenviar en {resendCooldown}s</span>
                  ) : (
                    <span>¿No llegó? Reenviar correo</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white font-medium"
                >
                  Continuar leyendo
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Formulario de registro, login y recuperacion */
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto no-scrollbar">
            {view === 'register' && (
              <div>
                <label className="text-xs font-semibold text-black/70 dark:text-white/70 block mb-1.5">
                  Tu Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-black/40 dark:text-white/40" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#edece6] dark:bg-[#201f22] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:border-black dark:focus:border-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-black/70 dark:text-white/70 block mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-black/40 dark:text-white/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#edece6] dark:bg-[#201f22] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:border-black dark:focus:border-white focus:outline-none"
                />
              </div>
            </div>

            {view !== 'recovery' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-black/70 dark:text-white/70">
                      Contraseña
                    </label>
                    {view === 'login' && (
                      <button
                        type="button"
                        onClick={() => handleSwitchView('recovery')}
                        className="text-[11px] text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 h-4 w-4 text-black/40 dark:text-white/40" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#edece6] dark:bg-[#201f22] py-2.5 pl-10 pr-10 text-xs sm:text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:border-black dark:focus:border-white focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors p-1"
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {view === 'register' && (
                  <div>
                    <label className="text-xs font-semibold text-black/70 dark:text-white/70 block mb-1.5">
                      Confirmar Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 h-4 w-4 text-black/40 dark:text-white/40" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repite tu contraseña"
                        className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-[#edece6] dark:bg-[#201f22] py-2.5 pl-10 pr-10 text-xs sm:text-sm text-black dark:text-white placeholder-black/40 dark:placeholder-white/40 focus:border-black dark:focus:border-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2.5 text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white transition-colors p-1"
                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 py-3 text-xs sm:text-sm font-bold transition-all active:scale-[0.98] shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>
                    {view === 'register' && 'Crear Cuenta Gratuita'}
                    {view === 'login' && 'Entrar a mi Cuenta'}
                    {view === 'recovery' && 'Enviar Instrucciones'}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Alternador de Vistas */}
        <div className="border-t border-black/5 dark:border-white/5 bg-[#f5f4ef] dark:bg-[#171618] px-6 py-3.5 text-center text-xs text-black/60 dark:text-white/60 shrink-0">
          {view === 'register' ? (
            <p>
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => handleSwitchView('login')}
                className="font-bold text-black dark:text-white underline hover:opacity-80"
              >
                Inicia sesión aquí
              </button>
            </p>
          ) : view === 'login' ? (
            <p>
              ¿Aún no tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => handleSwitchView('register')}
                className="font-bold text-black dark:text-white underline hover:opacity-80"
              >
                Regístrate gratis
              </button>
            </p>
          ) : view === 'verify_email' ? (
            <p>
              ¿Deseas usar otro correo?{' '}
              <button
                type="button"
                onClick={() => handleSwitchView('register')}
                className="font-bold text-black dark:text-white underline hover:opacity-80"
              >
                Volver al registro
              </button>
            </p>
          ) : (
            <p>
              ¿Recordaste tu contraseña?{' '}
              <button
                type="button"
                onClick={() => handleSwitchView('login')}
                className="font-bold text-black dark:text-white underline hover:opacity-80"
              >
                Volver a Iniciar Sesión
              </button>
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
