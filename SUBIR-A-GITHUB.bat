@echo off
chcp 65001 > nul
echo ========================================================
echo        SUBIDA AUTOMATICA DE HAVAH A GITHUB
echo ========================================================
echo.

cd /d "C:\Users\thoma\Downloads\Havah-PC"
echo [Directorio actual]: %CD%
echo.

echo [1/3] Preparando correccion de puerto...
git add .

echo [2/3] Guardando commit...
git commit -m "Corregir puerto duplicado EADDRINUSE"

echo [3/3] Subiendo a GitHub...
git push -u origin main

echo.
echo ========================================================
echo  ¡LISTO! Cambios subidos a GitHub.
echo ========================================================
echo.
pause
