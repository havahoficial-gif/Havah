@echo off
chcp 65001 > nul
echo ========================================================
echo       Publicador Automático de HAVAH a GitHub
echo ========================================================
echo.

:: 1. Asegurar que existe C:\APP\Havah-PC
if not exist "C:\APP\Havah-PC" (
    echo [1/6] Creando carpeta C:\APP\Havah-PC...
    mkdir "C:\APP\Havah-PC"
)

:: 2. Si este script se ejecuta desde Downloads, sincronizar archivos hacia C:\APP\Havah-PC
if /i not "%CD%"=="C:\APP\Havah-PC" (
    echo [2/6] Copiando archivos limpios a C:\APP\Havah-PC...
    robocopy "%~dp0." "C:\APP\Havah-PC" /E /XD node_modules .tts-cache dist .git /XF *.log /NJH /NJS /NDL > nul
)

:: 3. Moverse a C:\APP\Havah-PC
cd /d "C:\APP\Havah-PC"
echo [3/6] Directorio de trabajo: %CD%

:: 4. Inicializar y agregar archivos
echo [4/6] Preparando Git...
git init
git add .
git commit -m "Publicación inicial HAVAH App"

:: 5. Configurar rama y remoto
echo [5/6] Conectando con GitHub...
git branch -M main
git remote remove origin >nul 2>&1
git remote add origin https://github.com/havahoficial-gif/Havah.git

:: 6. Subir
echo [6/6] Subiendo a https://github.com/havahoficial-gif/Havah.git...
git push -u origin main

echo.
echo ========================================================
echo  ¡Listo! Si viste mensajes de error, revisa la ventana.
echo ========================================================
echo.
pause
