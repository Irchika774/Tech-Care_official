@echo off
echo Restarting TechCare Development Server...
echo.
echo Step 1: Stopping any running servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Starting frontend...
start "TechCare Frontend" cmd /k "cd /d %~dp0..\ && npm run dev"

echo.
echo Step 3: Starting backend...
timeout /t 3 /nobreak >nul
start "TechCare Backend" cmd /k "cd /d %~dp0..\server && npm run dev"

echo.
echo ===================================
echo TechCare Development Server Started
echo ===================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo After the servers start:
echo 1. Open http://localhost:5173 in your browser
echo 2. Press Ctrl+Shift+R (hard refresh) to clear cache
echo 3. You should see the updated navigation!
echo.
pause
