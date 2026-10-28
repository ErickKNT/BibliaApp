# Bitacora de Avance del Proyecto - BibliaApp

Registro cronologico de sesiones, hitos alcanzados, decisiones arquitectonicas y tareas pendientes.

---

## Resumen de Estado del Proyecto
* **Fase Actual:** Hito 1 y 2 completados — Scaffolding base, Gobernanza y Prototipo Feed Snap Scroll.
* **Repositorio Remoto:** https://github.com/ErickKNT/BibliaApp.git (rama main)
* **Stack Principal:** React + TypeScript + Vite + Tailwind CSS + PWA + Supabase.

---

## Registro de Sesiones

### Sesion 1 — 27 de Octubre de 2026

#### Objetivos de la Sesion
1. Instalar y auditar el catalogo de 33 skills de IA (find-skills, ponytail, addyosmani/agent-skills, graphify).
2. Vincular el repositorio a GitHub (ErickKNT/BibliaApp).
3. Definir formalmente el stack tecnologico y la arquitectura de scroll tipo TikTok.
4. Establecer las politicas de gobernanza de datos, seguridad y Atomic Design pragmatico.
5. Iniciar la estructura base del proyecto de forma incremental.

#### Actividades Realizadas
* **Skills y Gobernanza del Agente**:
  * Instalacion completa de find-skills, 6 skills de ponytail, 25 skills de addyosmani/agent-skills y graphify (con soporte AST Python graphifyy).
  * Generacion de skills-lock.json y script de sincronizacion scripts/sync-skills.ps1.
* **Vinculacion Remota**:
  * Inicializacion de Git y push del commit inicial a la rama main en GitHub.
* **Definicion de Arquitectura**:
  * Adopcion de Atomic Design pragmatico (reutilizacion sin componentes fantasma).
  * Soporte inicial para traducciones libres de derechos con arquitectura multi-version.
  * Creacion de docs/GOBERNANZA_Y_SEGURIDAD.md con lineamientos de RLS, privacidad de notas y gestion de secretos.
* **Scaffolding y Frontend Base (Hito 1 y 2)**:
  * Configuracion limpia de Vite 6 + React 19 + TypeScript + Tailwind CSS v4.
  * Implementacion de Atomic Design pragmatico:
    * **Atomos:** IconButton (con retroalimentacion tactil y soporte para badges/labels), Badge (indicador de version biblica y referencia).
    * **Moleculas:** VerseActionBar (columna flotante de acciones estilo TikTok: me gusta, notas, compartir).
    * **Organismos:** VerseCard (pantalla completa snap-scroll con soporte para doble toque, tipografia editorial Newsreader y acentos en alto contraste), NotesModal (drawer modal para lectura y creacion de notas).
    * **Plantillas:** FeedLayout (contenedor con bloqueo de scroll snap vertical nativo 100dvh).
    * **Paginas:** FeedPage (alimentada inicialmente con versiculos de dominio publico RVR09: Juan 1 y Salmo 23).
  * Build validado exitosamente con tsc -b && vite build.
* **Incorporacion de Nuevas Reglas Generales**:
  * Sincronizacion obligatoria de todo cambio con GitHub (git push).
  * Actualizacion del grafo de conocimiento (Graphify) tras cambios estructurales.
  * Politica estricta de cero emojis en toda la documentacion y en textos de la aplicacion.

* **Fusion de Diseno Google Stitch (Hito 4)**:
  * Integracion del riel de acciones refinado (Me gusta con conteo, Notas, Guardar con marcador y Compartir tarjeta). Se omitio intencionalmente la funcion de voz/audio segun especificacion directa.
  * Inyeccion de contexto historico y teologico en tarjetas de versiculos (insignia de contexto, capsula de capitulo superior y chip de conmutacion rapida de version).
  * Redisenado de `NotesModal` como bottom drawer con efecto de velo desenfocado, barra de agarre superior, clasificacion de notas (Privada/Compartir) y filtros (Todas, Mis Notas, Comunidad).
  * Creacion de `TopBar` con acceso al explorador de libros, selector de version biblica y perfil.
  * Creacion de `BookExplorerModal` con segmentacion Antiguo/Nuevo Testamento, conteo de capitulos y buscador en tiempo real.
  * Creacion de `ProfileModal` con rastreador de racha de lectura, estado de sincronizacion PWA offline, coleccion de versiculos guardados y ajustes de tamano de tipografia.
  * Compilacion validada sin errores en TypeScript y Vite.

