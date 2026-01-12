@echo off
echo ==========================================
echo    TechCare One-Click GitHub Sync
echo ==========================================
echo.
echo [1/3] Adding all changes...
git add .

echo [2/3] Committing changes...
:: Get current date and time for the generic commit message
set "commit_msg=Auto-sync: %date% %time%"
git commit -m "%commit_msg%"

echo [3/3] Pushing to GitHub (main branch)...
git push origin main

echo.
echo ==========================================
echo    Sync Complete!
echo ==========================================
timeout /t 5
