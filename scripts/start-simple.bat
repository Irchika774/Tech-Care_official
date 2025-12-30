@echo off
echo ╔════════════════════════════════════════════╗
echo ║   TechCare Quick Start (No Monitoring)     ║
echo ╚════════════════════════════════════════════╝
echo.

set PROJECT_DIR=%~dp0..\

echo Starting TechCare...
echo.
echo Project Directory: %PROJECT_DIR%
echo.

echo [1/2] Starting Backend Server in server folder...
start "TechCare Backend" cmd /k "cd /d "%PROJECT_DIR%server" && echo ══════════════════════════════════ && echo   Backend Server - Port 5000 && echo   Directory: %cd% && echo ══════════════════════════════════ && echo. && npm run dev"

timeout /t 5 /nobreak >nul

echo [2/2] Starting Frontend Server in root folder...
start "TechCare Frontend" cmd /k "cd /d "%PROJECT_DIR%" && echo ══════════════════════════════════ && echo   Frontend Server - Port 5173 && echo   Directory: %cd% && echo ══════════════════════════════════ && echo. && npm run dev"

timeout /t 5 /nobreak >nul

echo.
echo ══════════════════════════════════════════════  
echo ✓ Services started in separate windows!
echo ══════════════════════════════════════════════
echo.
echo   Backend:  http://localhost:5000 (in server folder)
echo   Frontend: http://localhost:5173 (in root folder)
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul

start http://localhost:5173

echo.
echo Application opened!
echo.
echo Press any key to close this window...
pause >nul
