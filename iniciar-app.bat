@echo off
chcp 65001 > nul
echo ========================================================
echo          Iniciando Servidor de HAVAH App
echo ========================================================
echo.
call npm run dev
pause
