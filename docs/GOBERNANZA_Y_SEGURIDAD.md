# 🛡️ Gobernanza de Datos y Políticas de Seguridad

**Proyecto:** BibliaApp  
**Fecha de Creación:** 2026-10-27  
**Estado:** Activo y En Vigor  

Este documento establece las políticas obligatorias de seguridad, privacidad, gestión de datos y estándares de desarrollo para **BibliaApp**.

---

## 1. Principios de Seguridad

### 1.1. Principio de Mínimo Privilegio (Supabase & RLS)
* **Row Level Security (RLS) Obligatorio:** Ninguna tabla en Supabase puede existir sin RLS habilitado.
* **Aislamiento de Datos de Usuario:**
  * Las notas personales (`verse_notes`) y los me gusta (`verse_likes`) están estrictamente restringidos al `user_id` autenticado.
  * Nunca se utilizará la clave de servicio (`service_role`) en el frontend bajo ninguna circunstancia. El cliente web solo usará la clave pública anónima (`anon key`).
* **Autenticación Gradual:**
  * La lectura de la Biblia es 100% pública y no requiere autenticación.
  * La primera interacción de valor (dar like, guardar una nota) iniciará una sesión anónima en Supabase (`signInAnonymously`) para que el usuario no pierda su progreso sin fricción de registro.
  * El usuario podrá vincular posteriormente su cuenta a Email/Google para persistencia multidispositivo.

### 1.2. Gestión de Secretos y Variables de Entorno
* Ninguna clave de API, URL de backend o secreto se almacena en el control de versiones (Git).
* Se utilizará un archivo `.env.example` versionado como plantilla y `.env` en `.gitignore`.
* En frontend solo se exponen variables con prefijo `VITE_`.

---

## 2. Gobernanza de Datos y Contenido Bíblico

### 2.1. Propiedad Intelectual y Licencias Bíblicas
* **Fase Inicial (Dominio Público / Licencias Abiertas):**
  * Solo se integrarán traducciones libres de derechos de autor comercial, tales como:
    * **Reina-Valera 1909 (RVR09)**: Dominio público.
    * **Biblia Libre para el Mundo (BL95 / Dominio Público)**.
    * **World English Bible (WEB)** (para textos o cotejos en inglés).
* **Arquitectura Multi-Traducción:**
  * La base de datos y el cliente deben admitir un selector de versiones (`version_id`), desacoplando el texto del motor de lectura.
  * Si en el futuro se incorporan traducciones bajo licencia comercial (RVR1960, NVI), se auditarán previamente los términos del titular (Sociedades Bíblicas Unidas, Biblica, etc.).

### 2.2. Privacidad y Gestión de Notas Personales
* Las reflexiones y notas del usuario son privadas por defecto.
* No se envían datos de telemetría con contenido de las notas de los usuarios a servicios de análisis de terceros.
* Los datos personales y notas deben poder exportarse o eliminarse a solicitud del usuario (cumplimiento GDPR / privacidad).

---

## 3. Directrices de Arquitectura y Desarrollo

### 3.1. Atomic Design Pragmático (Sin Sobreingeniería)
* **Regla Anti-Dogmatismo:** No se crean componentes o envoltorios adicionales únicamente para "llenar" la jerarquía de Atomic Design.
* **Criterio de Reutilización:**
  * Si un elemento HTML nativo con clases Tailwind cumple la función sin lógica repetida, se utiliza directamente.
  * Se promueve un átomo a molécula u organismo solo cuando encapsula estado, comportamiento reutilizable o composición visual compartida.

### 3.2. Rendimiento y Soporte PWA Offline
* Toda la interfaz debe ser resiliente a fallos de red: si el usuario pierde conexión, los versículos leídos o cacheados localmente en IndexedDB / Service Worker deben seguir estando disponibles inmediatamente.
* Mantener cero fugas de memoria en el scroll continuo: virtualización para no mantener los 31,102 versículos de la Biblia simultáneamente en el DOM.
