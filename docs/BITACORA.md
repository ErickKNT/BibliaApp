# 📓 Bitácora de Avance del Proyecto - BibliaApp

Registro cronológico de sesiones, hitos alcanzados, decisiones arquitectónicas y tareas pendientes.

---

## 📌 Resumen de Estado del Proyecto
* **Fase Actual:** Hito 1 — Configuración Inicial, Gobernanza y Scaffolding Base.
* **Repositorio Remoto:** `https://github.com/ErickKNT/BibliaApp.git` (`main`)
* **Stack Principal:** React + TypeScript + Vite + Tailwind CSS + PWA + Supabase.

---

## 📅 Registro de Sesiones

### Sesión 1 — 27 de Octubre de 2026

#### 🎯 Objetivos de la Sesión
1. Instalar y auditar el catálogo de 33 skills de IA (`find-skills`, `ponytail`, `addyosmani/agent-skills`, `graphify`).
2. Vincular el repositorio a GitHub (`ErickKNT/BibliaApp`).
3. Definir formalmente el stack tecnológico y la arquitectura de scroll tipo TikTok.
4. Establecer las políticas de gobernanza de datos, seguridad y Atomic Design pragmático.
5. Iniciar la estructura base del proyecto de forma incremental.

#### 🛠️ Actividades Realizadas
* **Skills y Gobernanza del Agente**:
  * Instalación completa de `find-skills`, 6 skills de `ponytail`, 25 skills de `addyosmani/agent-skills` y `graphify` (con soporte AST Python `graphifyy`).
  * Generación de `skills-lock.json` y script de sincronización `scripts/sync-skills.ps1`.
* **Vinculación Remota**:
  * Inicialización de Git y push del commit inicial a la rama `main` en GitHub.
* **Definición de Arquitectura**:
  * Adopción de Atomic Design pragmático (reutilización sin componentes fantasma).
  * Soporte inicial para traducciones libres de derechos con arquitectura multi-versión.
  * Creación de `docs/GOBERNANZA_Y_SEGURIDAD.md` con lineamientos de RLS, privacidad de notas y gestión de secretos.

* **Scaffolding y Frontend Base (Hito 1 y 2)**:
  * Configuración limpia de Vite 6 + React 19 + TypeScript + Tailwind CSS v4.
  * Implementación de Atomic Design pragmático:
    * **Átomos:** `IconButton` (con retroalimentación táctil y soporte para badges/labels), `Badge` (indicador de versión bíblica y referencia).
    * **Moléculas:** `VerseActionBar` (columna flotante de acciones estilo TikTok: me gusta, notas, compartir).
    * **Organismos:** `VerseCard` (pantalla completa snap-scroll con soporte para doble toque, tipografía editorial Newsreader y acentos en alto contraste), `NotesModal` (drawer modal para lectura y creación de notas).
    * **Plantillas:** `FeedLayout` (contenedor con bloqueo de scroll snap vertical nativo `100dvh`).
    * **Páginas:** `FeedPage` (alimentada inicialmente con versículos de dominio público RVR09: Juan 1 y Salmo 23).
  * Build validado exitosamente con `tsc -b && vite build`.

#### 📋 Decisiones Tomadas (ADRs Rápidos)
* **ADR-001 (Atomic Design Pragmático):** No crear átomos wrapper innecesarios. Usar Tailwind y HTML nativo cuando sea suficiente; crear componentes solo cuando haya lógica, accesibilidad o composición reutilizable.
* **ADR-002 (Seguridad Supabase):** RLS habilitado en el 100% de las tablas; autenticación anónima progresiva para permitir uso inmediato sin registro forzado.
* **ADR-003 (Rendimiento del Feed):** Uso de CSS Snap Scroll (`snap-y mandatory`) apoyado por virtualización ligera para evitar saturar el DOM con los 31,102 versículos de la Biblia.
* **ADR-004 (Estilo Monocromático Editorial):** Uso de negro puro `#000000` y blanco puro `#ffffff` con tipografía Newsreader Serif para los versículos e Inter Sans para los elementos de navegación y metadatos.

---

## 🗺️ Hoja de Ruta de Hitos

- [x] **Hito 0:** Preparación de herramientas, repositorio y skills del agente.
- [x] **Hito 1:** Scaffolding inicial (Vite + React + TypeScript + Tailwind CSS + Configuración de fuentes y diseño monocromático).
- [x] **Hito 2:** Estructura de carpetas Atomic Design y componentes base (IconButton, Badge, VerseActionBar, VerseCard, NotesModal).
- [x] **Hito 3:** Prototipo del Feed Snap Scroll a pantalla completa con datos de prueba (RVR09) y soporte de interacción táctil.
- [ ] **Hito 4:** Configuración de Supabase (tablas `verses`, `verse_likes`, `verse_notes`, RLS, migración de textos libres).
- [ ] **Hito 5:** Conexión del cliente Supabase a la UI (persistencia real de notas y likes con sesión anónima).
- [ ] **Hito 6:** Configuración de PWA (Service Worker, manifiesto, lectura offline).
