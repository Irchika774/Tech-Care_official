@echo off
echo ╔════════════════════════════════════════════╗
echo ║      TechCare Development Launcher         ║
echo ╚════════════════════════════════════════════╝
echo.

REM Get the directory where this batch file is located
set PROJECT_DIR=%~dp0..\

echo Preparing to start TechCare platform...
echo.

REM Clean up any existing processes
echo [PRE-CHECK] Cleaning up existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Stopped existing Node.js processes
    timeout /t 2 /nobreak >nul
) else (
    echo ✓ No existing processes to clean
)

echo.
echo Project Directory: %PROJECT_DIR%
echo.

echo [1/3] Starting Backend Server in server folder...
start "TechCare Backend" cmd /k "cd /d "%PROJECT_DIR%server" && echo ══════════════════════════════════ && echo   TechCare Backend Server && echo   Directory: %cd% && echo   Port: 5000 && echo ══════════════════════════════════ && echo. && npm run dev"

timeout /t 5 /nobreak >nul

echo [2/3] Starting Frontend Server in root folder...
start "TechCare Frontend" cmd /k "cd /d "%PROJECT_DIR%" && echo ══════════════════════════════════ && echo   TechCare Frontend Server && echo   Directory: %cd% && echo   Port: 5173 && echo ══════════════════════════════════ && echo. && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Starting Backend Health Monitor...
start "TechCare Health Monitor" cmd /k "cd /d "%PROJECT_DIR%" && echo ══════════════════════════════════ && echo   TechCare Health Monitor && echo   Monitoring: http://localhost:5000 && echo   Interval: 30 seconds && echo ══════════════════════════════════ && echo. && node health-monitor.js"

timeout /t 2 /nobreak >nul

echo.
echo ══════════════════════════════════════════════
echo ✓ All services started successfully!
echo ══════════════════════════════════════════════
echo.
echo Three terminal windows should now be open:
echo   1. TechCare Backend    - http://localhost:5000
echo   2. TechCare Frontend   - http://localhost:5173
echo   3. TechCare Health Monitor
echo.
echo Waiting 10 seconds for services to start...
timeout /t 10 /nobreak >nul

echo.
echo Opening application in browser...
start http://localhost:5173

echo.
echo ══════════════════════════════════════════════
echo Application opened in browser!
echo ══════════════════════════════════════════════
echo.
echo To stop all services:
echo   - Close each terminal window individually
echo   - Or press Ctrl+C in each window
echo   - Or run cleanup.bat
echo.
echo Press any key to close this launcher window...
pause >nul