* **Persistencia Real y Modelo de Datos en Supabase (Hito 5 y 6)**:
  * Creacion del esquema SQL de base de datos en `supabase/migrations/20261027000000_create_bible_tables.sql` con tablas `verses`, `verse_likes` y `verse_notes`.
  * Implementacion de politicas de seguridad RLS: lectura publica para versiculos, control exclusivo por `user_id` para likes y control de privacidad (privada/comunidad) para notas.
  * Inyeccion de datos de siembra iniciales en `supabase/seed.sql` con versiculos de Filipenses 4, Juan 1, Salmos 23 y Genesis 1 (Reina-Valera 1909 - Dominio Publico) con metadatos de contexto historico y teologico.
  * Creacion de `.env.example` y cliente en `src/lib/supabase.ts` con soporte de sesion anonima progresiva y fallback de desarrollo offline sin bloqueos.
  * Implementacion del servicio de datos `src/services/bibleService.ts` conectando la interfaz de React con Supabase y respaldo en LocalStorage.
  * Ingestion masiva automatizada (ETL) mediante `scripts/seed-bible.mjs`: se descargaron y sembraron con exito los 66 libros completos (31,104 versiculos) en 78 lotes de 400 registros, indexados y ordenados secuencialmente por `global_order` (1 a 31104) desde Genesis 1:1 hasta Apocalipsis 22:21.
  * Compilacion validada sin errores en TypeScript y Vite.

* **Navegacion Integral del Canon Biblico y Activacion de Botones/Pestanas (Hito 6.5)**:
  * Definicion canica completa de los 66 libros en `src/data/bibleBooks.ts` con nombres alineados a la base de datos Supabase, abreviaturas, conteo de capitulos (1,189 en total), clasificacion por testamento y categorias.
  * Habilitacion completa de `BookExplorerModal`:
    * Conmutador interactivo de testamentos: Antiguo Testamento (39 libros) y Nuevo Testamento (27 libros) con conteo dinamico.
    * Buscador en tiempo real con normalizacion de diacriticos (permite buscar "genesis", "exodo", "salmos", "mateo", etc. sin importar acentos o mayusculas).
    * Filtro opcional por categorias tematicas (Pentateuco, Historicos, Poeticos, Profetas, Evangelios, Epistolas, Profecia).
    * Flujo de dos vistas: transicion fluida de seleccion de libro a cuadricula de seleccion de capitulo (1 a N).
    * Acceso rapido a "Iniciar en Cap. 1" y resguardo/reanudacion de ultima lectura leida.
  * Extension del servicio de datos `src/services/bibleService.ts`:
    * Implementacion de `getVersesByBookAndChapter` para saltar a cualquier punto de la Biblia cargando desde el indice `global_order`.
    * Implementacion de `getMoreVerses` para scroll infinito continuo a medida que el lector desciende en el feed vertical.
    * Persistencia de ultima lectura (`saveLastReading` y `getLastReading`).
  * Sincronizacion de `TopBar`:
    * Muestra en tiempo real el libro y capitulo activo (`activeBookName` y `activeChapter`).
    * Al pulsar la capsula superior se abre directamente el explorador de libros.
  * Enriquecimiento interactivo de `ProfileModal`:
    * Navegacion directa: pulsar cualquier versiculo guardado traslada el feed al versiculo exacto.
    * Eliminacion interactiva de versiculos guardados con actualizacion en almacenamiento local.
    * Selector de tamano de tipografia ('normal', 'grande', 'extra') reactivo que escala el texto de `VerseCard`.
    * Selector de traducciones activo.
  * Compilacion validada sin errores en TypeScript y Vite.

* **Correccion de Desbordamiento en Modales y Alineacion de Cuadriculas (Hito 6.6)**:
  * Diagnostico de desbordamiento: en pantallas de laptops y resoluciones con escalado de pantalla (DPI scaling), la altura fija previa de `750px` en `BookExplorerModal` y `ProfileModal` excedia la altura util del viewport (`100dvh`), provocando que los pies de pagina quedaran recortados por el borde inferior de la pantalla o la barra de tareas de Windows.
  * Ajuste de contencion en `BookExplorerModal`, `ProfileModal` y `NotesModal`:
    * Reemplazo de la altura fija por una cota dinamica: `h-[92dvh] sm:h-[620px]` con restriccion estricta `max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2.5rem)]`.
    * Inyeccion de `min-h-0` en el contenedor raiz flexbox y en las areas deslizables para habilitar la contraccion automatica de scroll.
    * Inyeccion de `shrink-0` en todas las barras de cabecera, subcabecera, buscador, filtros y barras inferiores de pie de pagina, garantizando que nunca se compriman ni salgan de la pantalla.
    * Adicion de `content-start` en la cuadricula de capitulos de `BookExplorerModal`: resuelve el espaciado vertical excesivo entre filas de capitulos al empaquetarlas ordenadamente desde arriba con un espaciado uniforme.
  * Compilacion validada sin errores en TypeScript y Vite.

