@echo off
chcp 65001 > nul
echo ========================================================
echo       Instalando dependencias y compilando HAVAH
echo ========================================================
echo.
echo Directorio: %CD%
echo.

echo [1/2] Ejecutando npm install...
call npm install
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Ocurrio un problema durante npm install.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Ejecutando npm run build...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Ocurrio un problema durante npm run build.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================================
echo  ¡Compilacion completada con exito!
echo ========================================================
pause
