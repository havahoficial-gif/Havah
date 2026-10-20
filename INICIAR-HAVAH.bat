@echo off
set "PATH=%SystemRoot%\System32;%SystemRoot%;%SystemRoot%\System32\Wbem;%ProgramFiles%\nodejs;%ProgramFiles(x86)%\nodejs;%AppData%\npm;%PATH%"
cd /d "%~dp0"
title HAVAH

node -v >nul 2>nul
if errorlevel 1 goto sinnode
echo Node detectado:
node -v

if exist "node_modules\.bin\tsx.cmd" if exist "node_modules\.bin\vite.cmd" goto yainstalado
if exist node_modules rmdir /s /q node_modules
echo Instalando HAVAH. Puede tardar varios minutos, no cierres esta ventana...
call npm install --no-audit --no-fund
if errorlevel 1 goto error
if not exist "node_modules\.bin\tsx.cmd" goto error

:yainstalado
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"
if exist .env goto arrancar
echo.
set /p KEY=Pega tu clave de Gemini y pulsa Enter (o solo Enter para omitir): 
if "%KEY%"=="" goto arrancar
echo GEMINI_API_KEY="%KEY%"> .env

:arrancar
echo.
echo Abriendo HAVAH en http://127.0.0.1:3000 ... NO cierres esta ventana mientras la uses.
start "" cmd /c "timeout /t 8 >nul & start http://127.0.0.1:3000"
call npm run dev
echo.
echo El servidor se detuvo. Si ves un error arriba, copialo y pegaselo a Claude.
pause
exit /b

:sinnode
echo.
echo No encuentro Node.js. Se abrira la pagina de descarga.
echo Instala la version LTS, reinicia la PC y vuelve a abrir este archivo.
start https://nodejs.org
pause
exit /b

:error
echo.
echo Hubo un error en la instalacion. Copia el texto de arriba y pegaselo a Claude.
if exist node_modules rmdir /s /q node_modules
pause
exit /b