* **Eliminacion de Redundancias Visuales y Soporte Dual de Modo Claro y Oscuro (Hito 6.7)**:
  * Limpieza editorial de `VerseCard`: se elimino la barra superior interna de la tarjeta de versiculos (pildora de capitulo y selector de traduccion) que colisionaba y duplicaba la informacion ya provista fijamente por la `TopBar`. El texto biblico queda centrado con mayor holgura tipografica, manteniendo la referencia del versiculo y contexto en el pie del bloque textual.
  * Implementacion de soporte nativo para Modo Claro y Modo Oscuro:
    * Configuracion en `src/index.css` con `@custom-variant dark (&:where(.dark, .dark *))` para conmutacion por clase CSS en la raiz del documento.
    * Paleta de Modo Claro: tono papel marfil calido (`#f8f7f4`) para lectura diurna de alto confort, tinta profunda (`#18181b`) y acentos de contraste suave.
    * Paleta de Modo Oscuro: obsidian profundo (`#131315`), blanco puro editorial y tarjetas en gris carbon (`#201f22`).
    * Adaptacion completa de todos los componentes: `TopBar`, `VerseCard`, `VerseActionBar`, `IconButton`, `BookExplorerModal`, `ProfileModal` y `NotesModal`.
    * Conmutador rapido Sol/Luna en `TopBar` para alternancia instantanea de un toque.
    * Selector formal en `ProfileModal` con opciones de Oscuro, Claro y Deteccion automatica del Sistema (`window.matchMedia`).
  * Compilacion validada sin errores en TypeScript y Vite.

