@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>&1

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║        🚀 TechCare Auto-Sync & Deploy Pipeline 🚀           ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  This script will:                                          ║
echo ║    1. Stage all changes                                     ║
echo ║    2. Commit with auto-generated message                    ║
echo ║    3. Pull remote changes (if any)                          ║
echo ║    4. Push to GitHub (triggers Netlify auto-deploy)         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Navigate to project root
cd /d "%~dp0\.."

:: Check if we're in a git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Not a git repository!
    pause
    exit /b 1
)

:: Get current branch
for /f "tokens=*" %%a in ('git branch --show-current') do set "current_branch=%%a"
echo 📍 Current branch: %current_branch%
echo.

:: Step 1: Stage all changes
echo [1/4] 📦 Staging all changes...
git add .
echo      ✅ Changes staged

:: Check if there are changes to commit
git diff --cached --quiet
if errorlevel 1 (
    echo.
    echo [2/4] 📝 Committing changes...
    
    :: Generate commit message with timestamp
    for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set "datestamp=%%d-%%b-%%c"
    for /f "tokens=1-2 delims=: " %%a in ('time /t') do set "timestamp=%%a:%%b"
    set "commit_msg=Auto-sync: %datestamp% %timestamp%"
    
    git commit -m "!commit_msg!"
    echo      ✅ Committed: !commit_msg!
) else (
    echo.
    echo [2/4] ℹ️  No changes to commit
)

:: Step 3: Pull remote changes
echo.
echo [3/4] 🔄 Pulling remote changes...
git pull origin %current_branch% --rebase --autostash
if errorlevel 1 (
    echo      ⚠️  Pull failed. Attempting merge strategy...
    git pull origin %current_branch% --no-rebase --autostash
)
echo      ✅ Synced with remote

:: Step 4: Push to GitHub
echo.
echo [4/4] 🚀 Pushing to GitHub...
git push origin %current_branch%
if errorlevel 1 (
    echo      ❌ Push failed! Check your network or credentials.
    pause
    exit /b 1
)
echo      ✅ Pushed to origin/%current_branch%

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎉 SYNC COMPLETE! 🎉                      ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║  ✅ All changes pushed to GitHub                            ║
echo ║  🔄 Netlify will auto-deploy in ~1-2 minutes                ║
echo ║  🌐 Live site: https://techcare-official-new.netlify.app    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Closing in 5 seconds...
timeout /t 5 >nul
