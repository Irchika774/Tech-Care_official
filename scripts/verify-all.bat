@echo off
echo ╔════════════════════════════════════════════╗
echo ║    TechCare Comprehensive Verification     ║
echo ╚════════════════════════════════════════════╝
echo.

set PROJECT_DIR=%~dp0..\

echo Starting comprehensive verification...
echo.

echo [1/10] Checking project structure...
if exist "%PROJECT_DIR%package.json" (
    echo ✓ Root package.json found
) else (
    echo ✗ Root package.json NOT found
    goto :error
)

if exist "%PROJECT_DIR%server\package.json" (
    echo ✓ Server package.json found
) else (
    echo ✗ Server package.json NOT found
    goto :error
)

if exist "%PROJECT_DIR%server\index.js" (
    echo ✓ Server entry point found
) else (
    echo ✗ Server index.js NOT found
    goto :error
)

if exist "%PROJECT_DIR%src\App.jsx" (
    echo ✓ Frontend App.jsx found
) else (
    echo ✗ Frontend App.jsx NOT found
    goto :error
)

echo.
echo [2/10] Checking middleware files...
if exist "%PROJECT_DIR%server\middleware\auth.js" (
    echo ✓ Auth middleware found
) else (
    echo ✗ Auth middleware NOT found
    goto :error
)

if exist "%PROJECT_DIR%server\middleware\security.js" (
    echo ✓ Security middleware found
) else (
    echo ✗ Security middleware NOT found
    goto :error
)

echo.
echo [3/10] Checking route files...
if exist "%PROJECT_DIR%server\routes\customers.js" (
    echo ✓ Customer routes found
) else (
    echo ✗ Customer routes NOT found
    goto :error
)

if exist "%PROJECT_DIR%server\routes\technicians.js" (
    echo ✓ Technician routes found
) else (
    echo ✗ Technician routes NOT found
    goto :error
)

if exist "%PROJECT_DIR%server\routes\auth.js" (
    echo ✓ Auth routes found
) else (
    echo ✗ Auth routes NOT found
    goto :error
)

echo.
echo [4/10] Checking context providers...
if exist "%PROJECT_DIR%src\context\AuthContext.jsx" (
    echo ✓ AuthContext found
) else (
    echo ✗ AuthContext NOT found
    goto :error
)

if exist "%PROJECT_DIR%src\context\CurrencyContext.jsx" (
    echo ✓ CurrencyContext found
) else (
    echo ✗ CurrencyContext NOT found
    goto :error
)

if exist "%PROJECT_DIR%src\context\NotificationContext.jsx" (
    echo ✓ NotificationContext found
) else (
    echo ✗ NotificationContext NOT found
    goto :error
)

echo.
echo [5/10] Checking component files...
if exist "%PROJECT_DIR%src\components\ProtectedRoute.jsx" (
    echo ✓ ProtectedRoute found
) else (
    echo ✗ ProtectedRoute NOT found
    goto :error
)

if exist "%PROJECT_DIR%src\components\CurrencyDisplay.jsx" (
    echo ✓ CurrencyDisplay found
) else (
    echo ✗ CurrencyDisplay NOT found
    goto :error
)

if exist "%PROJECT_DIR%src\components\SEO.jsx" (
    echo ✓ SEO component found
) else (
    echo ✗ SEO component NOT found
    goto :error
)

echo.
echo [6/10] Checking page files...
if exist "%PROJECT_DIR%src\pages\CustomerDashboard.jsx" (
    echo ✓ CustomerDashboard found
) else (
    echo ✗ CustomerDashboard NOT found
    goto :error
)

if exist "%PROJECT_DIR%src\pages\TechnicianDashboard.jsx" (
    echo ✓ TechnicianDashboard found
) else (
    echo ✗ TechnicianDashboard NOT found
    goto :error
)

if exist "%PROJECT_DIR%src\pages\Bidding.jsx" (
    echo ✓ Bidding page found
) else (
    echo ✗ Bidding page NOT found
    goto :error
)

if exist "%PROJECT_DIR%src\pages\Schedule.jsx" (
    echo ✓ Schedule page found
) else (
    echo ✗ Schedule page NOT found
    goto :error
)

echo.
echo [7/10] Checking automation scripts...
if exist "%PROJECT_DIR%scripts\start-techcare.bat" (
    echo ✓ start-techcare.bat found
) else (
    echo ✗ start-techcare.bat NOT found
    goto :error
)

if exist "%PROJECT_DIR%scripts\cleanup.bat" (
    echo ✓ cleanup.bat found
) else (
    echo ✗ cleanup.bat NOT found
    goto :error
)

if exist "%PROJECT_DIR%health-monitor.js" (
    echo ✓ health-monitor.js found
) else (
    echo ✗ health-monitor.js NOT found
    goto :error
)

echo.
echo [8/10] Checking PWA files...
if exist "%PROJECT_DIR%public\manifest.json" (
    echo ✓ PWA manifest found
) else (
    echo ⚠ PWA manifest NOT found (optional)
)

if exist "%PROJECT_DIR%public\robots.txt" (
    echo ✓ robots.txt found
) else (
    echo ⚠ robots.txt NOT found (optional)
)

echo.
echo [9/10] Checking documentation...
if exist "%PROJECT_DIR%README.md" (
    echo ✓ README.md found
) else (
    echo ✗ README.md NOT found
    goto :error
)

if exist "%PROJECT_DIR%Documentation\COMPREHENSIVE_VERIFICATION.md" (
    echo ✓ Verification guide found
) else (
    echo ⚠ Verification guide NOT found
)

echo.
echo [10/10] Checking dependencies...
if exist "%PROJECT_DIR%node_modules" (
    echo ✓ Frontend dependencies installed
) else (
    echo ⚠ Frontend dependencies NOT installed
    echo   Run: npm install
)

if exist "%PROJECT_DIR%server\node_modules" (
    echo ✓ Backend dependencies installed
) else (
    echo ⚠ Backend dependencies NOT installed
    echo   Run: cd server && npm install
)

echo.
echo ══════════════════════════════════════════════
echo Verification Complete!
echo ══════════════════════════════════════════════
echo.
echo ✓ All critical files verified
echo ✓ Project structure correct
echo ✓ All components in place
echo.
echo Status: READY TO RUN
echo.
echo Next steps:
echo   1. Run: start-techcare.bat
echo   2. Open: http://localhost:5173
echo   3. Test all features
echo.
pause
exit /b 0

:error
echo.
echo ══════════════════════════════════════════════
echo ✗ Verification Failed!
echo ══════════════════════════════════════════════
echo.
echo Some critical files are missing.
echo Please check the errors above.
echo.
pause
exit /b 1
