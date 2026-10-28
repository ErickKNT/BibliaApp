// Servicio de PWA: Registro de Service Worker, gestion de instalacion y estado offline

type NetworkStatusCallback = (isOnline: boolean) => void;
type InstallAvailabilityCallback = (canInstall: boolean) => void;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const installListeners = new Set<InstallAvailabilityCallback>();
const networkListeners = new Set<NetworkStatusCallback>();

/**
 * Registra el Service Worker de la PWA en el navegador si esta soportado.
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Hay una nueva version disponible
          console.info('Nueva version de BibliaApp lista para usar.');
        }
      });
    });

    return registration;
  } catch (error) {
    console.error('Error al registrar Service Worker:', error);
    return null;
  }
}

/**
 * Configura los escuchadores globales de eventos de PWA:
 * 'beforeinstallprompt', 'appinstalled', 'online' y 'offline'.
 */
export function initializePwaListeners(): void {
  if (typeof window === 'undefined') return;

  // Escuchar si el navegador ofrece instalacion nativa
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notifyInstallListeners(true);
  });

  // Escuchar cuando el usuario completa la instalacion
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    notifyInstallListeners(false);
  });

  // Escuchar cambios de conectividad
  window.addEventListener('online', () => {
    notifyNetworkListeners(true);
  });

  window.addEventListener('offline', () => {
    notifyNetworkListeners(false);
  });
}

function notifyInstallListeners(canInstall: boolean) {
  installListeners.forEach((callback) => callback(canInstall));
}

function notifyNetworkListeners(isOnline: boolean) {
  networkListeners.forEach((callback) => callback(isOnline));
}

/**
 * Suscribe a un componente a cambios en la disponibilidad de instalacion.
 */
export function onInstallAvailabilityChange(callback: InstallAvailabilityCallback): () => void {
  installListeners.add(callback);
  callback(Boolean(deferredPrompt));
  return () => {
    installListeners.delete(callback);
  };
}

/**
 * Suscribe a un componente a cambios en la conectividad (online / offline).
 */
export function onNetworkStatusChange(callback: NetworkStatusCallback): () => void {
  networkListeners.add(callback);
  callback(typeof navigator !== 'undefined' ? navigator.onLine : true);
  return () => {
    networkListeners.delete(callback);
  };
}

/**
 * Verifica si la aplicacion ya se esta ejecutando en modo standalone (instalada).
 */
export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIosStandalone = Boolean((window.navigator as unknown as { standalone?: boolean }).standalone);

  return isStandalone || isIosStandalone;
}

/**
 * Dispara el aviso nativo de instalacion al usuario si esta disponible.
 */
export async function promptPwaInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPrompt) {
    return 'unavailable';
  }

  try {
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    deferredPrompt = null;
    notifyInstallListeners(false);
    return choice.outcome;
  } catch (err) {
    console.error('Error al solicitar instalacion PWA:', err);
    return 'unavailable';
  }
}

