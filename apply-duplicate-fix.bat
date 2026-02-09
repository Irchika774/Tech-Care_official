@echo off
echo ============================================
echo Supabase Duplicate Fix - Instructions
echo ============================================
echo.
echo This script will help you apply the permanent
echo fix for duplicate technicians and users.
echo.
echo ============================================
echo Step 1: Apply Database Migration
echo ============================================
echo.
echo Option A - Using Supabase Dashboard (Recommended):
echo   1. Go to https://supabase.com/dashboard
echo   2. Select your project: tech-care-official-new
echo   3. Click "SQL Editor" in the left sidebar
echo   4. Click "New query"
echo   5. Open file: supabase\migrations\20260209170000_comprehensive_duplicate_fix.sql
echo   6. Copy ALL the SQL content
echo   7. Paste into the SQL Editor
echo   8. Click "Run" (or Ctrl+Enter)
echo.
echo Option B - Using Supabase CLI:
echo   1. Install CLI: npm install -g supabase
echo   2. Login: supabase login
echo   3. Link project: supabase link --project-ref <your-project-ref>
echo   4. Run: npx supabase db push
echo.
echo Option C - Using the automated script:
echo   node scripts/apply-migration.cjs --dry-run  (preview first)
echo   node scripts/apply-migration.cjs  (apply migration)
echo.
echo ============================================
echo Step 2: Deploy Frontend Changes
echo ============================================
echo.
echo Run these commands:
echo.
echo   npm install
echo   npm run build
echo.
echo ============================================
echo Step 3: Verify the Fix
echo ============================================
echo.
echo   node scripts/comprehensive-fix-duplicates.cjs
echo.
echo ============================================
echo What This Fix Does:
echo ============================================
echo.
echo ✓ Removes all existing duplicate technicians
echo ✓ Removes all existing duplicate customers
echo ✓ Adds unique constraints to prevent future duplicates
echo ✓ Adds triggers to block duplicate registrations
echo ✓ Updates registration code to check for duplicates
echo.
echo ============================================
echo.
pause
