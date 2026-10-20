@echo off
chcp 65001 > nul
echo ========================================================
echo        SUBIDA AUTOMATICA DE HAVAH A GITHUB
echo ========================================================
echo.

cd /d "C:\Users\thoma\Downloads\Havah-PC"
echo [Directorio actual]: %CD%
echo.

echo [1/3] Preparando mejoras de velocidad...
git add .

echo [2/3] Guardando commit...
git commit -m "Optimizar caché para carga instantánea"

echo [3/3] Subiendo a GitHub...
git push -u origin main

echo.
echo ========================================================
echo  ¡LISTO! Cambios de velocidad subidos a GitHub.
echo ========================================================
echo.
pause
