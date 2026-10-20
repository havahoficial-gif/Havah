@echo off
chcp 65001 > nul
echo ========================================================
echo        SUBIDA AUTOMATICA DE HAVAH A GITHUB
echo ========================================================
echo.

:: 1. Limpiar .git accidental de la carpeta personal de Windows
if exist "C:\Users\thoma\.git" (
    echo [Limpieza] Eliminando .git accidental de tu carpeta personal...
    rmdir /s /q "C:\Users\thoma\.git" >nul 2>&1
)

:: 2. Configurar identidad de Git para evitar el error "Author identity unknown"
git config --global user.name "havahoficial-gif"
git config --global user.email "havahoficial@gmail.com"

:: 3. Cambiar OBLIGATORIAMENTE a la carpeta de la aplicacion
cd /d "C:\Users\thoma\Downloads\Havah-PC"
echo [Directorio actual]: %CD%
echo.

:: 4. Inicializar Git dentro de Havah-PC
echo [1/4] Inicializando Git en Havah-PC...
if not exist ".git" (
    git init
)
git branch -M main

:: 5. Conectar remoto
echo [2/4] Vinculando con GitHub...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/havahoficial-gif/Havah.git

:: 6. Agregar archivos del proyecto
echo [3/4] Agregando archivos de la aplicacion...
git add .

:: 7. Commit y push
echo [4/4] Subiendo a GitHub...
git commit -m "Publicacion inicial HAVAH App"
git push -u origin main

echo.
echo ========================================================
echo  ¡PROCESO FINALIZADO!
echo ========================================================
echo.
pause
