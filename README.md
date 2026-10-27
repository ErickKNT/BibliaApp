# BibliaApp

Aplicación bíblica moderna desarrollada con soporte y supervisión de agentes de IA avanzados.

## Repositorio Oficial
* GitHub: [https://github.com/ErickKNT/BibliaApp](https://github.com/ErickKNT/BibliaApp)

---

## Skills de IA Instaladas y Supervisión Continua

El proyecto cuenta con un sistema de habilidades operativas para agentes de IA ubicado en `.agents/skills/`, sincronizado y versionado mediante `skills-lock.json`.

### 1. Ecosistema de Skills Instalado

| Skill / Suite | Fuente | Rol Principal |
| :--- | :--- | :--- |
| **`find-skills`** | [vercel-labs/skills](https://www.skills.sh/vercel-labs/skills/find-skills) | Descubrimiento e instalación dinámica de nuevas herramientas y flujos para el agente. |
| **`ponytail`** (Suite) | [dietrichgebert/ponytail](https://github.com/dietrichgebert/ponytail) | Modo desarrollador senior minimalista (YAGNI, evitar sobreingeniería, análisis de deuda y riesgos). Incluye `ponytail`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help` y `ponytail-review`. |
| **`agent-skills`** (Suite) | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 25 flujos de ingeniería de software estructurada (TDD, especificaciones de arquitectura, diseño de APIs, depuración paso a paso y revisión exhaustiva de código). |
| **`graphify`** | [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Mapeo determinista AST de la base de código y documentación a un grafo de conocimiento local sin dependencias vectoriales. |

---

## Cómo Revisar y Actualizar las Skills Constantemente

### 1. Auditoría y Listado Rápido
Para ver en cualquier momento qué skills están instaladas y su estado:
```powershell
npx skills list
```
o ejecutando el script del proyecto:
```powershell
.\scripts\sync-skills.ps1
```

### 2. Actualización a Versiones Upstream
Para descargar las últimas versiones de los repositorios y actualizar `skills-lock.json`:
```powershell
.\scripts\sync-skills.ps1 -Update
```
o directamente vía CLI:
```powershell
npx skills update -y
```

### 3. Auditoría de Cambios en Git
Todas las skills y sus hashes están versionados en Git. Cualquier modificación o actualización upstream puede revisarse antes de comitear:
```powershell
git diff .agents/
git status
```