* **Preparacion de Despliegue en Vercel y Enrutamiento SPA (Hito 6.8)**:
  * Creacion del archivo de configuracion `vercel.json` en la raiz del proyecto con declaracion del framework Vite, comando de compilacion `npm run build`, directorio de salida `dist` y reglas de reescritura (`rewrites`) para redireccion universal a `index.html`. Esto garantiza que la navegacion y recargas directas en navegadores moviles no arrojen errores 404.
  * Definicion de las variables de entorno de produccion requeridas (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`).
  * Compilacion validada sin errores en TypeScript y Vite.

* **Desarrollo en Rama Dedicada: Perfil de Usuario, Pantalla de Bienvenida y Motor de Racha (Hito 6.9 - Rama feature/perfil-bienvenida-racha)**:
  * Creacion y aislamiento de la rama de trabajo `feature/perfil-bienvenida-racha` para el control de versiones formal en GitHub.
  * Implementacion del motor de habitos y racha en `src/services/streakService.ts`:
    * Algoritmo de calculo de dias continuos con fechas locales (`YYYY-MM-DD`).
    * Deteccion automatica de racha activa hoy, continuidad desde ayer o reinicio tras interrupcion.
    * Generador de calendario semanal continuo de 7 dias (`L`, `M`, `M`, `J`, `V`, `S`, `D`) con marcado de dias completados y dia actual.
    * Gestion de perfil de usuario (`UserProfileData`) con persistencia local y sincronizacion de sesion.
    * Conteo acumulativo de versiculos leidos con incremento automatico durante el scroll en `FeedPage`.
  * Creacion de `WelcomeModal.tsx`:
    * Saludo horario contextual en tiempo real ("Buenos dias", "Buenas tardes", "Buenas noches") personalizado con el nombre del lector.
    * Tarjeta de racha con indicador de fuego e insignia de estado ("Activa hoy" o "Pendiente hoy").
    * Visualizador semanal de 7 dias con comprobacion de avance.
    * Versiculo diario inspiracional (Salmos 119:105) y atajo directo a la ultima lectura.
    * Control de descarte diario (`biblia_welcome_dismissed_date`) para no interrumpir repetidamente en la misma jornada.
  * Rediseño completo de `ProfileModal.tsx`:
    * Cabecera con avatar inicial dinamico, edicion rapida de nombre de usuario e insignia de sesion Supabase.
    * Tarjetas de metricas: Racha actual y record, versiculos leidos y tamano de coleccion.
    * Cuatro pestanas funcionales: "Racha & Habitos" (con calendario semanal e insignias de constancia desbloqueables), "Guardados" (coleccion con salto al versiculo y borrado), "Reflexiones" (historial de meditaciones personales y comunitarias) y "Ajustes" (tema, tamano de tipografia y version biblica).
  * Compilacion validada sin errores en TypeScript y Vite.

* **Autenticacion Progresiva y Respaldo en la Nube con Supabase (Hito 6.10 - Rama feature/auth-perfil-supabase)**:
  * Creacion y aislamiento de la rama de trabajo `feature/auth-perfil-supabase` en GitHub.
  * Definicion del esquema de datos en `supabase/migrations/20261027010000_create_profiles_and_streaks.sql`:
    * Tabla `user_profiles` con relacion a `auth.users(id)`, nombre mostrado, color de avatar, meta diaria, tema y preferencias tipograficas, con politicas RLS individuales y funcion de actualizacion `handle_updated_at`.
    * Tabla `user_streaks` con relacion a `auth.users(id)`, racha actual, racha record, fecha de ultima lectura, total de versiculos leidos e historial de fechas (`history_dates`), protegida con RLS.
    * Trigger de aprovisionamiento automatico `tr_on_auth_user_created` que inicializa el perfil y la racha al registrar un usuario en `auth.users`.
  * Implementacion del servicio de autenticacion en `src/services/authService.ts`:
    * Metodos de registro (`signUpWithEmail`), inicio de sesion (`signInWithEmail`), cierre de sesion (`signOutUser`), recuperacion de contraseña (`sendPasswordReset`) y escucha reactiva (`onAuthStateChange`).
    * Motor de migracion progresiva (`syncLocalDataToSupabase`): traslada de manera transparente la racha acumulada, versiculos leidos y configuraciones locales hacia Supabase al crear cuenta o iniciar sesion, evitando que el usuario pierda su progreso previo como invitado.
    * Descarga y sincronizacion (`fetchUserDataFromSupabase`) al reanudar sesion en cualquier dispositivo.
  * Creacion del componente de autenticacion no intrusivo `AuthModal.tsx`:
    * Tres vistas integradas: Registro, Inicio de Sesion y Recuperacion de Contraseña con transiciones fluidas.
    * Diseno sobrio adaptado a tema Claro y Oscuro, mensajes contextuales de error y exito, spinner de carga e indicador de valor sutil ("Respalda tu racha, tus notas y versiculos en todos tus dispositivos").
  * Integracion en la interfaz de usuario:
    * `ProfileModal.tsx`: incorporacion de banner sutil de respaldo para usuarios invitados, visualizacion del correo electronico del usuario autenticado, estado de cuenta sincronizada y boton de cierre de sesion.
    * `WelcomeModal.tsx`: enlace no intrusivo para respaldar el avance en la nube sin entorpecer el acceso directo al texto biblico.
    * `FeedPage.tsx`: conexion completa de estados de autenticacion, oyente en tiempo real de sesion y sincronizacion bidireccional.
  * Compilacion validada sin errores en TypeScript y Vite.

* **Mejoras de Seguridad en Formulario de Autenticacion y Diagnostico de Proveedor (Hito 6.11 - Rama feature/auth-password-verification)**:
  * Creacion de la rama de trabajo `feature/auth-password-verification`.
  * Incorporacion de alternancia de visibilidad de contrasena (iconos Eye y EyeOff de Lucide) en los campos de credenciales.
  * Adicion del campo de verificacion/confirmacion obligatoria de contrasena en la vista de registro, con validacion en cliente de coincidencia y longitud minima antes del envio.
  * Implementacion de la funcion traductora y explicativa `formatAuthError` en `src/services/authService.ts` para transformar mensajes en ingles de Supabase a orientaciones claras en espanol (incluyendo la solucion para "Email signups are disabled").
  * Compilacion validada sin errores en TypeScript y Vite.

* **Pantalla de Verificacion de Correo y Redireccion de Produccion (Hito 6.12 - Rama feature/email-verification-screen)**:
  * Creacion de la rama de trabajo `feature/email-verification-screen`.
  * Creacion de la vista dedicada `verify_email` en `AuthModal.tsx`:
    * Ilustracion e insignia con icono `MailCheck`.
    * Despliegue del correo electronico destinatario en caja monoespaciada de alta visibilidad.
    * Instrucciones paso a paso para abrir el correo y pulsar el enlace de activacion.
    * Boton de reenvio con temporizador de enfriamiento (`resendCooldown` de 60 segundos) para evitar bloqueos por tasa de envio.
    * Botones de accion para iniciar sesion directamente o continuar leyendo de inmediato como invitado sin interrupcion.
  * Inyeccion de `emailRedirectTo: window.location.origin` en `signUpWithEmail` y `resendConfirmationEmail` para asegurar que el enlace del correo apunte al dominio en produccion donde el usuario esta navegando.
  * Limpieza automatica del fragmento hash de tokens (`#access_token=...`) en la barra de direcciones de `FeedPage.tsx` al retornar de la confirmacion de correo.
  * Compilacion validada sin errores en TypeScript y Vite.

* **Acciones Duales de Autenticacion en Perfil y Bienvenida (Hito 6.13 - Rama feature/auth-dual-action-buttons)**:
  * Creacion de la rama de trabajo `feature/auth-dual-action-buttons`.
  * Incorporacion del boton "Iniciar Sesion" junto a "Crear Cuenta" en el banner de invitacion de `ProfileModal.tsx`.
  * Actualizacion del pie de pagina de `WelcomeModal.tsx` para ofrecer tanto el acceso a usuarios existentes ("Inicia Sesion") como el registro de nuevos usuarios ("Crea una cuenta gratis").
  * Mantenimiento de la ubicacion de "Cerrar Sesion" en la seccion de Ajustes segun directiva del usuario.
  * Compilacion validada sin errores en TypeScript y Vite.

* **Refinamiento de Escala y Proporciones para Pantallas Moviles (Hito 6.14 - Rama feature/mobile-ui-scaling-refinement)**:
  * Creacion de la rama de trabajo `feature/mobile-ui-scaling-refinement`.
  * Reduccion y estilizacion del riel flotante de acciones:
    * Botones `IconButton` ajustados de 48px a 40px en movil (con icono de 18-20px y texto `text-[9px]`/`text-[10px]`), logrando una estetica no invasiva y de mayor confort visual.
    * Reduccion del espaciado vertical entre botones de `gap-4` a `gap-2.5 sm:gap-3.5`.
  * Compactacion de la barra superior `TopBar`:
    * Altura reducida de 64px a 52px en movil (`h-13 sm:h-15`).
    * Botones de tema, traduccion y perfil compactados a 32px (`h-8 w-8`) y capsula de exploracion de libros mas esbelta.
  * Ajuste proporcional de metadatos en `VerseCard`:
    * Conservacion de la tipografia amplia y editorial del versiculo biblico.
    * Reduccion de las insignias de capitulo, version y contexto historico (`text-[10px] sm:text-xs` y padding optimizado).
    * Ajuste sutil del indicador inferior de desplazamiento.
  * Compilacion validada sin errores en TypeScript y Vite.

* **Modo Lectura Inmersiva Total (Auto-Hide HUD) y Selector Modal de Versiones (Hito 6.15 - Rama feature/immersive-hud-version-selector)**:
  * Creacion de la rama de trabajo `feature/immersive-hud-version-selector`.
  * Implementacion del Modo Inmersivo Zen:
    * Temporizador de inactividad de 3.5 segundos que desvanece y oculta suavemente la barra superior `TopBar`, el riel flotante `VerseActionBar` y los indicadores secundarios con transiciones CSS fluidas (`duration-300`).
    * Despertar instantaneo del HUD ante desplazamiento (scroll) o toque de pantalla.
    * Convivencia limpia entre toque simple (conmutar mostrar/ocultar HUD) y doble toque (dar "Me gusta" con animacion de corazon).
    * Congelamiento inteligente del temporizador mientras cualquier modal este abierto.
  * Creacion de `VersionSelectorModal.tsx`:
    * Modal dedicado para seleccion de traducciones biblicas (`RVR1960`, `RVR09`, `BL95`, `WEB`) con tarjetas descriptivas, insignias y marcas de verificacion reactivas.
    * Reemplazo del ciclo secuencial de versiones en `TopBar` por la apertura de este selector interactivo.
  * Compilacion validada sin errores en TypeScript y Vite.

* **Boton de Inicio en TopBar y Reapertura Dinamica de Bienvenida (Hito 6.16 - Rama feature/welcome-modal-home-button)**:
  * Creacion de la rama de trabajo `feature/welcome-modal-home-button`.
  * Incorporacion del boton de inicio (`Home`) en la barra superior `TopBar`, ubicado junto a la capsula del explorador de libros con estilo compacto y armonico.
  * Ajuste de persistencia de bienvenida: se retiro el bloqueo estricto de 24 horas por fecha fija (`biblia_welcome_dismissed_date`) para que el modal se inicialice al abrir o recargar la aplicacion y permanezca accesible bajo demanda en cualquier momento mediante el boton de inicio.
  * Compilacion validada sin errores en TypeScript y Vite.

* **Limpieza de Pantalla en Scroll Descendente y Tipado Cross-Platform (Hito 6.17 - Rama feature/immersive-scroll-clean-ts-fix)**:
  * Creacion de la rama de trabajo `feature/immersive-scroll-clean-ts-fix`.
  * Correccion del error de compilacion TypeScript TS2503 (`No se encuentra el espacio de nombres 'NodeJS'`) en `src/components/organisms/VerseCard.tsx` y `src/pages/FeedPage.tsx` mediante el uso de `ReturnType<typeof setTimeout>`, garantizando compatibilidad nativa en entornos de ejecucion cliente y DOM.
  * Implementacion de lectura inmersiva continua con deteccion de direccion de desplazamiento vertical (`handleFeedScroll` con `lastScrollTopRef`):
    * Desplazamiento hacia abajo (lectura consecutiva de versiculos): la pantalla se mantiene 100% limpia ocultando de inmediato el HUD (`TopBar` y `VerseActionBar`) y cancelando temporizadores residuales.
    * Desplazamiento hacia arriba (retroceso o busqueda de herramientas): el HUD se activa automaticamente para facilitar la navegacion y se auto-oculta tras 3.5 segundos de inactividad.
    * Toque simple de pantalla: conmutacion manual del HUD para mayor flexibilidad del lector.
  * Compilacion validada sin errores en TypeScript y Vite.

* **Implementacion Completa de Modo PWA y Lectura Offline (Hito 7 - Rama feature/pwa-implementation)**:
  * Creacion de la rama de trabajo `feature/pwa-implementation`.
  * Manifiesto Web PWA (`public/manifest.webmanifest`):
    * Configuracion de `name`, `short_name`, `theme_color`, `background_color`, modo `standalone` y orientacion `portrait-primary`.
    * Generacion de iconos en alta resolucion: vector escalable SVG (`icon.svg`), iconos estandar PNG (192x192 y 512x512), iconos adaptativos maskable (192x192 y 512x512) y `apple-touch-icon.png` (180x180).
  * Service Worker Nativo de Alto Rendimiento (`public/sw.js`):
    * Precache inicial del cascaron de la aplicacion (App Shell: HTML, JS, CSS, iconos y fuentes).
    * Estrategia Network-First con respaldo en Cache para navegacion principal, permitiendo cargar la aplicacion en modo avion o sin internet.
    * Estrategia Stale-While-Revalidate para recursos estaticos y fuentes de Google Fonts.
    * Cache dedicado para peticiones REST de Supabase (`/rest/v1/verses*`), garantizando que versiculos y capitulos consultados esten disponibles de inmediato sin conexion.
  * Capa de Cache Local de Escrituras (`src/services/bibleService.ts`):
    * Persistencia de versiculos consultados en almacenamiento local (`biblia_cached_feed_*` y `biblia_cached_chap_*`).
    * Recuperacion transparente de capitulos locales ante desconexion o falta de datos en Supabase.
  * Servicio y Ciclo de Vida PWA (`src/services/pwaService.ts`):
    * Registro automatico de Service Worker y gestion de actualizaciones.
    * Captura del evento `beforeinstallprompt` y estado de instalacion (`isAppInstalled`).
    * Deteccion y notificacion de estado de red (online / offline).
  * Experiencia de Usuario PWA:
    * Seccion de instalacion PWA y estado de conexion en la pestaña de Ajustes de `ProfileModal.tsx`, con boton nativo de instalacion e instrucciones para iOS / Safari.
    * Indicador no intrusivo de conexion en `TopBar.tsx` y aviso flotante de modo sin conexion en `FeedPage.tsx`.
    * Actualizacion de encabezados HTTP en `vercel.json` (`Cache-Control: public, max-age=0, must-revalidate` para `sw.js`).

* **Ajuste de Safe Area Insets para iPhone e iOS (Hito 7.1 - Rama feature/ios-safe-area-topbar-fix)**:
  * Creacion de la rama de trabajo `feature/ios-safe-area-topbar-fix`.
  * Resolucion de colision entre la barra superior `TopBar` y los elementos del sistema de iOS (reloj, bateria, notch y Dynamic Island en iPhone 13/14/15/16):
    * Se agrego soporte nativo de utilidades `pt-safe`, `pb-safe`, `pl-safe` y `pr-safe` en `src/index.css` utilizando las variables de entorno `env(safe-area-inset-*)`.
    * En `TopBar.tsx`, el contenedor `<header>` adopta `padding-top: env(safe-area-inset-top, 0px)` sin altura fija, mientras que el contenedor interno de acciones mantiene su altura ergonomica de 52px. El fondo de vidrio esmerilado cubre toda la barra de estado superior, mientras que los botones de interaccion se desplazan hacia abajo fuera del alcance del reloj y la bateria.
    * En `VerseCard.tsx`, el padding superior e inferior se ajusta dinamicamente con `calc(env(safe-area-inset-top, 0px) + 3.75rem)` y `calc(env(safe-area-inset-bottom, 0px) + 1.25rem)` para evitar colisiones con el TopBar o la barra indicadora de inicio de iOS.
    * En `VerseActionBar.tsx`, la posicion inferior se protege con `bottom: calc(env(safe-area-inset-bottom, 0px) + 4.5rem)`.
    * En todos los modales (`ProfileModal`, `BookExplorerModal`, `WelcomeModal`, `VersionSelectorModal`, `AuthModal`, `NotesModal`), se protegen las cabeceras y botones de cierre con cotas de safe area.
  * Compilacion validada sin errores en TypeScript y Vite.

* **Refinamiento de Holgura y Despeje Ergonómico en iOS TopBar (Hito 7.2 - Rama feature/topbar-ios-clearance-refinement)**:
  * Creacion de la rama de trabajo `feature/topbar-ios-clearance-refinement`.
  * Correccion del solapamiento visual residual y holgura tactil en iPhone:
    * Se agrego un margen superior de 16px adicional sobre el Safe Area Inset (`paddingTop: calc(env(safe-area-inset-top, 0px) + 16px)`) y 8px de margen inferior en `<header>`, garantizando una separacion de mas de 35px respecto al reloj y porcentaje de bateria de iOS.
    * Altura de la barra de acciones ajustada a `h-10 sm:h-12` (40px/48px) para mantener los botones (Home, Explorador, Tema, Traduccion y Perfil) con excelente ergonomia y libre acceso tactil.
    * Se actualizo el espaciado superior en `VerseCard.tsx` (`paddingTop: calc(env(safe-area-inset-top, 0px) + 5.25rem)`) para mantener una distancia visual equilibrada del versiculo respecto a la barra superior.
    * Actualizacion de version de cache en `sw.js` a `v2` para forzar la actualizacion inmediata en dispositivos con la PWA instalada.
  * Compilacion validada sin errores en TypeScript y Vite.

#### Decisiones Tomadas (ADRs Rapidos)
* **ADR-001 (Atomic Design Pragmatico):** No crear atomos wrapper innecesarios. Usar Tailwind y HTML nativo cuando sea suficiente; crear componentes solo cuando haya logica, accesibilidad o composicion reutilizable.
* **ADR-002 (Seguridad Supabase):** RLS habilitado en el 100% de las tablas; autenticacion anonima progresiva para permitir uso inmediato sin registro forzado.
* **ADR-003 (Rendimiento del Feed):** Uso de CSS Snap Scroll (snap-y mandatory) apoyado por virtualizacion ligera para evitar saturar el DOM con los 31,102 versiculos de la Biblia.
* **ADR-004 (Estilo Monocromatico Editorial):** Uso de negro puro #000000 y blanco puro #ffffff con tipografia Newsreader Serif para los versiculos e Inter Sans para los elementos de navegacion y metadatos.
* **ADR-005 (Cero Emojis y Sobriedad):** Prohibicion de emojis en codigo, UI y documentacion para garantizar un diseno visual y tecnico formal.
* **ADR-006 (Exclusion de Modulo de Audio):** Exclusion deliberada del componente de narracion de voz para mantener la aplicacion ligera y centrada en lectura y meditacion textual.
* **ADR-007 (Barra de Acciones HUD Persistente):** Extraccion de la barra de acciones fuera de las tarjetas de versiculos para mantenerla fija en la pantalla durante el desplazamiento. Sincronizacion reactiva del versiculo activo mediante IntersectionObserver (umbral 0.6) para asegurar que unicamente el contenido textual se desplace verticalmente.
* **ADR-008 (Arquitectura Hibrida Supabase con Respaldo Offline Local):** El cliente de datos conmuta de forma transparente entre Supabase (si las credenciales estan activas) y almacenamiento local / datos de respaldo si no hay conexion o credenciales configuradas, evitando excepciones no controladas.
* **ADR-009 (Ingesta Masiva por Lotes con Upsert Resiliente):** La carga completa del canon biblico se ejecuto en lotes de 400 registros utilizando la clave service_role en el entorno de desarrollo y la clausula onConflict para prevenir duplicados y sobrecargas de red.
* **ADR-010 (Navegacion Canónica y Paginacion Continua por Orden Global):** La seleccion de libro y capitulo calcula el primer versiculo de la seccion y extrae un bloque consecutivo a partir de `global_order`. Esto permite que el desplazamiento snap vertical no se detenga al culminar un capitulo, sino que continue de forma fluida hacia el capitulo subsiguiente.
* **ADR-011 (Contencion Responsiva de Modales y Anclaje con Flex Shrink):** Se previene el desbordamiento vertical y el recorte de pies de pagina en pantallas con escalado DPI o menor resolucion vertical mediante cotas dinamicas `max-h-[calc(100dvh-2.5rem)]` y `min-h-0`. Se anclan todas las barras superior/inferior con `shrink-0` y se aplica `content-start` a las cuadriculas flex/grid para evitar distribuciones artificiales de espacio.
* **ADR-012 (Desacoplamiento de Contexto Superior en Tarjetas):** La barra superior anclada `TopBar` es la unica responsable de proyectar el libro, capitulo y traduccion activa. Se retiran los duplicados internos en `VerseCard` para maximizar el area de lectura y evitar colisiones visuales en el desplazamiento snap.
* **ADR-013 (Soporte de Temas Editorial Dual con Deteccion de Sistema):** Implementacion de dos temas de alta legibilidad (Claro en tono papel `#f8f7f4` y Oscuro en obsidiana `#131315`) persistidos en `localStorage` y conmutables mediante conmutador en cabecera o selector de sistema.
* **ADR-014 (Motor de Racha Diaria con Calendario Semanal y Deteccion de Continuidad):** El registro de racha computa fechas locales consecutivas y actualiza en tiempo real el progreso de 7 dias, recompensando la constancia diaria sin bloqueos de conexion y persistiendo de forma progresiva.
* **ADR-015 (Bienvenida Contextual Diaria no Intrusiva):** Despliegue de bienvenida una sola vez por jornada natural con versiculo inspiracional y estado de meta, facilitando la transicion directa al feed de lectura sin friccion.
* **ADR-016 (Perfil Progresivo y Sincronizacion de Racha en la Nube con Supabase Auth):** El acceso y lectura de toda la Biblia permanece 100% abierto sin forzar registro previo. Los datos de lectura y racha se generan de inmediato de forma local; cuando el lector decide registrarse o iniciar sesion, una migracion silenciosa y transparente traslada todo su historial acumulado hacia Supabase (tablas `user_profiles` y `user_streaks`), permitiendo persistencia multi-dispositivo sin friccion de entrada.
* **ADR-017 (Arquitectura PWA Hibrida y Resiliencia Offline sin Dependencias Pesadas):** Se opto por un Service Worker nativo puro junto a una doble capa de persistencia (CacheStorage para el App Shell y peticiones de red, y LocalStorage estructurado para versiculos y lecturas). Esta arquitectura garantiza arranque instantaneo offline y compatibilidad total con Lighthouse, Chrome, Edge y Safari iOS sin agregar dependencias pesadas de terceros.
* **ADR-018 (Adaptacion Dinamica a Safe Area Insets de iOS):** El soporte de `viewport-fit=cover` en iOS PWA exige que la barra de navegacion superior desacople su fondo de su contenido interactivo. El `<header>` extiende su fondo hasta el borde fisico superior de la pantalla mediante `paddingTop: env(safe-area-inset-top, 0px)`, garantizando una inmersion visual completa sin que los elementos de control se solapen con la barra de estado o impidan la interaccion tactil.
* **ADR-019 (Ingesta Canonica de Traducciones NVI y NTV con Atribucion Editorial):** Para ofrecer traducciones contemporaneas de alta difusion (Nueva Version Internacional - NVI y Nueva Traduccion Viviente - NTV), se desarrollo un proceso de siembra masivo por lotes que integra los 66 libros del canon biblico (31,087 versiculos de NVI y 31,064 versiculos de NTV) en la tabla `verses` de Supabase. A su vez, se dispuso la debida y visible atribucion de derechos de autor y licencias para Biblica, Inc. y Tyndale House Publishers tanto en las tarjetas del selector de traducciones como en un apartado dedicado de creditos legales.
* **ADR-020 (Eliminacion del Sombreado Forzado y Correccion de Capas en iOS PWA):** Se identifico que la directiva `apple-mobile-web-app-status-bar-style: black-translucent` genera por diseno de WebKit un degradado de sombra oscura sobreimpuesto en los primeros 60px de la pantalla, afectando tanto a la barra superior como a todos los modales abiertos en modo PWA. Se sustituyo por `default` asistido por sincronizacion dinamica de `meta theme-color` segun el tema activo (#131315 en oscuro y #f8f7f4 en claro). Adicionalmente, se desacoplo el velo de fondo (backdrop) en todos los modales de la aplicacion colocandolo como hermano de capa completa (`fixed inset-0`) fuera del contenedor con padding de safe-areas, garantizando una cobertura 100% uniforme sin bandas oscuras ni cortes visuales.
* **ADR-021 (Minimalismo en Modales, Pestañas Icon-Only y Banners Descartables):** Para evitar la saturacion de elementos y desbordamientos en pantallas verticales moviles (proporciones 16:9 y 19.5:9), se adopto una interfaz minimalista de solo iconos para las pestanas de navegacion en modales (`grid grid-cols-4` simetrico con microbadges numericos condicionales), se doto al banner de invitacion de respaldo en la nube de un boton de descarte ("X") que libera espacio vertical inmediato y se restablece de forma efimera al reabrir el modal, y se optimizaron las proporciones visuales de tarjetas y filtros en WelcomeModal, BookExplorerModal y NotesModal.

---

## Hoja de Ruta de Hitos

- [x] **Hito 0:** Preparacion de herramientas, repositorio y skills del agente.
- [x] **Hito 1:** Scaffolding inicial (Vite + React + TypeScript + Tailwind CSS + Configuracion de fuentes y diseno monocromatico).
- [x] **Hito 2:** Estructura de carpetas Atomic Design y componentes base (IconButton, Badge, VerseActionBar, VerseCard, NotesModal).
- [x] **Hito 3:** Prototipo del Feed Snap Scroll a pantalla completa con datos de prueba (RVR09) y soporte de interaccion tactil.
- [x] **Hito 4:** Evaluacion y fusion de componentes visuales de Google Stitch (contexto historico, selector rapido de traduccion, explorador de libros, indicador PWA, omitiendo audio).
- [x] **Hito 5:** Configuracion de Supabase (tablas verses, verse_likes, verse_notes, RLS, migracion y siembra completa de los 66 libros).
- [x] **Hito 6:** Conexion del cliente Supabase a la UI (persistencia real de notas y likes con sesion anonima).
- [x] **Hito 7:** Configuracion de PWA (Service Worker, manifiesto, lectura offline).
- [x] **Hito 8:** Ingesta de traducciones contemporaneas (NVI y NTV) en Supabase con creditos editoriales visibles.
