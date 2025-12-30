@echo off
echo ===============================================
echo TechCare - Complete Cache Clear and Restart
echo ===============================================
echo.
echo This will stop all servers and restart fresh
echo.

echo Step 1: Stopping all Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Starting frontend...
start "TechCare Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo Step 3: Starting backend...
timeout /t 3 /nobreak >nul
start "TechCare Backend " cmd /k "cd /d %~dp0server && npm run dev"

echo.
echo ===============================================
echo Servers Restarted!
echo ===============================================
echo.
echo IMPORTANT: After servers start...
echo.
echo 1. Close ALL browser windows
echo 2. Open a FRESH browser window
echo 3. Go to: http://localhost:5173/landing/www.lithosquare.com/index.html
echo 4. Scroll to bottom - you'll see ALL footer content:
echo    - 4 Social Icons: LinkedIn, Twitter, Instagram, Facebook
echo    - 3 Legal Links: Privacy, Terms, Legal
echo    - Developed by Wenura credit
echo.
echo 5. Then go to: http://localhost:5173/
echo    - The homepage will show the landing page with complete footer
echo.
echo ===============================================
pause
