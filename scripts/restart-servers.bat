@echo off
echo ========================================
echo   RESTARTING TECHCARE SERVERS
echo ========================================
echo.

echo [1/3] Stopping running Node processes...
taskkill /F /IM node.exe /T >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Starting backend server...
cd ..\server
start "TechCare Backend" cmd /k "npm run dev"
cd ..
timeout /t 5 /nobreak >nul

echo [3/3] Starting frontend server...
start "TechCare Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   SERVERS RESTARTED SUCCESSFULLY!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause >nul
