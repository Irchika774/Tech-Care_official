---
description: Deploy TechCare to production (Frontend to Netlify, Backend to Vercel)
---

# Deployment Workflow

// turbo-all

## Pre-Deployment Checks

1. Ensure all changes are saved
2. Run build to check for errors:
   // turbo
   ```bash
   npm run build
   ```

3. Check for TypeScript/ESLint errors
4. Verify environment variables are set

## Environment Variables Required

### Frontend (.env)
```
VITE_SUPABASE_URL=https://xfnyzjcgsfbdlphhvcrr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_API_URL=https://techcare-backend.vercel.app
VITE_STRIPE_PUBLIC_KEY=pk_...
VITE_GOOGLE_MAPS_KEY=AIza...
```

### Backend (.env)
```
SUPABASE_URL=https://xfnyzjcgsfbdlphhvcrr.supabase.co
SUPABASE_SERVICE_KEY=eyJ... (service role key)
STRIPE_SECRET_KEY=sk_...
GOOGLE_SHEETS_PRIVATE_KEY=...
GOOGLE_SHEETS_CLIENT_EMAIL=...
```

## Frontend Deployment (Netlify)

1. Push to GitHub:
   ```bash
   git add .
   git commit -m "[DEPLOY] Production build $(date +%Y-%m-%d)"
   git push origin main
   ```

2. Netlify auto-deploys from GitHub
3. Verify build at: https://techcare-official-new.netlify.app

## Backend Deployment (Vercel)

1. Ensure vercel.json is correct in /server
2. Push to GitHub (auto-deploys)
3. Verify at: https://techcare-backend.vercel.app/api/health

## Post-Deployment Verification

1. Check frontend loads
2. Check backend health endpoint
3. Test login flow
4. Test booking flow
5. Check mobile responsiveness

## Rollback Procedure

If issues found:
```bash
# Revert last commit
git revert HEAD
git push origin main
```

---

*Workflow Version: 1.0*
