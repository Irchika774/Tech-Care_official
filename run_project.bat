@echo off
echo Starting Tech-Care Project...

:: Start Backend
start "Tech-Care Backend" cmd /k "echo Starting Backend... & node server/index.js"

:: Start Frontend
start "Tech-Care Frontend" cmd /k "echo Starting Frontend... & npm run dev"

echo Servers are starting in separate windows.
pause
