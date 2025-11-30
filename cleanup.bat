@echo off
echo ╔════════════════════════════════════════════╗
echo ║      TechCare Process Cleanup              ║
echo ╚════════════════════════════════════════════╝
echo.

echo Stopping all Node.js processes...
echo.

REM Kill all node processes
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js processes stopped
) else (
    echo ℹ No Node.js processes were running
)

REM Kill all nodemon processes
taskkill /F /IM nodemon.exe >nul 2>&1

echo.
echo ══════════════════════════════════════════════
echo Cleanup Complete!
echo ══════════════════════════════════════════════
echo.
echo Ports 5000 and 5173 should now be available.
echo.
echo You can now run:
echo   - start-techcare.bat
echo   - start-simple.bat
echo.
pause
