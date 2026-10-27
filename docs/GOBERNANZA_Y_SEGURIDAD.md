# Gobernanza de Datos y Politicas de Seguridad

**Proyecto:** BibliaApp  
**Fecha de Creacion:** 2026-10-27  
**Estado:** Activo y En Vigor  

Este documento establece las politicas obligatorias de seguridad, privacidad, gestion de datos y estandares de desarrollo para BibliaApp.

---

## 1. Principios de Seguridad

### 1.1. Principio de Minimo Privilegio (Supabase y RLS)
* **Row Level Security (RLS) Obligatorio:** Ninguna tabla en Supabase puede existir sin RLS habilitado.
* **Aislamiento de Datos de Usuario:**
  * Las notas personales (`verse_notes`) y los me gusta (`verse_likes`) estan estrictamente restringidos al `user_id` autenticado.
  * Nunca se utilizara la clave de servicio (`service_role`) en el frontend bajo ninguna circunstancia. El cliente web solo usara la clave publica anonima (`anon key`).
* **Autenticacion Gradual:**
  * La lectura de la Biblia es publica y no requiere autenticacion.
  * La primera interaccion de valor (dar like, guardar una nota) iniciara una sesion anonima en Supabase (`signInAnonymously`) para que el usuario no pierda su progreso sin friccion de registro.
  * El usuario podra vincular posteriormente su cuenta a Email o Google para persistencia multidispositivo.

### 1.2. Gestion de Secretos y Variables de Entorno
* Ninguna clave de API, URL de backend o secreto se almacena en el control de versiones (Git).
* Se utilizara un archivo `.env.example` versionado como plantilla y `.env` en `.gitignore`.
* En frontend solo se exponen variables con prefijo `VITE_`.

---

## 2. Gobernanza de Datos y Contenido Biblico

### 2.1. Propiedad Intelectual y Licencias Biblicas
* **Fase Inicial (Dominio Publico y Licencias Abiertas):**
  * Solo se integraran traducciones libres de derechos de autor comercial, tales como:
    * **Reina-Valera 1909 (RVR09)**: Dominio publico.
    * **Biblia Libre para el Mundo (BL95 / Dominio Publico)**.
    * **World English Bible (WEB)** (para textos o cotejos en ingles).
* **Arquitectura Multi-Traduccion:**
  * La base de datos y el cliente deben admitir un selector de versiones (`version_id`), desacoplando el texto del motor de lectura.
  * Si en el futuro se incorporan traducciones bajo licencia comercial (RVR1960, NVI), se auditaran previamente los terminos del titular (Sociedades Biblicas Unidas, Biblica, etc.).

### 2.2. Privacidad y Gestion de Notas Personales
* Las reflexiones y notas del usuario son privadas por defecto.
* No se envian datos de telemetria con contenido de las notas de los usuarios a servicios de analisis de terceros.
* Los datos personales y notas deben poder exportarse o eliminarse a solicitud del usuario (cumplimiento GDPR y privacidad).

---

## 3. Directrices de Arquitectura y Desarrollo

### 3.1. Atomic Design Pragmatico (Sin Sobreingenieria)
* **Regla Anti-Dogmatismo:** No se crean componentes o envoltorios adicionales unicamente para llenar la jerarquia de Atomic Design.
* **Criterio de Reutilizacion:**
  * Si un elemento HTML nativo con clases Tailwind cumple la funcion sin logica repetida, se utiliza directamente.
  * Se promueve un atomo a molecula u organismo solo cuando encapsula estado, comportamiento reutilizable o composicion visual compartida.

### 3.2. Rendimiento y Soporte PWA Offline
* Toda la interfaz debe ser resiliente a fallos de red: si el usuario pierde conexion, los versiculos leidos o cacheados localmente en IndexedDB o Service Worker deben seguir estando disponibles inmediatamente.
* Mantener cero fugas de memoria en el scroll continuo: virtualizacion para no mantener los 31,102 versiculos de la Biblia simultaneamente en el DOM.

---

## 4. Reglas Operativas Generales Obligatorias

### 4.1. Sincronizacion Continua con GitHub
* Siempre que se realicen cambios funcionales, de documentacion o de codigo en el proyecto, se deben confirmar localmente y subir a la rama remota de GitHub (`git push origin main`).

### 4.2. Actualizacion del Grafo de Conocimiento (Graphify)
* Siempre que se realicen cambios estructurales en el codigo y la base de conocimiento (`graphify-out/`) ya este generada, se debe ejecutar la actualizacion correspondiente (`/graphify . --update`) para mantener la arquitectura sincronizada y auditable.

### 4.3. Politica Estricta de Cero Emojis
* Queda estrictamente prohibido el uso de emojis para alimentar la documentacion, bitacoras, comentarios tecnicos y en cualquier texto que se renderice en la interfaz de la aplicacion. Se debe mantener un tono sobrio, profesional y limpio.
