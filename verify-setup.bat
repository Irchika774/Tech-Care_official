@echo off
setlocal enabledelayedexpansion

echo ╔════════════════════════════════════════════╗
echo ║      TechCare Setup Verification           ║
echo ╚════════════════════════════════════════════╝
echo.

set "PROJECT_DIR=%~dp0"

echo Verifying TechCare setup...
echo.
echo Project Directory: %PROJECT_DIR%
echo.

REM Check if we're in the right directory
echo [1/5] Checking project structure...

if exist "%PROJECT_DIR%package.json" (
    echo ✓ Root package.json found
) else (
    echo ✗ Root package.json NOT found
    echo ERROR: Run this script from the project root directory
    pause
    exit /b 1
)

if exist "%PROJECT_DIR%server\package.json" (
    echo ✓ Server package.json found
) else (
    echo ✗ Server package.json NOT found
    echo ERROR: Server folder not found or incomplete
    pause
    exit /b 1
)

if exist "%PROJECT_DIR%health-monitor.js" (
    echo ✓ Health monitor found
) else (
    echo ✗ Health monitor NOT found
    echo WARNING: health-monitor.js missing
)

echo.
echo [2/5] Checking Node.js and npm...

where node >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js installed
    node --version
) else (
    echo ✗ Node.js NOT installed
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ npm installed
    npm --version
) else (
    echo ✗ npm NOT installed
    pause
    exit /b 1
)

echo.
echo [3/5] Checking frontend dependencies...
if exist "%PROJECT_DIR%node_modules" (
    echo ✓ Frontend node_modules exists
) else (
    echo ⚠ Frontend dependencies NOT installed
    echo Installing frontend dependencies...
    cd /d "%PROJECT_DIR%"
    call npm install
    if %errorlevel% neq 0 (
        echo ✗ Failed to install frontend dependencies
        pause
        exit /b 1
    )
    echo ✓ Frontend dependencies installed
)

echo.
echo [4/5] Checking backend dependencies...
if exist "%PROJECT_DIR%server\node_modules" (
    echo ✓ Backend node_modules exists
) else (
    echo ⚠ Backend dependencies NOT installed
    echo Installing backend dependencies...
    cd /d "%PROJECT_DIR%server"
    call npm install
    if %errorlevel% neq 0 (
        echo ✗ Failed to install backend dependencies
        pause
        exit /b 1
    )
    echo ✓ Backend dependencies installed
)

echo.
echo [5/5] Checking environment variables...
if exist "%PROJECT_DIR%server\.env" (
    echo ✓ Backend .env file exists
) else (
    echo ⚠ Backend .env file NOT found
    echo   You may need to create server/.env for database and API keys
)

if exist "%PROJECT_DIR%.env" (
    echo ✓ Frontend .env file exists
) else (
    echo ⚠ Frontend .env file NOT found  
    echo   You may need to create .env for Google Maps API
)

echo.
echo ══════════════════════════════════════════════
echo Verification Complete!
echo ══════════════════════════════════════════════
echo.
echo ✓ All checks passed!
echo.
echo You can now run:
echo   - start-techcare.bat (with health monitoring)
echo   - start-simple.bat (without monitoring)
echo.
echo Press any key to continue...
pause >nul
