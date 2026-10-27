<#
.SYNOPSIS
    Sincroniza y audita las skills de IA instaladas en BibliaApp.

.DESCRIPTION
    Revisa las versiones de las skills contra sus repositorios upstream (skills.sh, GitHub),
    actualiza skills-lock.json y muestra el estado de cambios para que puedan ser auditados en Git.

.EXAMPLE
    .\scripts\sync-skills.ps1
    .\scripts\sync-skills.ps1 -Update
#>

param(
    [switch]$Update
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " BibliaApp - Auditoria de Skills de IA" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

Write-Host "`n[1/4] Listando skills instaladas..." -ForegroundColor Yellow
npx.cmd --yes skills list

if ($Update) {
    Write-Host "`n[2/4] Buscando actualizaciones en repositorios upstream..." -ForegroundColor Yellow
    npx.cmd --yes skills update -y
    Write-Host "`n[3/4] Verificando paquete de Graphify en Python..." -ForegroundColor Yellow
    python -m pip install --upgrade graphifyy
} else {
    Write-Host "`n[2/4] Para actualizar las skills a la ultima version ejecuta:" -ForegroundColor Gray
    Write-Host "      .\scripts\sync-skills.ps1 -Update" -ForegroundColor White
}

Write-Host "`n[4/4] Verificando estado en Git..." -ForegroundColor Yellow
git status --short .agents/ skills-lock.json

Write-Host "`nRevision finalizada." -ForegroundColor Green
